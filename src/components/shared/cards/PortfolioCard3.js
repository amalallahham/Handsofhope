import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

const PortfolioCard3 = ({ portfolio }) => {
  const {
    title = "Campaign",
    poster_url = portfolio?.poster_url || "/assets/img/project/3.jpg",
    status,
    id,
    slug,
    dataFilter,
    tags,
  } = portfolio ? portfolio : {};

  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <div className="project-item h-100 d-flex flex-column campaing-btn">
      <Link href={`/campaigns/${slug}`} className="project-link">
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
            className="img-camp"
          />
        </div>
      </Link>
      <div className="project-content  d-flex flex-column ">
        <span className="categories">
          <p>{capitalized(tags)}</p>
        </span>
        <div className="project-text">
          <h4 className="title">
            <Link href={`/campaigns/${slug}`}>{title}</Link>
          </h4>
        </div>
        <div className="mt-auto d-flex justify-content-end">
          <div className=" wow fadeInUp mt-4" data-wow-delay=".7s">
            <ButtonPrimary
              text={"Learn More"}
              url={`/campaigns/${slug}`}
              isTextBtn={true}
              className={"text-black"}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard3;
