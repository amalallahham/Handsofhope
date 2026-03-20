import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import PortfolioDetailsMain from "@/components/layout/main/PortfolioDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { supabase } from "@/../lib/supabase";
import { notFound } from "next/navigation";

export default async function PortfolioDetails({ params }) {
  const { slug } = await params;

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

      const { data: latestCampaigns, error: latestCampaignsError } = await supabase
        .from("campaigns")
        .select("*")
        .order("status", { ascending: true }) 
        .order("created_at", { ascending: false })
		.limit(3);



	if(latestCampaignsError) {
		console.error("Error fetching latest campaigns:", latestCampaignsError	);
	}
  

  if (error || !campaign) {
    notFound();
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
            <PortfolioDetailsMain currentItem={campaign} latestCampaigns={latestCampaigns} />
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
  const { data, error } = await supabase.from("campaigns").select("slug");

  if (error || !data) {
    return [];
  }

  return data.map(({ slug }) => ({
    slug,
  }));
}
