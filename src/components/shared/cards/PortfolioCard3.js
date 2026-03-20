import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

const PortfolioCard3 = ({ portfolio }) => {
  console.log(portfolio);
  const {
        title = "Event Management Platform",
        poster_url = portfolio?.poster_url || "/assets/img/project/3.jpg",
        status,
        id,
        slug,
    dataFilter,
    tags,
  } = portfolio ? portfolio : {};

  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <div className="project-item">
      <Link href={`/campaigns/${slug}`} className="project-link" >
      <div className="project-img">
        <div className="project-overlay" />
        <span className={`status-badge ${status}`}>
          {status === "closed"
            ? "Closed"
            : status === "upcoming"
              ? "Upcoming"
              : "Active"}
        </span>
        <Image
          src={poster_url}
          alt=""
          width={434}
          height={420}
          style={{ height: "350px" }}
        />
      </div>
      </Link>
      <div className="project-content">
        <span className="categories">
          <p>{capitalized(tags)}</p>
        </span>
        <div className="project-text">
          <h4 className="title">
            <Link href={`/campaigns/${slug}`}>{title}</Link>
          </h4>
          <div className=" wow fadeInUp mt-4" data-wow-delay=".7s">
            <ButtonPrimary
              text={"Learn More"}
              url={`/campaigns/${slug}`}
              isTextBtn={true}
              className={"text-black"}
            />{" "}
          </div>
          <Link className="project-btn" href={`/campaigns/${slug}`}>
            <i className="tji-arrow-right-big"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard3;
