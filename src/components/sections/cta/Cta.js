import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const Cta = () => {
	return (
		<section className="tj-cta-section mt-4">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="cta-area">
							<div className="cta-content d-flex flex-column  justify-content-center">
								<h2 className="title title-anim">
									Every Child Deserves Peace
								</h2>
								<div className="cta-btn wow fadeInUp" data-wow-delay=".6s">
									<ButtonPrimary
										text={"Donate Now"}
										url={"/contact"}
										className={"btn-black"}
									/>
								</div>
							</div>
							<div className="cta-img">
								<img src="/images/cta/cry2.png" alt="" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Cta;
