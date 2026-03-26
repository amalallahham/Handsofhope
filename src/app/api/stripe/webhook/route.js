// app/api/webhook/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/../lib/stripe";
import { supabaseAdmin } from "@/../lib/supabase-admin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  console.log("Received Stripe webhook request POST /api/stripe/webhook");
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  try {
    console.log("Processing Stripe event:", event.type, "ID:", event.id);
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Received checkout.session.completed event:", event.id);

        const session = event.data.object;
        const metadata = session.metadata || {};
        const paymentKind = metadata.paymentKind;

        // ─── EVENT TICKET ────────────────────────────────────────────────────
        if (paymentKind === "event_ticket") {
          const orderId =
            metadata.orderId || session.client_reference_id || null;

          if (!orderId) {
            console.error("No orderId found for event ticket session");
            break;
          }

          const { data: order, error: orderFetchError } = await supabaseAdmin
            .from("orders")
            .select(
              `
              id,
              status,
              event_id,
              adult_qty,
              kid_qty,
              customer_email,
              ticket_email_sent,
              events (
                id,
                title,
                event_date,
                venue,
                address,
                doors_open
              )
            `,
            )
            .eq("id", orderId)
            .single();

          if (orderFetchError || !order) {
            console.error("Order not found:", orderFetchError);
            break;
          }

          if (order.status === "paid" && order.ticket_email_sent) {
            console.log(`Order ${orderId} already fully processed`);
            break;
          }

          // FIX: use session.customer_details.email consistently (same as donation branch)
          const customerEmail =
            session.customer_details?.email || order.customer_email || null;

          // Mark order as paid
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
            break;
          }


          // Generate or retrieve tickets
          const adultQty = Number(metadata?.adultQty || order.adult_qty || 0);
          const kidQty = Number(metadata?.kidQty || order.kid_qty || 0);
          const totalExpectedTickets = adultQty + kidQty;

          let finalTickets = [];

          const { data: existingTickets, error: existingTicketsError } =
            await supabaseAdmin
              .from("tickets")
              .select("id, ticket_code, ticket_type")
              .eq("order_id", order.id);

          if (existingTicketsError) {
            console.error(
              "Failed to check existing tickets:",
              existingTicketsError,
            );
            break;
          }

          if (existingTickets && existingTickets.length > 0) {
            finalTickets = existingTickets;
          } else if (totalExpectedTickets > 0) {
            const ticketsToInsert = [];

            for (let i = 0; i < adultQty; i++) {
              ticketsToInsert.push({
                order_id: order.id,
                event_id: order.event_id,
                ticket_type: "adult",
                ticket_code: crypto.randomUUID(),
                status: "valid",
              });
            }

            for (let i = 0; i < kidQty; i++) {
              ticketsToInsert.push({
                order_id: order.id,
                event_id: order.event_id,
                ticket_type: "child",
                ticket_code: crypto.randomUUID(),
                status: "valid",
              });
            }

            const { data: insertedTickets, error: ticketsError } =
              await supabaseAdmin
                .from("tickets")
                .insert(ticketsToInsert)
                .select("id, ticket_code, ticket_type");

            if (ticketsError) {
              console.error("Failed to insert tickets:", ticketsError);
              break;
            }

            finalTickets = insertedTickets || [];

          }

          // FIX: don't break if no email — mark ticket_email_sent so Stripe stops retrying
          if (!customerEmail) {
            console.warn(
              "No customer email found for order:",
              orderId,
              "— skipping email",
            );
            await supabaseAdmin
              .from("orders")
              .update({ ticket_email_sent: true })
              .eq("id", order.id);
            break;
          }


          if (order.ticket_email_sent) {
            console.log(`Ticket email already sent for order ${orderId}`);
            break;
          }

          // ── Pricing helpers ───────────────────────────────────────────────
          const adultPriceCents = Number(metadata?.adultPriceCents || 0);
          const kidPriceCents = Number(metadata?.kidPriceCents || 0);
          const fmt = (cents) => "$" + (cents / 100).toFixed(2) + " CAD";

          const subtotalCents =
            adultQty * adultPriceCents + kidQty * kidPriceCents;
          const processingFeeCents = Math.round(subtotalCents * 0.029 + 30);
          const totalCents = subtotalCents + processingFeeCents;

          const formattedDateRaw = new Date(order.events.event_date)
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .toLowerCase();

          // capitalize first letter of month
          const formattedDate = formattedDateRaw.replace(
            /(\d+\s)([a-z])/,
            (match, p1, p2) => p1 + p2.toUpperCase(),
          );

          // ── Email strings (no nested template literals) ───────────────────
          const eventTitle = order.events?.title || "Your event";
          const eventDate = order.events?.event_date ? formattedDate : "";
          const door_open = order.events?.doors_open || "";



          const venue = order.events?.venue || "";
          const address = order.events?.address || "";

          const thStyle =
            "padding:10px 16px;font-size:12px;font-weight:700;text-transform:uppercase;" +
            "letter-spacing:0.5px;color:#6b7280;text-align:center;border-bottom:1px solid #e5e7eb;";

          const cellStyle =
            "padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:center;";

          const ticketRows =
            finalTickets.length > 0
              ? finalTickets
                  .map((ticket, index) => {
                    const priceCents =
                      ticket.ticket_type === "adult"
                        ? adultPriceCents
                        : kidPriceCents;
                    const rowBg = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
                    const badgeBg =
                      ticket.ticket_type === "adult" ? "#dbeafe" : "#fce7f3";
                    const badgeColor =
                      ticket.ticket_type === "adult" ? "#1d4ed8" : "#be185d";
                    return (
                      '<tr style="background-color:' +
                      rowBg +
                      ';">' +
                      '<td style="' +
                      cellStyle +
                      'color:#374151;">' +
                      (index + 1) +
                      "</td>" +
                      '<td style="' +
                      cellStyle +
                      'color:#374151;">' +
                      '<span style="display:inline-block;padding:3px 10px;border-radius:9999px;' +
                      "font-size:12px;font-weight:600;text-transform:capitalize;" +
                      "background-color:" +
                      badgeBg +
                      ";color:" +
                      badgeColor +
                      ';">' +
                      ticket.ticket_type +
                      "</span>" +
                      "</td>" +
                      '<td style="' +
                      cellStyle +
                      'color:#111827;font-weight:600;">' +
                      fmt(priceCents) +
                      "</td>" +
                      "</tr>"
                    );
                  })
                  .join("")
              : '<tr><td colspan="3" style="padding:16px;text-align:center;color:#9ca3af;font-size:14px;">No tickets were generated.</td></tr>';

          const summaryRows =
            '<tr style="background-color:#f9fafb;">' +
            '<td colspan="2" style="padding:12px 16px;font-size:13px;color:#6b7280;text-align:right;border-top:2px solid #e5e7eb;">Subtotal</td>' +
            '<td style="padding:12px 16px;font-size:13px;color:#374151;text-align:center;border-top:2px solid #e5e7eb;">' +
            fmt(subtotalCents) +
            "</td>" +
            "</tr>" +
            '<tr style="background-color:#f9fafb;">' +
            '<td colspan="2" style="padding:12px 16px;font-size:13px;color:#6b7280;text-align:right;">Processing fee</td>' +
            '<td style="padding:12px 16px;font-size:13px;color:#374151;text-align:center;">' +
            fmt(processingFeeCents) +
            "</td>" +
            "</tr>" +
            '<tr style="background-color:#eff6ff;">' +
            '<td colspan="2" style="padding:14px 16px;font-size:15px;font-weight:700;color:#1d4ed8;text-align:right;">Total</td>' +
            '<td style="padding:14px 16px;font-size:15px;font-weight:700;color:#1d4ed8;text-align:center;">' +
            fmt(totalCents) +
            "</td>" +
            "</tr>";

          const venueRow = venue
            ? '<tr><td style="padding:8px 0;font-size:14px;color:#6b7280;">&#128205; Venue</td>' +
              '<td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">' +
              venue +
              "</td></tr>"
            : "";

          const addressRow = address
            ? '<tr><td style="padding:8px 0;font-size:14px;color:#6b7280;">&#128506;&#65039; Address</td>' +
              '<td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">' +
              address +
              "</td></tr>"
            : "";

          const emailHtml =
            '<div style="background-color:#f3f4f6;padding:40px 0;font-family:Arial,sans-serif;">' +
            '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">' +
            // Header
            '<div style="background-color:#1d4ed8;padding:32px 40px;text-align:center;">' +
            '<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">&#127903;&#65039; Your Tickets Are Confirmed</h1>' +
            '<p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Thank you for your purchase &mdash; we look forward to seeing you!</p>' +
            "</div>" +
            // Event details
            '<div style="padding:32px 40px 24px;">' +
            '<h2 style="margin:0 0 16px;font-size:18px;color:#111827;">' +
            eventTitle +
            "</h2>" +
            '<table style="width:100%;border-collapse:collapse;">' +
            "<tr>" +
            '<td style="padding:8px 0;font-size:14px;color:#6b7280;width:100px;">&#128197; Date</td>' +
            '<td style="padding:8px 0;font-size:14px;color:#111827;font-weight:600;">' +
            eventDate + " " + (door_open ? `| Doors open at ${door_open}` : "") +
            "</td>" +
            "</tr>" +
            venueRow +
            addressRow +
            "</table>" +
            "</div>" +
            // Divider
            '<div style="height:1px;background-color:#e5e7eb;margin:0 40px;"></div>' +
            // Tickets table
            '<div style="padding:24px 40px 32px;">' +
            '<h3 style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">' +
            "Your Tickets (" +
            finalTickets.length +
            ")" +
            "</h3>" +
            '<table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">' +
            "<thead>" +
            '<tr style="background-color:#f9fafb;">' +
            '<th style="' +
            thStyle +
            '">#</th>' +
            '<th style="' +
            thStyle +
            '">Type</th>' +
            '<th style="' +
            thStyle +
            '">Price</th>' +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            ticketRows +
            "</tbody>" +
            "<tfoot>" +
            summaryRows +
            "</tfoot>" +
            "</table>" +
            "</div>" +
            // Footer note
            '<div style="background-color:#eff6ff;border-top:1px solid #dbeafe;padding:20px 40px;text-align:center;">' +
            '<p style="margin:0;font-size:13px;color:#1d4ed8;">&#128242; Please present this email at the door on the day of the event.</p>' +
            "</div>" +
            "</div>" +
            '<p style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af;">Hands of Hope &bull; tickets@handsofhopeorg.ca</p>' +
            "</div>";

          const { data: emailData, error: emailError } =
            await resend.emails.send({
              from: "Hands of Hope <tickets@handsofhopeorg.ca>",
              to: customerEmail,
              subject: "Your tickets for " + eventTitle,
              html: emailHtml,
            });

          if (emailError) {
            console.error("Failed to send ticket email:", emailError);
            break;
          }

          const { error: markEmailSentError } = await supabaseAdmin
            .from("orders")
            .update({ ticket_email_sent: true })
            .eq("id", order.id);

          if (markEmailSentError) {
            console.error(
              "Failed to mark ticket_email_sent:",
              markEmailSentError,
            );
            break;
          }

          console.log("Ticket email sent:", emailData?.id);
          break;
        }

        // ─── DONATION ────────────────────────────────────────────────────────
        if (paymentKind === "donation") {
          const donationId =
            metadata.donationId || session.client_reference_id || null;

          if (!donationId) {
            console.error("No donationId found for donation session");
            break;
          }

          const { data: donation, error: donationFetchError } =
            await supabaseAdmin
              .from("donations")
              // FIX: also select amount_cents_net (the intended donation before fee)
              // For now fetch both so we can display the right amount in the email
              .select("id, status, campaign_id, donor_email, amount_cents")
              .eq("id", donationId)
              .single();

          if (donationFetchError || !donation) {
            console.error("Donation not found:", donationFetchError);
            break;
          }

          if (donation.status === "paid") {
            console.log(`Donation ${donationId} already processed`);
            break;
          }

          // FIX: use session.customer_details?.email consistently
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
            break;
          }

          if (donation.campaign_id) {
            console.log(`Campaign donation ${donationId} marked as paid`);
          } else {
            console.log(`General donation ${donationId} marked as paid`);
          }

          // Send donation confirmation email
          if (donorEmail) {
            // FIX: metadata.campaignTitle is now passed from create-session (see note below)
            const campaignTitle =
              metadata.campaignTitle ||
              (donation.campaign_id ? "your chosen campaign" : null);

            // FIX: amount_cents in the donations table is the total including processing fee.
            // Back-calculate the intended donation amount to show the donor the correct figure.
            const totalCents = donation.amount_cents || 0;
            const donationOnlyCents = Math.round((totalCents - 30) / 1.029);
            const amountDollars = (donationOnlyCents / 100).toFixed(2);

            const { data: donationEmailData, error: donationEmailError } =
              await resend.emails.send({
                from: "Hands of Hope <no-reply@handsofhopeorg.ca>",
                to: donorEmail,
                subject: "Thank you for your donation!",
                html:
                  '<div style="font-family:Arial,sans-serif;line-height:1.6;">' +
                  "<h2>Thank you for your generous donation!</h2>" +
                  "<p>Your contribution means a great deal to us and to those we serve.</p>" +
                  (campaignTitle
                    ? "<p><strong>Campaign:</strong> " + campaignTitle + "</p>"
                    : "") +
                  "<p><strong>Amount:</strong> $" +
                  amountDollars +
                  " CAD</p>" +
                  "<p>A receipt has been recorded for your donation. If you have any questions, please reach out to us.</p>" +
                  "<p>With gratitude,<br />Hands of Hope</p>" +
                  "</div>",
              });

            if (donationEmailError) {
              console.error(
                "Failed to send donation confirmation email:",
                donationEmailError,
              );
            } else {
              console.log(
                "Donation confirmation email sent:",
                donationEmailData?.id,
              );
            }
          } else {
            console.warn(
              "No donor email available — skipping confirmation email for donation:",
              donationId,
            );
          }

          break;
        }

        console.error("Unknown paymentKind in session metadata:", metadata);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
