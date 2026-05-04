import { Resend } from "resend";
import { supabaseAdmin } from "@/../lib/supabase-admin";
import { render } from "@react-email/render";
import AbandonedRegistration from "@/emails/abandoned-registration";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const { data: users, error } = await supabaseAdmin
    .from("unpaid_customers")
    .select("customer_email, customer_name");

  if (error) {
    console.error("Error fetching unpaid customers:", error);
    return Response.json({ error }, { status: 500 });
  }

  // Deduplicate by email
  const uniqueUsers = Object.values(
    users.reduce((acc, user) => {
      acc[user.customer_email] = user;
      return acc;
    })
  );



  const results = await Promise.allSettled(
    uniqueUsers.map(async (user) => {
      const html = await render(
        <AbandonedRegistration customerName={user.customer_name} />
      );

      return resend.emails.send({
        from: "Eid of Hope <tickets@handsofhopeorg.ca>",
        to: user.customer_email,
        subject: "Don't forget to complete your registration 🌙",
        reply_to: "tickets@handsofhopeorg.ca",
        html,
      });
    })
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error(`${failed.length} emails failed to send`);
  }

  return Response.json({
    success: true,
    sent: results.length - failed.length,
    failed: failed.length,
  });
}