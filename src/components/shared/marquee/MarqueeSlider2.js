"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MarqueeSlider2 = ({ type }) => {
  const items = [
    "Innovation",
    "Success",
    "Leadership",
    "Enterprise",
    "Business Growth",
    "Corporate",
    "Results",
    "Innovation",
    "Success",
    "Leadership",
    "Enterprise",
    "Business Growth",
    "Corporate",
    "Results",
  ];

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={type === 2 ? 0 : 30}
      loop={true}
      speed={5000}
      allowTouchMove={false}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          spaceBetween: type === 2 ? 0 : 35,
        },

        1024: {
          spaceBetween: type === 2 ? 0 : 50,
        },
      }}
      className="h5-maquee-slider"
      wrapperClass="h5-maquee-slider-wrapper"
      modules={[Autoplay]}
    >
      {items?.length
        ? items?.map((title, idx) => (
            <SwiperSlide key={idx} className="h5-maquee-slider-item">
              <div className="marquee-box" style={{ width: "100%" }}>
                {type !== 2 && (
                  <div className="marquee-icon-wrapper">
                    <div className="marquee-icon">
                      <i className="tji-star"></i>
                    </div>
                  </div>
                )}
                <div className="marquee-title">
                  {type !== 2 ? (
                    <img src="/images/marquee/pale.svg" alt="" />
                  ) : (
                    <img src="/images/marquee/keffiyeh.svg" height={'100%'} alt="" />
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))
        : ""}
    </Swiper>
  );
};

export default MarqueeSlider2;
