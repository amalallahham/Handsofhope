import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import FaqItem from "@/components/shared/faq/FaqItem";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const Faq2 = ({ type = 1 }) => {
const items = [
  {
    title: "What is Hands of Hope?",
    desc: "Hands of Hope is a non-profit organization dedicated to supporting vulnerable communities through events, donations, and humanitarian initiatives. We aim to bring people together to create real impact and lasting change.",
    initActive: true,
  },
  {
    title: "How can I support Hands of Hope?",
    desc: "You can support us by donating, volunteering, attending our events, or spreading awareness. Every contribution—big or small—helps us make a difference in people's lives.",
    initActive: false,
  },
  {
    title: "Where do donations go?",
    desc: "All donations are directed toward our active campaigns, including humanitarian aid, community programs, and event initiatives. We ensure transparency and use funds where they are needed most.",
    initActive: false,
  },
  {
    title: "Can I volunteer with Hands of Hope?",
    desc: "Yes! We welcome passionate individuals to join our team. You can volunteer in events, logistics, outreach, or creative work. It’s a great way to give back and be part of a meaningful cause.",
    initActive: false,
  },
  {
    title: "What kind of events do you organize?",
    desc: "We organize community-driven events such as charity gatherings, workshops, fundraising campaigns, and cultural events like Arts & Crafts afternoons and Eid celebrations—all designed to connect people and support a cause.",
    initActive: false,
  },
];


	return (
		<section
			className={`tj-faq-section section-gap  ${
				type === 3 || type === 4 ? "" : "tj-arrange-container-2"
			}`}
		>
			<div className="container">
				<div className="row justify-content-between">
					{type === 3 ? (
						<div className="col-lg-4">
							<div className="content-wrap">
								<div className="sec-heading">
									<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
										<i className="tji-manage"></i>Common Questions
									</span>
									<h2 className="sec-title title-anim">
										Need <span>Help?</span> Start Here...
									</h2>
								</div>
								<p className="desc wow fadeInUp" data-wow-delay=".6s">
									We stay ahead of curve, leveraging <br /> cutting-edge are
									technologies and <br /> strategies to competitive
								</p>
								<div className="wow fadeInUp" data-wow-delay=".8s">
									<ButtonPrimary text={"Request a Call"} url={"/contact"} />
								</div>
							</div>
						</div>
					) : (
						<div className="col-lg-6">
							<div
								className={`faq-img-area ${
									type === 3 ? "" : "tj-arrange-item-2"
								}`}
							>
								<div className="faq-img overflow-hidden">
									<Image
										src="/images/faq/volunteer.png"
										alt=""
										width={585}
										height={629}
									/>
									<h2 className={`title ${type === 4 ? "title-anim" : ""}`}>
										Need Help? Start Here...
									</h2>
								</div>
								<div className="box-area ">
									<div className="call-box">
										<h4 className="title">Have more questions? </h4>
										<span className="call-icon">
											<i className="tji-phone"></i>
										</span>
										<Link className="number" href="tel:+1-236-335-9951">
											<span>+1 (236) 335-9951</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className={`col-lg-${type === 3 ? "8" : "6"}`}>
						<BootstrapWrapper>
							<div
								className={`accordion tj-faq ${
									type === 2 || type === 4 ? "style-2" : ""
								} ${type === 3 || type === 4 ? "" : "tj-arrange-item-2"}`}
								id="faqOne"
							>
								{items?.length
									? items?.map((item, idx) => (
											<FaqItem key={idx} item={item} idx={idx} />
									  ))
									: ""}
							</div>
						</BootstrapWrapper>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faq2;
