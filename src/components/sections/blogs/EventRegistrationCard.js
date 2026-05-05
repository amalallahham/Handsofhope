"use client";

import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import BlogSidebar from "@/components/shared/sidebar/BlogSidebar";
import { useMemo, useRef, useState } from "react";

const EventRegistrationCard = ({ items }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [ticketQty, setTicketQty] = useState({});
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const ticketsRef = useRef(null);

  const ticketTypes = useMemo(() => {
    return [...(items?.event_ticket_types || [])]
      .filter((t) => t?.is_active !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [items?.event_ticket_types]);

  const total = useMemo(() => {
    return ticketTypes.reduce((sum, ticket) => {
      const qty = ticketQty[ticket.id] ?? 0;
      return sum + qty * Number(ticket.price_cents || 0);
    }, 0);
  }, [ticketQty, ticketTypes]);

  const totalFormatted = useMemo(() => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(total / 100);
  }, [total]);

  const formattedDate = useMemo(() => {
    if (!items?.event_date) return "";

    const raw = new Date(items.event_date)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toLowerCase();

    return raw.replace(/(\d+\s)([a-z])/, (_, p1, p2) => p1 + p2.toUpperCase());
  }, [items?.event_date]);

  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

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

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(trimmedPhone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    const selectedTickets = Object.values(ticketQty).reduce(
      (sum, qty) => sum + Number(qty || 0),
      0,
    );

    if (selectedTickets === 0) {
      newErrors.tickets = "Please select at least one ticket";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const scrollToError = (newErrors) => {
    const firstErrorRef =
      (newErrors.fullName && nameRef) ||
      (newErrors.email && emailRef) ||
      (newErrors.phone && phoneRef) ||
      (newErrors.tickets && ticketsRef);

    firstErrorRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
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

  const updateQty = (ticketId, delta, maxQuantity) => {
    setTicketQty((prev) => {
      const current = Number(prev[ticketId] || 0);
      const next = Math.max(0, current + delta);

      const capped =
        maxQuantity != null && Number(maxQuantity) > 0
          ? Math.min(next, Number(maxQuantity))
          : next;

      return {
        ...prev,
        [ticketId]: capped,
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
      const lineItems = ticketTypes
        .filter((ticket) => (ticketQty[ticket.id] ?? 0) > 0)
        .map((ticket) => ({
          ticketTypeId: ticket.id,
          name: ticket.name,
          priceCents: Number(ticket.price_cents),
          quantity: Number(ticketQty[ticket.id]),
        }));

      console.log("Line items:", lineItems);

      const payload = {
        type: "event_ticket",
        eventId: items?.id,
        eventName: items?.title,
        eventSlug: items?.slug,
        lineItems,
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        full_name: formData.fullName.trim(),
        special_requests: formData.specialRequests.trim(),
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
        throw new Error(data.error || "Failed to start checkout");
      }

      if (!data.url) {
        throw new Error("Checkout URL was not returned");
      }

      window.location.assign(data.url);
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

                  <div className="mb-3" ref={emailRef}>
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

                  <div className="mb-3" ref={phoneRef}>
                    <label className="form-label">Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control custom-input ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="ticket-section mb-4" ref={ticketsRef}>
                    <div className="section-head mb-3">
                      <h5 className="mb-1">Select Tickets</h5>
                      <p className="mb-0">Choose how many tickets you want.</p>
                    </div>

                    <div className="ticket-list">
                      {ticketTypes.map((ticket) => {
                        const qty = ticketQty[ticket.id] ?? 0;

                        return (
                          <div key={ticket.id} className="ticket-item">
                            <div className="ticket-info">
                              <h6 className="mb-1">{ticket.name}</h6>

                              <span className="ticket-price">
                                ${(Number(ticket.price_cents) / 100).toFixed(2)}
                              </span>

                              {ticket.max_quantity != null &&
                                Number(ticket.max_quantity) > 1 && (
                                  <span
                                    className="ticket-age-note d-block text-muted"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    Includes {ticket.max_quantity} tickets
                                  </span>
                                )}

                              {ticket.description && (
                                <span
                                  className="ticket-age-note d-block text-muted"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {ticket.description}
                                </span>
                              )}
                            </div>

                            <div className="ticket-controls">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() =>
                                  updateQty(ticket.id, -1, ticket.max_quantity)
                                }
                                disabled={loading || qty === 0}
                              >
                                -
                              </button>

                              <span className="qty-value">{qty}</span>

                              <button
                                type="button"
                                className="qty-btn qty-btn-plus"
                                onClick={() =>
                                  updateQty(ticket.id, 1, ticket.max_quantity)
                                }
                                disabled={
                                  loading ||
                                  (ticket.max_quantity != null &&
                                    qty >= Number(ticket.max_quantity))
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {errors.tickets && (
                      <div className="invalid-feedback d-block mt-2">
                        {errors.tickets}
                      </div>
                    )}
                  </div>

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
                categories={{
                  ...items,
                  event_date: formattedDate,
                  event_date_raw: items?.event_date,
                  ticket_types: ticketTypes,
                }}
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
