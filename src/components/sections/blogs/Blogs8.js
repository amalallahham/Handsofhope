"use client";

import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import BlogCard8 from "@/components/shared/cards/BlogCard8";
import { supabase } from "@/../lib/supabase";

const Blogs8 = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `id,
			title,
			slug,
			image_url,
			event_date,
			venue,
			address,
			event_collaborators (
			id,
			name,
			logo_url
        )`,
        )
        .order("event_date", { ascending: false }) // latest first
        .limit(3);
      console.log("Fetching events...", data);
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data || []);
      }

      setLoading(false);
    };

    getEvents();
  }, []);

  return events?.length === 0 && !loading ? (
    <></>
  ) : (
    <section className="tj-blog-section-2 h8-blog section-gap slidebar-stickiy-container">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4 col-xl-3">
            <div className="sec-heading style-3 slidebar-stickiy">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i>Community Events
              </span>
              <h2 className="sec-title title-anim">Upcoming & Latest Events</h2>
              <div className="h8-blog-more wow fadeInUp" data-wow-delay=".8s">
                <ButtonPrimary text={"More Events"} url={"/events"} />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8 col-xl-9">
            <div className="blog-wrapper h8-blog-wrapper ">
              {loading ? (
                <p>Loading...</p>
              ) : events.length ? (
                events.map((event, idx) => (
                  <BlogCard8 key={event.id} event={event} idx={idx} />
                ))
              ) : (
                <p>No events found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs8;
