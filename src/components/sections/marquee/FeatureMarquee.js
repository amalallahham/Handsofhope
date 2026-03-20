"use client";

import MarqueeSlider2 from "@/components/shared/marquee/MarqueeSlider2";

const FeatureMarquee = () => {
	return (
		<section className="h5-maquee z-2">
			<div className="h5-maquee-inner p-0">
				<MarqueeSlider2 />
			</div>
			<div dir="rtl" className="h5-maquee-inner p-0  h5-maquee-inner-rtl">
				<MarqueeSlider2 isRtl={true} type={2} />
			</div>
		</section>
	);
};

export default FeatureMarquee;
