import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import PopupVideo from "@/components/shared/popup-video/PopupVideo";
import Image from "next/image";
import Link from "next/link";

const About3 = ({ type }) => {
	return (
		<section className="tj-about-section-2 section-gap section-gap-x mt-4">
			<div className="container">
				<div className="row">
					<div className="col-xl-6 col-lg-6 order-lg-1 order-2">
						<div
							className="about-img-area style-2 wow fadeInLeft"
							data-wow-delay=".3s"
						>
							<div className="about-img overflow-hidden">
								<Image
									data-speed=".8"
									src="/images/about/about-5.webp"
									alt="Hands of Hope community support"
									width={591}
									height={639}
								/>
							</div>

							<div className={`box-area ${type === 2 ? "style-2" : ""}`}>
								<div className="progress-box wow fadeInUp" data-wow-delay=".3s">
									<h4 className="title">Our Impact</h4>
									<ul className="tj-progress-list">
										<li>
											<h6 className="tj-progress-title">Community Support</h6>
											<div className="tj-progress">
												<span className="tj-progress-percent">82%</span>
												<div
													className="tj-progress-bar"
													data-percent="82"
												></div>
											</div>
										</li>
										<li>
											<h6 className="tj-progress-title">Hope Delivered</h6>
											<div className="tj-progress">
												<span className="tj-progress-percent">90%</span>
												<div
													className="tj-progress-bar"
													data-percent="90"
												></div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="col-xl-6 col-lg-6 order-lg-2 order-1">
						<div className="about-content-area">
							<div className={`sec-heading ${type === 2 ? "" : "style-3"}`}>
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i>Get to Know Us
								</span>

								<h2 className="sec-title title-anim">
									{type === 2 ? (
										<>
											Bringing Hope, Compassion, and Relief to Communities in
											Need <span>Everywhere.</span>
										</>
									) : (
										"Bringing Hope, Compassion, and Relief to Communities in Need Everywhere."
									)}
								</h2>
							</div>
						</div>

						<div className="about-bottom-area">
							<div
								className="mission-vision-box wow fadeInLeft"
								data-wow-delay=".5s"
							>
								<h4 className="title">Our Mission</h4>
								<p className="desc">
									Our mission is to support vulnerable individuals and families
									through compassion-driven initiatives, community programs, and
									meaningful humanitarian aid.
								</p>
								<ul className="list-items">
									<li>
										<i className="tji-list"></i>Compassionate Community Support
									</li>
									<li>
										<i className="tji-list"></i>Humanitarian Relief Efforts
									</li>
									<li>
										<i className="tji-list"></i>Empowering Lives with Dignity
									</li>
								</ul>
							</div>

							<div
								className="mission-vision-box wow fadeInRight"
								data-wow-delay=".5s"
							>
								<h4 className="title">Our Vision</h4>
								<p className="desc">
									Our vision is to build a world where every person has access
									to hope, support, and the opportunity to live with dignity,
									safety, and belonging.
								</p>
								<ul className="list-items">
									<li>
										<i className="tji-list"></i>A More Caring World
									</li>
									<li>
										<i className="tji-list"></i>Lasting Community Impact
									</li>
									<li>
										<i className="tji-list"></i>Hope for Every Family
									</li>
								</ul>
							</div>
						</div>

								<div
									className="about-btn-area-2 wow fadeInUp mt-3"
									data-wow-delay=".7s"
								>

									<PopupVideo>
										<Link
											className="video-btn video-popup glightbox"
											data-autoplay="true"
											data-vbtype="video"
											data-maxwidth="1200px"
											href="https://www.youtube.com/watch?v=MLpWrANjFbI"
										>
											<span className="play-btn">
												<i className="tji-play"></i>
											</span>
											<span className="video-text">Watch Our Story</span>
										</Link>
									</PopupVideo>
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
		</section>
	);
};

export default About3;