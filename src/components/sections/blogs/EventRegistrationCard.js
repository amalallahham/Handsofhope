"use client";

import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import BlogSidebar from "@/components/shared/sidebar/BlogSidebar";
import { useMemo, useRef, useState } from "react";

const EventRegistrationCard = ({ items }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    adultQty: 0,
    kidQty: 0,
    additionalNote: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const ticketsRef = useRef(null);

  const total = useMemo(() => {
    const adultTotal = formData.adultQty * Number(items?.adult_price || 0);
    const kidTotal = formData.kidQty * Number(items?.kid_price || 0);
    return adultTotal + kidTotal;
  }, [
    formData.adultQty,
    formData.kidQty,
    items?.adult_price,
    items?.kid_price,
  ]);

  const totalFormatted = useMemo(() => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(total);
  }, [total]);

  const formattedDateRaw = new Date(items?.event_date)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();

  // capitalize first letter of month
  const formattedDate = formattedDateRaw.replace(
    /(\d+\s)([a-z])/,
    (match, p1, p2) => p1 + p2.toUpperCase(),
  );

  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.fullName = "Full name is required";
    } else if (trimmedName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.adultQty + formData.kidQty === 0) {
      newErrors.tickets = "Please select at least one ticket";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const scrollToError = (newErrors) => {
    if (newErrors.fullName && nameRef.current) {
      nameRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (newErrors.email && emailRef.current) {
      emailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (newErrors.tickets && ticketsRef.current) {
      ticketsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
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

  const updateQty = (field, delta) => {
    setFormData((prev) => {
      const updatedValue = Math.max(0, prev[field] + delta);

      return {
        ...prev,
        [field]: updatedValue,
      };
    });

    setErrors((prev) => ({
      ...prev,
      tickets: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      scrollToError(newErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: "event_ticket",
        eventId: items?.id,
        eventName: items?.title,
        adultQty: formData.adultQty,
        kidQty: formData.kidQty,
        adultPriceCents: Number(items?.adult_price || 0) * 100,
        kidPriceCents: Number(items?.kid_price || 0) * 100,
        customerEmail: formData.email,
        eventSlug: items?.slug,
        full_name: formData.fullName,
        additional_note: formData.additionalNote,
        special_requests: formData.specialRequests,
      };

      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // ✅ Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tj-blog-section section-gap slidebar-stickiy-container pt-5">
      <div className="container">
        <div className="row row-gap-5 blog-details-row">
          <div className="col-lg-8">
            <div className="post-details-wrapper">
              <div
                className="card border-0 blog-category-two wow fadeInUp p-4"
                data-wow-delay=".3s"
              >
                <h3 className="title title-anim">
                  {items?.title} Registration
                </h3>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="event-registration-form w-100"
                >
                  <div className="mb-3" ref={nameRef}>
                    <label className="form-label">Full name</label>
                    <input
                      type="text"
                      name="fullName"
                      className={`form-control custom-input ${
                        errors.fullName ? "is-invalid" : ""
                      }`}
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback d-block">
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  <div className="mb-4" ref={emailRef}>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control custom-input ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="ticket-section mb-4" ref={ticketsRef}>
                    <div className="section-head mb-3">
                      <h5 className="mb-1">Select Tickets</h5>
                      <p className="mb-0">Choose how many tickets you want.</p>
                    </div>

                    <div className="ticket-list">
                      <div className="ticket-item">
                        <div className="ticket-info">
                          <h6 className="mb-1">Adult Ticket</h6>
                          <span className="ticket-price">
                            ${Number(items?.adult_price || 0).toFixed(2)} /
                            ticket
                          </span>
                        </div>

                        <div className="ticket-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQty("adultQty", -1)}
                          >
                            -
                          </button>

                          <span className="qty-value">{formData.adultQty}</span>

                          <button
                            type="button"
                            className="qty-btn qty-btn-plus"
                            onClick={() => updateQty("adultQty", 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="ticket-item">
                        <div className="ticket-info">
                          <h6 className="mb-1">Kids Ticket</h6>
                          <span className="ticket-price">
                            ${Number(items?.kid_price || 0).toFixed(2)} / ticket
                          </span>
                        </div>

                        <div className="ticket-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQty("kidQty", -1)}
                          >
                            -
                          </button>

                          <span className="qty-value">{formData.kidQty}</span>

                          <button
                            type="button"
                            className="qty-btn qty-btn-plus"
                            onClick={() => updateQty("kidQty", 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {errors.tickets && (
                      <div className="invalid-feedback d-block mt-2">
                        {errors.tickets}
                      </div>
                    )}
                  </div>

                  {formData.kidQty > 0 && (
                    <div className="mb-3">
                      <label className="form-label">
                        Did your kid do anything special this Ramadan or Eid,
                        like fasting the entire month or fasting for the first
                        time? We want to surprise the kids who did something
                        special.
                      </label>
                      <textarea
                        name="additionalNote"
                        className="form-control custom-input"
                        rows={4}
                        value={formData.additionalNote}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Any special requests?</label>
                    <textarea
                      name="specialRequests"
                      className="form-control custom-input"
                      rows={4}
                      value={formData.specialRequests}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="total-box mb-4">
                    <span>Total</span>
                    <strong>{totalFormatted}</strong>
                  </div>

                  <ButtonPrimary
                    className="w-100"
                    disabled={loading}
                    text={loading ? "Processing..." : "Submit"}
                    type="submit"
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4 blog-sidebar-col">
            <div className="sidebar-sticky-wrapper">
              <BlogSidebar
                categories={{ ...items, child_price: items?.kid_price , event_date: formattedDate }}
                hideBtn={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventRegistrationCard;
