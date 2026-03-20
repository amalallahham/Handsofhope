// pages/api/stripe/create-checkout.js
import { createTicketCheckoutSession } from "../../../lib/stripe";
import { createServerSupabaseClient } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    eventId,
    eventName,
    adultQty = 0,
    kidQty = 0,
    customerEmail,
  } = req.body;

  if (!eventId || !eventName) {
    return res.status(400).json({ error: "Missing eventId or eventName" });
  }

  if (adultQty + kidQty === 0) {
    return res.status(400).json({ error: "Select at least one ticket" });
  }

  try {
    // 1. Create Stripe checkout session
    const session = await createTicketCheckoutSession({
      eventId,
      eventName,
      adultQty: Number(adultQty),
      kidQty: Number(kidQty),
      adultPriceCents: 1000, // $10.00 CAD
      kidPriceCents: 500,    // $5.00 CAD
      customerEmail,
    });

    // 2. Optionally save a pending order to Supabase
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from("orders").insert({
        stripe_session_id: session.id,
        event_id: eventId,
        adult_qty: adultQty,
        kid_qty: kidQty,
        total_cents: session.amount_total,
        customer_email: customerEmail || null,
        status: "pending",
      });
    } catch (dbErr) {
      // Non-fatal — Stripe webhook will also update the order status
      console.warn("Supabase insert warning:", dbErr.message);
    }

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
