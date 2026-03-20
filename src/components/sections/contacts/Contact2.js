"use client";

import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import Link from "next/link";
import { supabase } from "@/../lib/supabase";

const Contact2 = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		service: "",
		message: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [lastSubmittedAt, setLastSubmittedAt] = useState(0);

	useEffect(() => {

		if (!successMessage) return;

		const timer = setTimeout(() => {
			setSuccessMessage("");
		}, 60000); // 1 minute

		return () => clearTimeout(timer);
	}, [successMessage]);







	const validateForm = () => {
		const newErrors = {};

		if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Enter a valid email address";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
			newErrors.phone = "Enter a valid phone number";
		}


		if (!formData.message.trim()) newErrors.message = "Message is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccessMessage("");

		const now = Date.now();
		const cooldownMs = 60 * 1000; // 1 minute
		if (now - lastSubmittedAt < cooldownMs) {
			const remainingSeconds = Math.ceil((cooldownMs - (now - lastSubmittedAt)) / 1000);
			setErrors({
				form: `Please wait ${remainingSeconds} seconds before sending another message.`,
			});
			return;
		}

		const isValid = validateForm();
		if (!isValid) return;

		try {
			setLoading(true);

			const { error } = await supabase.from("contact_messages").insert([
				{
					name: formData.fullName,
					email: formData.email,
					phone: formData.phone,
					message: formData.message,
				},
			]);

			if (error) {
				setErrors({ form: "Something went wrong while sending your message." });
				return;
			}


			setSuccessMessage("Your message has been sent successfully.");
			setLastSubmittedAt(Date.now());

			setFormData({
				fullName: "",
				email: "",
				phone: "",
				service: "",
				message: "",
			});

			setErrors({});
		} catch (err) {
			setErrors({ form: "Something went wrong." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="tj-contact-section section-gap section-gap-x">
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="global-map wow fadeInUp" data-wow-delay=".3s">
							<div className="global-map-img">
								<img src="/images/bg/map.svg" alt="Image" />
								<div className="location-indicator loc-1">
									<div className="location-tooltip">
										<span>Head office:</span>
										<p>Delta, BC Canada</p>
										<Link href="tel:+1-236-335-9951">P: +1 (236) 335-9951</Link>
										<Link href="mailto:info@handsofhopeorg.ca">
											M: info@handsofhopeorg.ca
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-6">
						<div className="contact-form style-2 wow fadeInUp" data-wow-delay=".4s">
							<div className="sec-heading">
								<span className="sub-title text-white">
									<i className="tji-box"></i>Get in Touch
								</span>
								<h2 className="sec-title title-anim">
									Drop Us a <span>Line.</span>
								</h2>
							</div>

							<form id="contact-form-2" onSubmit={handleSubmit}>
								<div className="row wow fadeInUp" data-wow-delay=".5s">
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="fullName"
												placeholder="Full Name *"
												value={formData.fullName}
												onChange={handleChange}
											/>
											{errors.fullName && <small className="text-danger">{errors.fullName}</small>}
										</div>
									</div>

									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="email"
												name="email"
												placeholder="Email Address *"
												value={formData.email}
												onChange={handleChange}
											/>
											{errors.email && <small className="text-danger">{errors.email}</small>}
										</div>
									</div>

									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="tel"
												name="phone"
												placeholder="Phone number *"
												value={formData.phone}
												onChange={handleChange}
											/>
											{errors.phone && <small className="text-danger">{errors.phone}</small>}
										</div>
									</div>


									<div className="col-sm-12">
										<div className="form-input message-input">
											<textarea
												name="message"
												id="message"
												placeholder="Type message *"
												value={formData.message}
												onChange={handleChange}
											></textarea>
											{errors.message && <small className="text-danger">{errors.message}</small>}
										</div>
									</div>

									<div className="submit-btn">
										<ButtonPrimary
											text={loading ? "Sending..." : "Send Message"}
											type="submit"
										/>
									</div>

									{errors.form && (
										<div className="col-sm-12 mt-3">
											<p className="text-danger">{errors.form}</p>
										</div>
									)}

									{successMessage && (
										<div className="col-sm-12 mt-3 r-white">
											<p className="text-white">{successMessage}</p>
										</div>
									)}
								</div>
							</form>
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

export default Contact2;