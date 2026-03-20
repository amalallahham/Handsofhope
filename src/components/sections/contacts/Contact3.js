"use client";

import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { supabase } from "@/../lib/supabase";

const Contact3 = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
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
		}, 60000);

		return () => clearTimeout(timer);
	}, [successMessage]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

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

		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		}

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
			form: "",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccessMessage("");

		const now = Date.now();
		const cooldownMs = 60 * 1000;

		if (now - lastSubmittedAt < cooldownMs) {
			const remainingSeconds = Math.ceil(
				(cooldownMs - (now - lastSubmittedAt)) / 1000
			);

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
				setErrors({
					form: "Something went wrong while sending your message.",
				});
				return;
			}

			setSuccessMessage("Your message has been sent successfully.");
			setLastSubmittedAt(Date.now());

			setFormData({
				fullName: "",
				email: "",
				phone: "",
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
		<section className="tj-contact-section-2 section-bottom-gap pt-5">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-lg-6">
						<div className="contact-form wow fadeInUp" data-wow-delay=".1s">
							<h3 className="title">Feel Free to Get in Touch</h3>

							<form id="contact-form" onSubmit={handleSubmit}>
								<div className="row">
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="fullName"
												placeholder="Full Name*"
												value={formData.fullName}
												onChange={handleChange}
											/>
											{errors.fullName && (
												<small className="text-danger">{errors.fullName}</small>
											)}
										</div>
									</div>

									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="email"
												name="email"
												placeholder="Email Address*"
												value={formData.email}
												onChange={handleChange}
											/>
											{errors.email && (
												<small className="text-danger">{errors.email}</small>
											)}
										</div>
									</div>

									<div className="col-sm-12">
										<div className="form-input">
											<input
												type="tel"
												name="phone"
												placeholder="Phone number*"
												value={formData.phone}
												onChange={handleChange}
											/>
											{errors.phone && (
												<small className="text-danger">{errors.phone}</small>
											)}
										</div>
									</div>

									<div className="col-sm-12">
										<div className="form-input message-input">
											<textarea
												name="message"
												id="message"
												placeholder="Type message*"
												value={formData.message}
												onChange={handleChange}
											></textarea>
											{errors.message && (
												<small className="text-danger">{errors.message}</small>
											)}
										</div>
									</div>

									{errors.form && (
										<div className="col-sm-12">
											<small className="text-danger d-block mb-3">
												{errors.form}
											</small>
										</div>
									)}

									{successMessage && (
										<div className="col-sm-12">
											<small className="text-success d-block mb-3">
												{successMessage}
											</small>
										</div>
									)}

									<div className="submit-btn">
										<ButtonPrimary
											type="submit"
											text={loading ? "Sending..." : "Submit Now"}
										/>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact3;