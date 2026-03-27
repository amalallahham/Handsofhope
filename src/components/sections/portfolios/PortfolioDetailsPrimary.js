"use client";

import Image from "next/image";
import Link from "next/link";
import CtaSidebar from "../cta/CtaSidebar";
import PopupVideo from "@/components/shared/popup-video/PopupVideo";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import RecentBlogWidget from "@/components/shared/sidebar/widgets/RecentBlogWidget";

const PortfolioDetailsPrimary = ({ option, campaign, latestCampaigns }) => {
  const { prevId, nextId, isPrevItem, isNextItem } = option || {};

  const {
    title,
    poster_url,
    video_url,
    tags,
    description,
    goal_amount_cents,
    amount_raised,
    status,
    created_at,
    slug,
  } = campaign || {};

  console.log("Campaign data in PortfolioDetailsPrimary:", campaign);

  const formatCurrency = (value) => {
    const amount = value;
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTags = (tagsValue) => {
    if (!tagsValue) return "N/A";

    if (Array.isArray(tagsValue)) {
      return tagsValue.join(", ");
    }

    if (typeof tagsValue === "string") {
      return tagsValue.charAt(0).toUpperCase() + tagsValue.slice(1);
    }

    return String(tagsValue);
  };

  const goal = Number(goal_amount_cents || 0);
  const raised = Number(amount_raised || 0);
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  return (
    <section className="tj-blog-section section-gap-1 pt-5">
      <div className="container">
        <div className="row rg-50">
          <div className="col-lg-8">
            <div className="post-details-wrapper">
              {poster_url && (
                <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                  <Image
                    src={poster_url}
                    alt={title || "Campaign image"}
                    width={868}
                    height={450}
                    style={{ height: "auto" }}
                  />
                </div>
              )}

              <div className="title-row wow fadeInUp" data-wow-delay=".2s">
                <h2 className="title title-anim">{title}</h2>

                <span className="category-badge">{formatTags(tags)}</span>
              </div>
              <div className="blog-text mt-4">
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  {description || "No campaign description available."}
                </p>
              </div>

              {status !== "closed" && (
                <div>
                  <h4 className="wow fadeInUp mt-5" data-wow-delay=".3s">
                    Campaign Progress
                  </h4>

                  <div
                    className="progress-wrapper wow fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <div className="progress-header">
                      <span className="raised">{formatCurrency(raised)}</span>
                      <span className="goal">{formatCurrency(goal)}</span>
                    </div>

                    <div className="campaign-progress-bar">
                      <div
                        className="campaign-progress-fill"
                        style={{
                          width: progress > 0 ? `${progress}%` : "8px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="blog-text mt-4">
                {/* <p className="wow fadeInUp" data-wow-delay=".3s">
                  {description || "No campaign description available."}
                </p> */}

                {video_url && (
                  <div
                    className="about-btn-area-2 wow fadeInUp mt-4"
                    data-wow-delay=".7s"
                  >
                    <PopupVideo>
                      <Link
                        className="video-btn video-popup glightbox"
                        data-autoplay="true"
                        data-vbtype="video"
                        data-maxwidth="1200px"
                        href={video_url}
                        prefetch={false}
                      >
                        <span className="play-btn">
                          <i className="tji-play"></i>
                        </span>
                        <span className="video-text">Watch Campaign Video</span>
                      </Link>
                    </PopupVideo>
                  </div>
                )}
              </div>

              {/* <div
                className="tj-post__navigation mb-0 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div
                  className="tj-nav__post previous"
                  style={{ visibility: isPrevItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav prev_post">
                    <Link href={isPrevItem ? `/campaigns/${prevId}` : "#"}>
                      <span>
                        <i className="tji-arrow-left"></i>
                      </span>
                      Previous
                    </Link>
                  </div>
                </div>

                <Link href="/campaigns" className="tj-nav-post__grid">
                  <i className="tji-window"></i>
                </Link>

                <div
                  className="tj-nav__post next"
                  style={{ visibility: isNextItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav next_post">
                    <Link href={isNextItem ? `/campaigns/${nextId}` : "#"}>
                      Next
                      <span>
                        <i className="tji-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="tj-main-sidebar">
              <div
                className="tj-sidebar-widget widget-categories wow fadeInUp"
                data-wow-delay=".1s"
              >
                <h4 className="widget-title">Campaign Info</h4>

                <div className="infos-item">
                  <div className="project-icons">
                    <i className="tji-budget"></i>
                  </div>
                  <div className="project-text">
                    <span>Goal Amount</span>
                    <h6 className="title">{formatCurrency(goal)}</h6>
                  </div>
                </div>

                <div className="infos-item">
                  <div className="project-icons">
                    <i className="tji-chart"></i>
                  </div>
                  <div className="project-text">
                    <span>Amount Raised</span>
                    <h6 className="title">{formatCurrency(raised)}</h6>
                  </div>
                </div>

                <div className="infos-item">
                  <div className="project-icons">
                    <i className="tji-check"></i>
                  </div>
                  <div className="project-text">
                    <span>Status</span>
                    <h6 className="title">{status || "N/A"}</h6>
                  </div>
                </div>

                <div className="infos-item">
                  <div className="project-icons">
                    <i className="tji-calendar"></i>
                  </div>
                  <div className="project-text">
                    <span>Created Date</span>
                    <h6 className="title">{formatDate(created_at)}</h6>
                  </div>
                </div>
              </div>

              <div
                className="tj-sidebar-widget widget-feature-item wow fadeInUp p-0"
                data-wow-delay=".3s"
              >
                <RecentBlogWidget
                  title="Recent Campaigns"
                  recentBlogs={latestCampaigns}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioDetailsPrimary;
