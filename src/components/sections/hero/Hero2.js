"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const Hero2 = () => {
  const [controlledMainSwiper, setControlledMainSwiper] = useState(null);
  const heroSlides = [
    {
      subtitle: "Hope rises even in hardship",
      title: (
        <>
          Strength in the Face of <span className="color-red">Adversity</span>
        </>
      ),
      desc: "In the midst of destruction, hope still stands. We are committed to supporting families, rebuilding lives where it’s needed most.",
      img: "/images/hero/hero-1.png",
      thumbImg: "/images/hero/hero-1.png",
    },
    {
      subtitle: "Voices that will not be silenced",
      title: (
        <>
          Standing for <span className="color-red">Justice</span> and Humanity
        </>
      ),
      desc: "Every person deserves safety, dignity, and a future. We stand with communities facing hardship and work to amplify their voices and support their journey forward.",
      img: "/images/hero/hero-2.png",
      thumbImg: "/images/hero/hero-2.png",
    },
    {
      subtitle: "Every child deserves a future",
      title: (
        <>
          From Struggle to <span className="color-red">Hope</span>
        </>
      ),
      desc: "Behind every challenge is a story of resilience. Together, we can provide support, opportunity, and a path toward a better tomorrow.",
      img: "/images/hero/hero-3.png",
	  imgClass: "position-37",
      thumbImg: "/images/hero/hero-3.png",
    },
  ];
  return (
    <section className="tj-slider-section">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        effect="fade"
        speed={1400}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay, Navigation, EffectFade, Thumbs]}
        thumbs={{ swiper: controlledMainSwiper }}
        navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
        className="hero-slider"
        style={{ height: "100%" }}
      >
        {heroSlides.map(({ img, title, desc, imgClass }, idx) => (
          <SwiperSlide
            key={idx}
            className="tj-slider-item"
            style={{ height: "auto" }}
          >
            <div
              className={`slider-bg-image ${imgClass || ""}`}
              style={{
                backgroundImage: `url('${
                  img ? img : "/images/hero/hero-8.avif"
                }')`,
              }}
            ></div>
            <div className="container">
              <div className="slider-wrapper">
                <div className="slider-content">
                  <h1 className="slider-title">{title}</h1>
                  <div className="slider-desc">{desc}</div>
                  <div className="slider-btn">
                    <ButtonPrimary text={"Get Started"} url={"/contact"} />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div
          className="hero-navigation d-inline-flex wow fadeIn"
          data-wow-delay="1.5s"
        >
          <div className="slider-prev" role="button">
            <span className="anim-icon">
              <i className="tji-arrow-left"></i>
              <i className="tji-arrow-left"></i>
            </span>
          </div>
          <div className="slider-next" role="button">
            <span className="anim-icon">
              <i className="tji-arrow-right"></i>
              <i className="tji-arrow-right"></i>
            </span>
          </div>
        </div>
      </Swiper>
      <Swiper
        onSwiper={setControlledMainSwiper} // capture thumbs swiper
        slidesPerView={3}
        spaceBetween={15}
        loop={false}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Thumbs]}
        className="hero-thumb wow fadeIn"
        data-wow-delay="2s"
      >
        {heroSlides.map(
          ({ thumbImg = "/images/hero/slider-thumb-1.webp" }, idx) => (
            <SwiperSlide key={idx} className="thumb-item">
              <Image
                src={thumbImg}
                alt="images"
                width={80}
                height={80}
                style={{ height: "100%" }}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>

      <div className="circle-text-wrap wow fadeInUp" data-wow-delay="1s">
        <span
          className="circle-text"
          style={{ backgroundImage: "url('/images/hero/circle-text.webp')" }}
        ></span>
        <Link className="circle-icon" href="/services">
          <i className="tji-arrow-down-big"></i>
        </Link>
      </div>
    </section>
  );
};

export default Hero2;
