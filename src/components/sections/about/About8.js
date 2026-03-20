import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import FunfactSingle from "@/components/shared/funfact/FunfactSingle";
import PopupVideo from "@/components/shared/popup-video/PopupVideo";
import Link from "next/link";

const About8 = () => {
	return (
		<section className="h9-about-section section-bottom-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-8 h9-sec-heading">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								Our Story
							</span>
							<h2
								className="sec-title title-highlight wow fadeInUp"
								data-wow-delay=".3s"
							>
								<span className="p-0">From One Heart</span> to a Movement of Hope
							</h2>
						</div>

						<div className="h9-about-area">
							{/* IMAGE */}
							<div
								className="about-img-area h9-about-img wow fadeInLeft"
								data-wow-delay=".3s"
							>
								<div className="about-img overflow-hidden">
									<img
										data-speed=".8"
										src="/images/about/img.jpeg"
										alt="Hands of Hope"
										style={{ transform: 'translate(0, 0)' }}
									/>
								</div>

								<div className="box-area">
									<div
										className="author-info wow fadeInUp"
										data-wow-delay=".3s"
									>
										<h4 className="title">Hands of Hope</h4>
										<span className="designation">A Story of Compassion</span>
									</div>
								</div>
							</div>

							{/* CONTENT */}
							<div className="h9-about-content">
								<p className="desc wow fadeInUp" data-wow-delay=".4s">
									It all started with one Palestinian woman, far from home, with Gaza always in her heart.
									She watched her loved ones suffer and couldn’t stay silent.
									<br /><br />
									So she began a small shop, selling traditional Palestinian thobes and accessories.
									Every stitch carried love, every sale carried hope, and 100% of the profits went to families in Gaza.
									<br /><br />
									But her vision grew bigger, to help every soul in need.
									<strong> That’s when Hands of Hope was born.</strong>
									<br /><br />
									Today, we stand for kindness, for Palestine, and for humanity,
									proving that hope can begin with one heart and reach the whole world.
								</p>

								{/* FUNFACTS */}
								<div
									className="h9-about-funfact wow fadeInUp"
									data-wow-delay=".6s"
								>
									<div className="countup-item">
										<FunfactSingle currentValue={1} symbol={"K+"} />
										<span className="count-text">
											Families in Gaza supported through your generosity.
										</span>
									</div>

									<div className="countup-item">
										<FunfactSingle currentValue={20} symbol={"+"} />
										<span className="count-text">
											Wells rebuilding bringing clean water and life.
										</span>
									</div>
								</div>

								{/* BUTTON + VIDEO */}
								<div
									className="about-btn-area-2 wow fadeInUp"
									data-wow-delay=".7s"
								>
									<ButtonPrimary text={"Learn More"} url={"/about"} />

									<PopupVideo>
										<Link
											className="video-btn video-popup glightbox"
											data-autoplay="true"
											data-vbtype="video"
											data-maxwidth="1200px"
											href="https://youtu.be/QeWHBxYm4kE"
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
				</div>
			</div>
		</section>
	);
};

export default About8;