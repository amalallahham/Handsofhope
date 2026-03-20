"use client";

import { use, useEffect, useState } from "react";
import PortfolioCard3 from "@/components/shared/cards/PortfolioCard3";
import { supabase } from "@/../lib/supabase";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Portfolios3 = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCampaigns = async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
      } else {
        setCampaigns(data || []);
      }

      setLoading(false);
    };
	console.log("Fetching campaigns...");

    getCampaigns();
  }, []);



  useEffect(() => {	
	console.log("Campaigns updated:", campaigns);
  }, [campaigns]);

  return (
    <section className="tj-project-section-3 section-gap section-gap-x">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-heading-wrap">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i>Active Campaigns
              </span>
              <div className="heading-wrap-content">
                <div className="sec-heading style-3">
                  <h2 className="sec-title title-anim">
                    Breaking Boundaries, Building Dreams.
                  </h2>
                </div>
                <div
                  className="slider-navigation d-none d-md-inline-flex wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="slider-prev">
                    <span className="anim-icon">
                      <i className="tji-arrow-left"></i>
                      <i className="tji-arrow-left"></i>
                    </span>
                  </div>
                  <div className="slider-next">
                    <span className="anim-icon">
                      <i className="tji-arrow-right"></i>
                      <i className="tji-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="project-wrapper wow fadeInUp" data-wow-delay=".4s">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={15}
                  loop={campaigns.length > 4}
                  speed={1500}
                  autoplay={{
                    delay: 7000,
                  }}
                  pagination={{
                    el: ".swiper-pagination-area",
                    clickable: true,
                  }}
                  navigation={{
                    nextEl: ".slider-next",
                    prevEl: ".slider-prev",
                  }}
                  breakpoints={{
                    580: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    992: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1500: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                  }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="project-slider-2"
                >
                  {campaigns.map((campaign) => (
                    <SwiperSlide key={campaign.id}>
                      <PortfolioCard3 portfolio={campaign} />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-pagination-area"></div>
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shape-1">
        <img src="/images/shape/pattern-2.svg" alt="" />
      </div>
      <div className="bg-shape-2">
        <img src="/images/shape/pattern-3.svg" alt="" />
      </div>
      <div className="bg-shape-3">
        <img src="/images/shape/shape-blur.svg" alt="" />
      </div>
    </section>
  );
};

export default Portfolios3;