import { NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/../lib/stripe";
import { supabaseAdmin } from "@/../lib/supabase-admin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const fmt = (cents) => "$" + (Number(cents) / 100).toFixed(2) + " CAD";

function formatEventDate(isoDate) {
  const raw = new Date(isoDate)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();

  return raw.replace(/(\d+\s)([a-z])/, (_, p1, p2) => p1 + p2.toUpperCase());
}

function buildTicketEmailHtml({
  eventTitle,
  eventDate,
  doorsOpen,
  venue,
  address,
  ticketRowsForEmail,
  subtotalCents,
  processingFeeCents,
  totalCents,
}) {
  const th =
    "padding:10px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;text-align:center;border-bottom:1px solid #e5e7eb;";
  const td =
    "padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:center;";

  const ticketRows =
    ticketRowsForEmail.length > 0
      ? ticketRowsForEmail
          .map((t, i) => {
            const bg = i % 2 === 0 ? "#ffffff" : "#f9f9f9";

            return (
              `<tr style="background-color:${bg};">` +
              `<td style="${td}color:#374151;">${i + 1}</td>` +
              `<td style="${td}"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:600;background-color:#dbeafe;color:#1d4ed8;">${t.ticket_type}</span></td>` +
              `<td style="${td}color:#111827;font-weight:600;">${fmt(t.unit_price_cents)}</td>` +
              `</tr>`
            );
          })
          .join("")
      : `<tr><td colspan="3" style="padding:16px;text-align:center;color:#9ca3af;font-size:14px;">No tickets were generated.</td></tr>`;

  const venueRow = venue
    ? `<tr><td style="padding:8px 0;font-size:14px;color:#6b7280;">&#128205; Venue</td><td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">${venue}</td></tr>`
    : "";

  const addressRow = address
    ? `<tr><td style="padding:8px 0;font-size:14px;color:#6b7280;">&#128506;&#65039; Address</td><td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">${address}</td></tr>`
    : "";

  const dateCell =
    eventDate + (doorsOpen ? ` | Doors open at ${doorsOpen}` : "");

  return (
    `<div style="background-color:#f3f4f6;padding:40px 0;font-family:Arial,sans-serif;">` +
    `<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">` +
    `<div style="background-color:#1d4ed8;padding:32px 40px;text-align:center;">` +
    `<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">&#127903;&#65039; Your Tickets Are Confirmed</h1>` +
    `<p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Thank you for your purchase &mdash; we look forward to seeing you!</p>` +
    `</div>` +
    `<div style="padding:32px 40px 24px;">` +
    `<h2 style="margin:0 0 16px;font-size:18px;color:#111827;">${eventTitle}</h2>` +
    `<table style="width:100%;border-collapse:collapse;">` +
    `<tr><td style="padding:8px 0;font-size:14px;color:#6b7280;width:100px;">&#128197; Date</td><td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">${dateCell}</td></tr>` +
    venueRow +
    addressRow +
    `</table></div>` +
    `<div style="height:1px;background-color:#e5e7eb;margin:0 40px;"></div>` +
    `<div style="padding:24px 40px 32px;">` +
    `<h3 style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Your Tickets (${ticketRowsForEmail.length})</h3>` +
    `<table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">` +
    `<thead><tr style="background-color:#f9fafb;">` +
    `<th style="${th}">#</th><th style="${th}">Type</th><th style="${th}">Price</th>` +
    `</tr></thead>` +
    `<tbody>${ticketRows}</tbody>` +
    `<tfoot>` +
    `<tr style="background-color:#f9fafb;"><td colspan="2" style="padding:12px 16px;font-size:13px;color:#6b7280;text-align:right;border-top:2px solid #e5e7eb;">Subtotal</td><td style="padding:12px 16px;font-size:13px;color:#374151;text-align:center;border-top:2px solid #e5e7eb;">${fmt(subtotalCents)}</td></tr>` +
    `<tr style="background-color:#f9fafb;"><td colspan="2" style="padding:12px 16px;font-size:13px;color:#6b7280;text-align:right;">Processing fee</td><td style="padding:12px 16px;font-size:13px;color:#374151;text-align:center;">${fmt(processingFeeCents)}</td></tr>` +
    `<tr style="background-color:#eff6ff;"><td colspan="2" style="padding:14px 16px;font-size:15px;font-weight:700;color:#1d4ed8;text-align:right;">Total</td><td style="padding:14px 16px;font-size:15px;font-weight:700;color:#1d4ed8;text-align:center;">${fmt(totalCents)}</td></tr>` +
    `</tfoot></table></div>` +
    `<div style="background-color:#eff6ff;border-top:1px solid #dbeafe;padding:20px 40px;text-align:center;">` +
    `<p style="margin:0;font-size:13px;color:#1d4ed8;">&#128242; Please present this email at the door on the day of the event.</p>` +
    `</div></div>` +
    `<p style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af;">Hands of Hope &bull; tickets@handsofhopeorg.ca</p>` +
    `</div>`
  );
}

function buildDonationEmailHtml({ campaignTitle, amountDollars }) {
  return (
    `<div style="font-family:Arial,sans-serif;line-height:1.6;">` +
    `<h2>Thank you for your generous donation!</h2>` +
    `<p>Your contribution means a great deal to us and to those we serve.</p>` +
    (campaignTitle ? `<p><strong>Campaign:</strong> ${campaignTitle}</p>` : "") +
    `<p><strong>Amount:</strong> $${amountDollars} CAD</p>` +
    `<p>A receipt has been recorded for your donation. If you have any questions, please reach out to us.</p>` +
    `<p>With gratitude,<br />Hands of Hope</p>` +
    `</div>`
  );
}

async function handleEventTicket(session, metadata) {
  const orderId = metadata.orderId || session.client_reference_id || null;

  if (!orderId) {
    console.error("No orderId found for event ticket session");
    return;
  }

  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      status,
      event_id,
      customer_email,
      ticket_email_sent,
      events (
        title,
        event_date,
        venue,
        address,
        doors_open
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (orderFetchError || !order) {
    console.error("Order not found:", orderFetchError);
    return;
  }

  const customerEmail =
    session.customer_details?.email || order.customer_email || null;

  if (order.status !== "paid") {
    const { error: orderUpdateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        stripe_session_id: session.id,
        customer_email: customerEmail,
      })
      .eq("id", orderId);

    if (orderUpdateError) {
      console.error("Failed to update order:", orderUpdateError);
      return;
    }
  }

  const { data: orderItems, error: orderItemsError } = await supabaseAdmin
    .from("order_items")
    .select(
      `
      id,
      quantity,
      unit_price_cents,
      ticket_name,
      ticket_type_id,
      event_ticket_types (
        id,
        name,
        max_quantity
      )
    `
    )
    .eq("order_id", orderId);

  if (orderItemsError || !orderItems?.length) {
    console.error("Failed to fetch order_items:", orderItemsError);
    return;
  }

  const ticketRowsForEmail = [];

  for (const item of orderItems) {
    const ticketName =
      item.ticket_name || item.event_ticket_types?.name || "Ticket";

    const multiplier = Number(item.event_ticket_types?.max_quantity ?? 1);
    const physicalCount = Number(item.quantity) * multiplier;

    // for (let i = 0; i < physicalCount; i++) {
      ticketRowsForEmail.push({
        ticket_type: ticketName,
        unit_price_cents: item.unit_price_cents,
      });
    // }
  }

  const { data: existingTickets, error: existingTicketsError } =
    await supabaseAdmin
      .from("tickets")
      .select("id, ticket_code, ticket_type, ticket_type_id")
      .eq("order_id", orderId);

  if (existingTicketsError) {
    console.error("Failed to check existing tickets:", existingTicketsError);
    return;
  }

  if (!existingTickets || existingTickets.length === 0) {
    const ticketsToInsert = [];

    for (const item of orderItems) {
      const ticketName =
        item.ticket_name || item.event_ticket_types?.name || "Ticket";

      const multiplier = Number(item.event_ticket_types?.max_quantity ?? 1);
      const physicalCount = Number(item.quantity) * multiplier;

      for (let i = 0; i < physicalCount; i++) {
        ticketsToInsert.push({
          order_id: orderId,
          event_id: order.event_id,
          ticket_type: ticketName,
          ticket_type_id: item.ticket_type_id || null,
          ticket_code: crypto.randomUUID(),
          status: "valid",
        });
      }
    }

    if (ticketsToInsert.length > 0) {
      const { error: ticketsError } = await supabaseAdmin
        .from("tickets")
        .insert(ticketsToInsert);

      if (ticketsError) {
        console.error("Failed to insert tickets:", ticketsError);
        return;
      }

    }
  }

  if (!customerEmail) {
    console.warn(`No customer email for order ${orderId} — skipping email`);

    await supabaseAdmin
      .from("orders")
      .update({ ticket_email_sent: true })
      .eq("id", orderId);

    return;
  }

  if (order.ticket_email_sent) {
    console.log(`Ticket email already sent for order ${orderId}`);
    return;
  }

  const subtotalCents =
    Number(metadata.subtotalCents) ||
    orderItems.reduce(
      (sum, item) =>
        sum + Number(item.quantity) * Number(item.unit_price_cents),
      0
    );

  const processingFeeCents = Number(metadata.processingFeeCents || 0);
  const totalCents =
    Number(metadata.totalCents) || subtotalCents + processingFeeCents;

  const ev = order.events;

  const emailHtml = buildTicketEmailHtml({
    eventTitle: ev?.title || "Your event",
    eventDate: ev?.event_date ? formatEventDate(ev.event_date) : "",
    doorsOpen: ev?.doors_open || "",
    venue: ev?.venue || "",
    address: ev?.address || "",
    ticketRowsForEmail,
    subtotalCents,
    processingFeeCents,
    totalCents,
  });

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: "Hands of Hope <tickets@handsofhopeorg.ca>",
    to: customerEmail,
    subject: `Your tickets for ${ev?.title || "the event"}`,
    html: emailHtml,
  });

  if (emailError) {
    console.error("Failed to send ticket email:", emailError);
    return;
  }

  console.log("Ticket email sent:", emailData?.id);

  const { error: markSentError } = await supabaseAdmin
    .from("orders")
    .update({ ticket_email_sent: true })
    .eq("id", orderId);

  if (markSentError) {
    console.error("Failed to mark ticket_email_sent:", markSentError);
  }
}

