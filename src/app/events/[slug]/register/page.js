import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import BlogDetailsMain from "@/components/layout/main/BlogDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";
// const items = getBlogs();
import { supabase } from "@/../lib/supabase";
import EventRegistrationCard from "@/components/sections/blogs/EventRegistrationCard";

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
      adult_price,
      kid_price,
    collaboration_note,
      image_url,
      event_collaborators (
        id,
        name,
        logo_url,
        website_url
        
      )
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !event) {
    // notFound();
    console.error("Error fetching event data:", error);
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
      <div>
        <div>
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
        </div>
      </div>
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
