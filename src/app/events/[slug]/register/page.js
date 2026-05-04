import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";
import { supabase } from "@/../lib/supabase";
import EventRegistrationCard from "@/components/sections/blogs/EventRegistrationCard";
import ErrorPrimary from "@/components/sections/error/ErrorPrimary";

export default async function EventRegisterPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      id,
      slug,
      title,
      event_date,
      doors_open,
      venue,
      address,
      hosted_by,
      collaboration_note,
      image_url,

      event_collaborators (
        id,
        name,
        logo_url,
        website_url
      ),

      event_ticket_types (
        id,
        name,
        description,
        price_cents,
        max_quantity,
        is_active,
        sort_order
      )
      `
    )
    .eq("slug", slug)
    .eq("event_ticket_types.is_active", true)
    .order("sort_order", {
      referencedTable: "event_ticket_types",
      ascending: true,
    })
    .maybeSingle();

  if (error || !event) {
    console.error("Error fetching event data:", error);
    notFound();
  }

  const isRegistrationEnded = event?.event_date
    ? new Date(event.event_date) < new Date()
    : false;

  const isSameDay = event?.event_date
    ? (() => {
        const eventDate = new Date(event.event_date);
        const today = new Date();

        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      })()
    : false;

  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />

      <main>
        <HeaderSpace />

        {isRegistrationEnded || isSameDay ? (
          <div className="d-flex align-items-center justify-content-center flex-column p-5">
            <h2 className="text-center">Registration Closed</h2>
            <p>Sorry, registration for this event has ended.</p>
          </div>
        ) : (
          <>
            <EventRegistrationCard items={event} />
            <Cta />
          </>
        )}
      </main>

      <Footer />
      <ClientWrapper />
    </div>
  );
}

export async function generateStaticParams() {
  const { data: events } = await supabase.from("events").select("slug");

  return (events || []).map((event) => ({
    slug: event.slug,
  }));
}