async function handleDonation(session, metadata) {
  const donationId = metadata.donationId || session.client_reference_id || null;

  if (!donationId) {
    console.error("No donationId found for donation session");
    return;
  }

  const { data: donation, error: donationFetchError } = await supabaseAdmin
    .from("donations")
    .select("id, status, campaign_id, donor_email, amount_cents")
    .eq("id", donationId)
    .single();

  if (donationFetchError || !donation) {
    console.error("Donation not found:", donationFetchError);
    return;
  }

  if (donation.status === "paid") {
    console.log(`Donation ${donationId} already processed`);
    return;
  }

  const donorEmail =
    session.customer_details?.email || donation.donor_email || null;

  const { error: donationUpdateError } = await supabaseAdmin
    .from("donations")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      stripe_session_id: session.id,
      donor_email: donorEmail,
    })
    .eq("id", donationId)
    .neq("status", "paid");

  if (donationUpdateError) {
    console.error("Failed to update donation:", donationUpdateError);
    return;
  }

  if (!donorEmail) {
    console.warn(`No donor email for donation ${donationId} — skipping email`);
    return;
  }

  const campaignTitle =
    metadata.campaignTitle ||
    (donation.campaign_id ? "your chosen campaign" : null);

  const donationOnlyCents = Number(
    metadata.amountCents || donation.amount_cents || 0
  );

  const amountDollars = (donationOnlyCents / 100).toFixed(2);

  const { error: emailError } = await resend.emails.send({
    from: "Hands of Hope <no-reply@handsofhopeorg.ca>",
    to: donorEmail,
    subject: "Thank you for your donation!",
    html: buildDonationEmailHtml({
      campaignTitle,
      amountDollars,
    }),
  });

  if (emailError) {
    console.error("Failed to send donation confirmation email:", emailError);
  }
}

export async function POST(req) {

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    console.log("Processing Stripe event:", event.type, "ID:", event.id);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const paymentKind = metadata.paymentKind;

      if (paymentKind === "event_ticket") {
        await handleEventTicket(session, metadata);
      } else if (paymentKind === "donation") {
        await handleDonation(session, metadata);
      } else {
        console.error("Unknown paymentKind:", paymentKind);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}