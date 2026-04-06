import makePath from "@/libs/makePath";
import makeWowDelay from "@/libs/makeWowDelay";
import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";

const BlogCard3 = ({ event, idx }) => {
  const { title, slug, image_url, event_date } = event || {};

  const modifyedDay = (date, type) => {
    const new_date = new Date(date);
    if (type === "day") {
      return new_date.getDate();
    } else if (type === "month") {
      return new_date.toLocaleString("en-US", { month: "short" });
    }
  };
  return (
    <div
      className="blog-item style-3 wow fadeInUp"
      data-wow-delay={makeWowDelay(idx, 0.2)}
    >
      <div className="blog-thumb h-100">
        <Link href={`/events/${slug}`}>
          <img src={image_url || "/images/blog/blog-6.webp"} alt="" />
        </Link>
        <div className="blog-date">
          {/* <span className="date">{modifyNumber(day)}</span> */}
          <span className="date">{modifyedDay(event_date, "day")}</span>

          <span className="month">{modifyedDay(event_date, "month")}</span>
        </div>
      </div>
      <div className="blog-content">
        <h4 className="title">
          <Link href={`/events/${slug}`}>{title}</Link>
        </h4>

        <Link className="text-btn" href={`/events/${slug}`}>
          <span className="btn-text">
            <span>Learn More</span>
          </span>
          <span className="btn-icon">
            <i className="tji-arrow-right-long"></i>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard3;
