import FeatureCard2 from "@/components/shared/cards/FeatureCard2";

const Features2 = () => {
  const features = [
    {
      id: 1,
      title: "Emergency Relief Fund",
      image: "/images/feature/emergency.svg",
      desc: "When crises strike, whether due to conflict, displacement, or natural disasters, we respond quickly by collecting and sending urgent aid to families who need immediate relief.",
    },
    {
      id: 2,
      title: "Supporting Local Communities in Canada",
      image: "/images/feature/canada.svg",
      desc: "We also serve communities in Canada by supporting vulnerable individuals, including people experiencing homelessness, through care initiatives, outreach, and essential supplies.",
    },
    {
      id: 3,
      title: "Fundraising Events",
      icon: "tji-calendar",
      desc: "We organize community events and fundraisers across British Columbia to bring people together for a meaningful cause and turn compassion into action.",
    },
    {
      id: 4,
      title: "Empowering Women",
      image: "/images/feature/power.svg",
      desc: "We believe in women’s strength, leadership, and potential. We support initiatives that uplift women through opportunity, encouragement, education, and community support.",
    },
  ];
  return (
    <section id="choose" className="tj-choose-section section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-heading style-3 text-center">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i>What We Do
              </span>
              <h2 className="sec-title title-anim">
                Serving Communities with Compassion, Dignity, and Hope
              </h2>
            </div>
          </div>
        </div>
        <div className="row row-gap-4 rightSwipeWrap">
          {features?.length
            ? features?.map((feature, idx) => (
                <div key={idx} className="col-xl-3 col-md-6">
                  <FeatureCard2 feature={feature} idx={idx} />
                </div>
              ))
            : ""}
        </div>
      </div>
    </section>
  );
};

export default Features2;
