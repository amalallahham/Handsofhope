import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import About8 from "@/components/sections/about/About8";

import Blogs8 from "@/components/sections/blogs/Blogs8";
import Contact2 from "@/components/sections/contacts/Contact2";
import Cta from "@/components/sections/cta/Cta";
import Faq2 from "@/components/sections/faq/Faq2";
import Features2 from "@/components/sections/features/Features2";
import Hero2 from "@/components/sections/hero/Hero2";
import FeatureMarquee from "@/components/sections/marquee/FeatureMarquee";
import Portfolios3 from "@/components/sections/portfolios/Portfolios3";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { supabase } from "../../lib/supabase";

export default async function Home() {
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("id, title, poster_url, status, slug, tags")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching campaigns:", error);
  }

  const { data: events, error: eventError } = await supabase
    .from("events")
    .select(
      `id,
			title,
			slug,
			image_url,
			event_date,
			venue,
			address,
			event_collaborators (
			id,
			name,
			logo_url
        )`,
    )
    .order("event_date", { ascending: false }) // latest first
    .limit(3);
  if (eventError) {
    console.error("Error fetching events:", eventError);
  }

  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSpace />
            <Hero2 />
            <Features2 />
            <FeatureMarquee />

            <About8 />
            <Portfolios3 campaigns={campaigns} />
            <Blogs8 events={events} />

            <Faq2 type={1} />
            <Contact2 />

            <Cta />
          </main>
          <Footer />
        </div>
      </div>

      <ClientWrapper />
    </div>
  );
}
