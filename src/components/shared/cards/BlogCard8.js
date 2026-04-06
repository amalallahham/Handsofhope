import makePath from "@/libs/makePath";
import modifyNumber from "@/libs/modifyNumber";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

const BlogCard8 = ({ event, idx }) => {
  const {
    title,
    slug,
    image_url,
    event_date,
    venue,
    address,
    collaborators = event?.event_collaborators,
  } = event || {};

  const modifyedDay = (date, type) => {
    const new_date = new Date(date);
    if (type === "day") {
      return new_date.getDate();
    } else if (type === "month") {
      return new_date.toLocaleString("en-US", { month: "short" });
    }
  };

  const isHappened = event_date ? new Date(event_date) < new Date() : false;



  return (
    <div className="blog-item style-2 wow fadeInUp" data-wow-delay=".3s">
      <div className="blog-thumb">
        <Link href={`/events/${slug}`}>
          <img src={image_url} alt={title} />
        </Link>
        <div className="blog-date">
          <span className="date">
            {modifyNumber(modifyedDay(event_date, "day"))}
          </span>
          <span className="month">{modifyedDay(event_date, "month")}</span>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center w-60">
        <div className="blog-content align-items-start h-100 w-100">
          <Link href={`/events/${slug}`} className="w-100">
            <div className="title-area">
              <div className="blog-meta">
                <span
                  className={`event-status ${isHappened ? "happened" : "upcoming"}`}
                >
                  {isHappened ? "Past Event" : "Upcoming Event"}
                </span>
                {/* <span>
              By <Link href={`/events/${slug}`}>Ellinien Loma</Link>
            </span> */}
              </div>
              <h3 className="title">{title}</h3>
              {collaborators?.length > 0 && (
                <div className="d-flex align-items-center flex-row gap-2 ">
                  <p className="mb-0 color-black ">Collaboration with </p>
                  {collaborators?.map((collab) => (
                    <div key={collab.id} className="collaborator">
                      <Image
                        className="circle"
                        src={collab.logo_url}
                        alt={collab.name}
                        width={25}
                        height={25}
                      />
                      <span>{collab.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex flex-row align-items-start gap-2 py-2">
                <i className="tji-location pt-1"></i>
                <p className="mb-0">
                  {venue} - {address}
                </p>
              </div>

              {/* <div>
				<i className="tji-location"></i>
			  </div> */}
            </div>
          </Link>
          {/* <Link className="text-btn" href={`/events/${slug}`}>
              <span className="btn-icon">
                <i className="tji-arrow-right-long"></i>
              </span>
              <span className="btn-text">
                <span>View Event</span>
              </span>
            </Link> */}

          <ButtonPrimary text={isHappened ? "View Event" : "Learn More"} url={`/events/${slug}`} />
        </div>
      </div>
    </div>
  );
};

export default BlogCard8;
