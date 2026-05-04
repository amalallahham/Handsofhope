import { NextResponse } from "next/server";
import { stripe } from "@/../lib/stripe";
import { supabaseAdmin } from "@/../lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req) {
  let createdRecord = null;

  try {
    const body = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl || !/^https?:\/\//.test(appUrl)) {
      return NextResponse.json(
        { error: "Invalid NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    const { type } = body;

    if (!type || !["event_ticket", "donation", "campaign"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

    if (type === "event_ticket") {
      const {
        eventId,
        eventSlug,
        eventName,
        lineItems = [],
        customerEmail,
        customerPhone,
        full_name,
        special_requests,
      } = body;

      if (!eventId || !eventName || !eventSlug) {
        return NextResponse.json(
          { error: "Missing eventId, eventName, or eventSlug" },
          { status: 400 }
        );
      }

      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        return NextResponse.json(
          { error: "No line items provided" },
          { status: 400 }
        );
      }

      for (const item of lineItems) {
        if (
          !item.ticketTypeId ||
          !item.name ||
          !Number.isFinite(Number(item.priceCents)) ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0
        ) {
          return NextResponse.json(
            { error: `Invalid line item: ${item.name || item.ticketTypeId}` },
            { status: 400 }
          );
        }
      }

      const subtotalCents = lineItems.reduce(
        (sum, item) => sum + Number(item.priceCents) * Number(item.quantity),
        0
      );

      const processingFeeCents = Math.round(subtotalCents * 0.029 + 30);
      const computedTotalCents = subtotalCents + processingFeeCents;

      const totalTickets = lineItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          event_id: eventId,

          // Keep these only for old schema compatibility.
          // New ticket details are stored in order_items.
          adult_qty: totalTickets,
          kid_qty: 0,

          total_cents: computedTotalCents,
          customer_email: customerEmail || null,
          customer_name: full_name || null,
          customer_phone: customerPhone || null,
          special_requests: special_requests || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Order insert error:", orderError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }

      createdRecord = { table: "orders", id: order.id };

      const { error: orderItemsError } = await supabaseAdmin
        .from("order_items")
        .insert(
          lineItems.map((item) => ({
            order_id: order.id,
            ticket_type_id: item.ticketTypeId,
            ticket_name: item.name,
            quantity: Number(item.quantity),
            unit_price_cents: Number(item.priceCents),

            // Do NOT insert total_cents if it is generated in SQL.
          }))
        );

      if (orderItemsError) {
        console.error("order_items insert error:", orderItemsError);

        await supabaseAdmin
          .from("orders")
          .delete()
          .eq("id", order.id)
          .eq("status", "pending");

        return NextResponse.json(
          { error: "Failed to save order items" },
          { status: 500 }
        );
      }

      const stripeLineItems = [
        ...lineItems.map((item) => ({
          price_data: {
            currency: "cad",
            product_data: {
              name: `${eventName} - ${item.name}`,
            },
            unit_amount: Number(item.priceCents),
          },
          quantity: Number(item.quantity),
        })),
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Processing fee",
            },
            unit_amount: processingFeeCents,
          },
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: stripeLineItems,
        payment_method_types: ["card"],
        success_url: `${appUrl}/events/${eventSlug}?success=1`,
        cancel_url: `${appUrl}/events/${eventSlug}?canceled=1`,
        customer_email: customerEmail || undefined,
        client_reference_id: order.id,
        metadata: {
          paymentKind: "event_ticket",
          orderId: order.id,
          eventId,
          subtotalCents: String(subtotalCents),
          processingFeeCents: String(processingFeeCents),
          totalCents: String(computedTotalCents),
        },
      });

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);

      if (updateError) {
        console.error("Order session update error:", updateError);
        return NextResponse.json(
          { error: "Failed to save checkout session" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: session.url });
    }

    const {
      amountCents,
      donorName,
      donorEmail,
      note,
      campaignId = null,
      campaignTitle = null,
    } = body;

    const amount = Number(amountCents);

    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    if (type === "campaign" && !campaignId) {
      return NextResponse.json(
        { error: "campaignId is required for campaign donations" },
        { status: 400 }
      );
    }

    if (type === "donation" && campaignId) {
      return NextResponse.json(
        { error: "General donation should not include campaignId" },
        { status: 400 }
      );
    }

    const processingFeeCents = Math.round(amount * 0.029 + 30);
    const totalCents = amount + processingFeeCents;

    const { data: donation, error: donationError } = await supabaseAdmin
      .from("donations")
      .insert({
        donor_name: donorName || null,
        donor_email: donorEmail || null,
        amount_cents: totalCents,
        campaign_name: type === "campaign" ? campaignTitle || null : null,
        note: note || null,
        status: "pending",
        campaign_id: type === "campaign" ? campaignId : null,
      })
      .select("id")
      .single();

    if (donationError || !donation) {
      console.error("Donation insert error:", donationError);
      return NextResponse.json(
        { error: "Failed to create donation" },
        { status: 500 }
      );
    }

    createdRecord = { table: "donations", id: donation.id };

    const donationSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name:
                type === "campaign"
                  ? `Donation - ${campaignTitle || "Campaign"}`
                  : "General Donation",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Processing fee",
            },
            unit_amount: processingFeeCents,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        type === "campaign" && campaignId
          ? `${appUrl}/campaigns/${campaignId}?canceled=1`
          : `${appUrl}/donate?canceled=1`,
      customer_email: donorEmail || undefined,
      client_reference_id: donation.id,
      metadata: {
        paymentKind: "donation",
        donationId: donation.id,
        donationType: type,
        campaignId: campaignId || "",
        campaignTitle: campaignTitle || "",
        amountCents: String(amount),
        processingFeeCents: String(processingFeeCents),
        totalCents: String(totalCents),
      },
    });

    const { error: donationUpdateError } = await supabaseAdmin
      .from("donations")
      .update({ stripe_session_id: donationSession.id })
      .eq("id", donation.id);

    if (donationUpdateError) {
      console.error("Donation session update error:", donationUpdateError);
      return NextResponse.json(
        { error: "Failed to save donation checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: donationSession.url });
  } catch (error) {
    console.error("Create checkout session error:", error);

    if (createdRecord) {
      await supabaseAdmin
        .from(createdRecord.table)
        .delete()
        .eq("id", createdRecord.id)
        .eq("status", "pending");
    }

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}