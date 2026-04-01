// app/api/stripe/create-session/route.js
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
        { status: 500 },
      );
    }

    const { type } = body;

    if (!type || !["event_ticket", "donation", "campaign"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 },
      );
    }

    if (type === "event_ticket") {
      const {
        eventId,
        eventSlug,
        eventName,
        adultQty = 0,
        kidQty = 0,
        adultPriceCents,
        kidPriceCents,
        customerEmail,
        customerPhone,
        full_name,
        additional_note,
        special_requests,
        kidAges = []
      } = body;

      if (!eventId || !eventName) {
        return NextResponse.json(
          { error: "Missing eventId or eventName" },
          { status: 400 },
        );
      }

      const adult = Number(adultQty);
      const kid = Number(kidQty);
      const adultPrice = Number(adultPriceCents);
      const kidPrice = Number(kidPriceCents);

      if (
        !Number.isFinite(adult) ||
        !Number.isFinite(kid) ||
        !Number.isFinite(adultPrice) ||
        !Number.isFinite(kidPrice)
      ) {
        return NextResponse.json(
          { error: "Invalid quantities or prices" },
          { status: 400 },
        );
      }

      if (adult < 0 || kid < 0 || adultPrice < 0 || kidPrice < 0) {
        return NextResponse.json(
          { error: "Quantities and prices cannot be negative" },
          { status: 400 },
        );
      }

      if (!Number.isInteger(adult) || !Number.isInteger(kid)) {
        return NextResponse.json(
          { error: "Ticket quantities must be whole numbers" },
          { status: 400 },
        );
      }

      if (adult + kid <= 0) {
        return NextResponse.json(
          { error: "Select at least one ticket" },
          { status: 400 },
        );
      }

      const subtotalCents = adult * adultPrice + kid * kidPrice;
      const processingFeeCents = Math.round(subtotalCents * 0.029 + 30);
      const totalCents = subtotalCents + processingFeeCents;

      const line_items = [];

      if (adult > 0) {
        line_items.push({
          price_data: {
            currency: "cad",
            product_data: {
              name: `${eventName} - Adult Ticket`,
            },
            unit_amount: adultPrice,
          },
          quantity: adult,
        });
      }

      if (kid > 0) {
        line_items.push({
          price_data: {
            currency: "cad",
            product_data: {
              name: `${eventName} - Kid Ticket`,
            },
            unit_amount: kidPrice,
          },
          quantity: kid,
        });
      }

      if (processingFeeCents > 0) {
        line_items.push({
          price_data: {
            currency: "cad",
            product_data: {
              name: "Processing fee",
            },
            unit_amount: processingFeeCents,
          },
          quantity: 1,
        });
      }

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          event_id: eventId,
          adult_qty: adult,
          kid_qty: kid,
          total_cents: totalCents,
          customer_email: customerEmail || null,
          customer_name: full_name || null,
          customer_phone: customerPhone || null,
          additional_notes: additional_note || null,
          special_requests: special_requests || null,
          status: "pending",
          kids_ages: kidAges.map(Number),
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Order insert error:", orderError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 },
        );
      }

      createdRecord = { table: "orders", id: order.id };

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        payment_method_types: ["card"],
        success_url: `${appUrl}/events/${eventSlug}?success=1`,
        cancel_url: `${appUrl}/events/${eventSlug}?canceled=1`,
        customer_email: customerEmail || undefined,
        client_reference_id: order.id,
        metadata: {
          paymentKind: "event_ticket",
          orderId: order.id,
          eventId,
          adultQty: String(adult),
          kidQty: String(kid),
          adultPriceCents: String(adultPrice),
          kidPriceCents: String(kidPrice),
        },
      });

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          stripe_session_id: session.id,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Order session update error:", updateError);
        return NextResponse.json(
          { error: "Failed to save checkout session" },
          { status: 500 },
        );
      }

      return NextResponse.json({ url: session.url });
    }

    // donation or campaign
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
        { status: 400 },
      );
    }

    if (type === "campaign" && !campaignId) {
      return NextResponse.json(
        { error: "campaignId is required for campaign donations" },
        { status: 400 },
      );
    }

    if (type === "donation" && campaignId) {
      return NextResponse.json(
        { error: "General donation should not include campaignId" },
        { status: 400 },
      );
    }

    const processingFeeCents = Math.round(amount * 0.029 + 30);
    const totalCents = amount + processingFeeCents;

    const line_items = [
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
    ];

    if (processingFeeCents > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Processing fee",
          },
          unit_amount: processingFeeCents,
        },
        quantity: 1,
      });
    }

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
        { status: 500 },
      );
    }

    createdRecord = { table: "donations", id: donation.id };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
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
        donationType: type, // "donation" or "campaign"
        campaignId: campaignId || "",
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("donations")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", donation.id);

    if (updateError) {
      console.error("Donation session update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save donation checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);

    if (createdRecord) {
      const { table, id } = createdRecord;

      const { error: cleanupError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("id", id)
        .eq("status", "pending");

      if (cleanupError) {
        console.error(`Failed to clean up pending ${table} row:`, cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
