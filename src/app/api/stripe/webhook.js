// pages/api/stripe/webhook.js
// Stripe sends events here after payment completes.
// Run locally: stripe listen --forward-to localhost:3000/api/stripe/webhook

import { stripe } from "../../../lib/stripe";
import { createServerSupabaseClient } from "../../../lib/supabase";

// Disable Next.js body parsing — Stripe needs the raw body to verify signatures
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supabase = createServerSupabaseClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Mark order as paid
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent: session.payment_intent,
          paid_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id);

      if (error) {
        console.error("Supabase update error:", error.message);
      }

      console.log(`✅ Payment succeeded for session ${session.id}`);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      await supabase
        .from("orders")
        .update({ status: "expired" })
        .eq("stripe_session_id", session.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
