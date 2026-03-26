import sliceText from "@/libs/sliceText";
import Link from "next/link";
import React from "react";
const HeroInner = ({
  title,
  text,
  breadcrums = [],
  withBorder = true,
  logo = false,
  img
}) => {
  return withBorder ? (
    <section
      className={`tj-page-header ${logo ? "tj-page-header-green" : ""}  section-gap-x`}
      style={{
        backgroundImage: !logo
          ? `url('/images/bg/header-9.svg')`
          : `url('/images/bg/header-logo.svg')`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tj-page-header-content text-center">
              <h1 className={`tj-page-title`}>{title}</h1>
              <div className="tj-page-link">
                <span>
                  <i className="tji-home"></i>
                </span>
                <span>
                  <Link href="/">Home</Link>
                </span>
                <span>
                  <i className="tji-arrow-right"></i>
                </span>
                {breadcrums?.length
                  ? breadcrums?.map(({ name, path }, idx) => (
                      <React.Fragment key={idx}>
                        <span>
                          <Link href={path ? path : "/"}>{name}</Link>
                        </span>
                        <span>
                          <i className="tji-arrow-right"></i>
                        </span>
                      </React.Fragment>
                    ))
                  : ""}
                <span>
                  <span>{sliceText(text, 28, true)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="page-header-overlay"
        // style={{ backgroundImage: `url('/images/shape/pheader-overlay.webp')` }}
      ></div>
    </section>
  ) : (
    <>
      <div className="tj-page-link-2">
        <span>
          <i className="tji-home"></i>
        </span>
        <span>
          <Link href="/">Home</Link>
        </span>
        <span>
          <i className="tji-arrow-right"></i>
        </span>
        {breadcrums?.length
          ? breadcrums?.map(({ name, path }, idx) => (
              <React.Fragment key={idx}>
                <span>
                  <Link href={path ? path : "/"}>{name}</Link>
                </span>
                <span>
                  <i className="tji-arrow-right"></i>
                </span>
              </React.Fragment>
            ))
          : ""}
        <span>
          <span>{sliceText(text, 28, true)}</span>
        </span>
      </div>
    </>
  );
};

export default HeroInner;
