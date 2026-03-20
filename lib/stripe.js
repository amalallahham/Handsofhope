// lib/stripe.js
import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

/**
 * Creates a Stripe Checkout Session for ticket purchases.
 *
 * @param {Object} params
 * @param {string} params.eventId        - Supabase event row id
 * @param {string} params.eventName      - Human-readable event name
 * @param {number} params.adultQty       - Number of adult tickets
 * @param {number} params.kidQty         - Number of kid tickets
 * @param {number} params.adultPriceCents - Price per adult ticket in cents (e.g. 1000 = $10)
 * @param {number} params.kidPriceCents   - Price per kid ticket in cents (e.g. 500 = $5)
 * @param {string} params.customerEmail  - Pre-fill checkout email
 * @returns {Promise<Stripe.Checkout.Session>}
 */
export async function createTicketCheckoutSession({
  eventId,
  eventName,
  adultQty,
  kidQty,
  adultPriceCents,
  kidPriceCents,
  customerEmail,
}) {
  const lineItems = [];

  if (adultQty > 0) {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: `${eventName} — Adult Ticket`,
          metadata: { eventId, ticketType: "adult" },
        },
        unit_amount: adultPriceCents,
      },
      quantity: adultQty,
    });
  }

  if (kidQty > 0) {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: `${eventName} — Child Ticket`,
          metadata: { eventId, ticketType: "child" },
        },
        unit_amount: kidPriceCents,
      },
      quantity: kidQty,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail || undefined,
    metadata: { eventId },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/eid-of-hope`,
  });

  return session;
}
