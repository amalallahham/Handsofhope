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
import EventSuccessPopup from "@/components/sections/blogs/EventSuccessPopup";
import { Suspense } from "react";

export default async function EventDetailsPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      id,
      slug,
      title,
      description,
      event_date,
	  doors_open,
	  venue,
	  address,
	  hosted_by,
	  adult_price,
	  kid_price,
    collaboration_note,
      image_url,
      sponsors (
        id,
        name,
        logo_url,
        type,
        sort_order
      ),
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

  
  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      <div>
        <div>
          <main>
            <HeaderSpace />
            <Suspense fallback={null}>
              <EventSuccessPopup />
            </Suspense>
            <BlogDetailsMain items={event} />
            <Cta />
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
