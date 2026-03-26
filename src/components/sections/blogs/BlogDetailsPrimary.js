import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import PopupVideo from "@/components/shared/popup-video/PopupVideo";
import BlogSidebar from "@/components/shared/sidebar/BlogSidebar";
import StickySidebar from "@/components/shared/stickySidebar/StickySidebar";
import makePath from "@/libs/makePath";
import Image from "next/image";
import Link from "next/link";

const BlogDetailsPrimary = ({ option }) => {
  const { prevId, nextId, currentItem, isPrevItem, isNextItem } = option || {};
  const { title, id, image_url, tags } = option || {};


  const formattedDateRaw = new Date(option?.event_date)
  .toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  .toLowerCase();

// capitalize first letter of month
const formattedDate = formattedDateRaw.replace(
  /(\d+\s)([a-z])/,
  (match, p1, p2) => p1 + p2.toUpperCase()
);

  const categories = {
    slug: option?.slug,
    event_date: formattedDate,
    doors_open: option?.doors_open,
    venue: option?.venue,
    address: option?.address,
    hosted_by: option?.hosted_by,
    adult_price: option?.adult_price,
    child_price: option?.kid_price,
  };
  console.log("categories", categories);

  const isHappened = option?.event_date
    ? new Date(option?.event_date) < new Date()
    : false;

  const media_partenrs = option?.sponsors.filter(
    (sponsor) => sponsor?.type === "media_partner",
  );
  const sponsors = option?.sponsors.filter(
    (sponsor) => sponsor?.type !== "media_partner",
  );



  return (
    <section className="tj-blog-section section-gap slidebar-stickiy-container pt-5 ">
      <div className="container ">
        <div className="row row-gap-5 blog-details-row">
          <div className="col-lg-8 ">
            <div className="post-details-wrapper ">
              <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                <Image
                  src={image_url || "/images/blog/blog-8.webp"}
                  alt="Images"
                  width={870}
                  height={450}
                  style={{ height: "auto" }}
                />
              </div>

              <div
                className="card border-0 blog-category-two wow fadeInUp p-4"
                data-wow-delay=".3s"
              >
                <h1 className="title title-anim color-red">{title}</h1>

                <div
                  className="blog-category-two wow w-100 fadeInUp"
                  data-wow-delay=".3s"
                >
                  {option?.event_collaborators.length > 0 && (
                    <div className="category-item">
                      {option?.event_collaborators[0]?.logo_url ? (
                        <div >
                          <Image
                            src={option?.event_collaborators[0]?.logo_url}
                            alt="Collaborator Logo"
                            width={50}
                            height={50}
                          />
                        </div>
                      ) : (
                        <div className="cate-icons">
                          <Image
                            src={
                              option?.event_collaborators[0]?.logo_url ||
                              "/icons/collaboration.svg"
                            }
                            alt="Images"
                            width={25}
                            height={25}
                          />
                        </div>
                      )}

                      <div className="cate-text">
                        <span className="degination">Collaboration with</span>
                        {option?.event_collaborators.map(
                          (collaborator, idx) => (
                            <h6 key={idx} className="title">
                              <Link href={collaborator?.website_url || "#"}>
                                {" "}
                                {collaborator?.name}
                              </Link>
                            </h6>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="category-item">
                    <div className="cate-icons">
                      <i className="tji-calendar"></i>
                    </div>
                    <div className="cate-text">
                      <span className="degination">Date</span>
                      <h6 className="text">{formattedDate}</h6>
                    </div>
                  </div>
                  <div className="category-item">
                    <div className="cate-icons">
                      <Image
                        src="/icons/time.svg"
                        alt="time-icon"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="cate-text">
                      <span className="degination">Doors Open at</span>
                      <h6 className="text"> {option?.doors_open}</h6>
                    </div>
                  </div>
                </div>

                <div className="blog-text">
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    {option?.description}
                  </p>

                  {option?.collaboration_note && (
                    <blockquote className="wow fadeInUp" data-wow-delay=".3s">
                      <p>{option?.collaboration_note}</p>
                      <cite>{option?.event_collaborators?.[0]?.name}</cite>
                    </blockquote>
                  )}

                  {sponsors?.length > 0 && (
                    <section className="border-top-dashed py-4">
                      <h3 className="wow fadeInUp" data-wow-delay=".3s">
                        Special Thanks to Our Sponsors
                      </h3>

                      <div className="sponsors-grid-2 wow fadeInUp">
                        {sponsors?.map((sponsor, i) => (
                          <div key={i} className="sponsor-card-2">
                            <div className="sponsor-image-2">
                              <Image
                                src={sponsor.logo_url}
                                alt={sponsor.name}
                                width={100}
                                height={100}
                              />
                            </div>
                            <p className="sponsor-name-2">{sponsor.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {media_partenrs?.length > 0 && (
                    <section className="border-top-dashed py-4">
                      <h3 className="wow fadeInUp" data-wow-delay=".3s">
                        Our Media Partners
                      </h3>

                      <div className="sponsors-grid-2 wow fadeInUp">
                        {media_partenrs?.map((sponsor, i) => (
                          <div key={i} className="sponsor-card-2">
                            <div className="sponsor-image-2">
                              <Image
                                src={sponsor.logo_url}
                                alt={sponsor.name}
                                width={100}
                                height={100}
                              />
                            </div>
                            <p className="sponsor-name-2">{sponsor.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {/* <div className="images-wrap">
                  <div className="row">
                    <div className="col-sm-6">
                      <div
                        className="image-box wow fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <Image
                          src="/images/blog/blog-9.webp"
                          alt="Image"
                          width={420}
                          height={420}
                          style={{ height: "auto" }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div
                        className="image-box wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <Image
                          src="/images/blog/blog-10.webp"
                          alt="Image"
                          width={420}
                          height={420}
                          style={{ height: "auto" }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                  {/* <p className="wow fadeInUp" data-wow-delay=".3s">
                  Lastly, effective leadership that inspires and motivates
                  employees, customers, and stakeholders is essential in
                  steering the business toward achieving its full potential. By
                  applying these lessons, businesses can unlock new
                  opportunities, overcome obstacles, and reach new levels of
                  success.
                </p> */}
                  {/* <ul className="wow fadeInUp" data-wow-delay=".3s">
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Embrace Innovation
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Customer-Centric Approach
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Effective Leadership
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Operational Efficiency
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Scalable Systems
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Resilience
                  </li>
                  <li>
                    <span>
                      <i className="tji-check"></i>
                    </span>
                    Continuous Learning
                  </li>
                </ul> */}
                  {/* <div className="blog-video wow fadeInUp" data-wow-delay=".3s">
                  <Image
                    src="/images/blog/blog-video.webp"
                    alt="Video"
                    width={870}
                    height={498}
                    style={{ height: "auto" }}
                  />
                  <PopupVideo>
                    <Link
                      className="video-btn video-popup glightbox"
                      href="https://www.youtube.com/watch?v=MLpWrANjFbI&ab_channel=eidelchteinadvogados"
                    >
                      <span>
                        <i className="tji-play"></i>
                      </span>
                    </Link>
                  </PopupVideo>
                </div> */}
                  {/* <h3 className="wow fadeInUp" data-wow-delay=".3s">
                  Conclusions
                </h3> */}
                  {/* <p className="wow fadeInUp" data-wow-delay=".3s">
                  Unlocking your business’s full potential is a journey that
                  requires vision, innovation, and strategic on our execution.
                  By embracing key lessons such as leveraging data, focusing on
                  customer are experience, fostering of adaptability, and
                  nurturing effective leadership, businesses can thrive in an
                  ever-evolving marketplace..
                </p> */}
                  {/* <p className="wow fadeInUp" data-wow-delay=".3s">
              
                  The ability to continuously learn, collaborate, and optimize
                  operations will not only drive growth but ensure long-term
                  sustainability. Remember, the path to success is not linear.
                </p> */}
                </div>
                {/* <div className="tj-tags-post wow fadeInUp" data-wow-delay=".3s">
                <div className="tagcloud">
                  <span>Tags:</span>
                  {tags?.length
                    ? tags?.map((tag, idx) => (
                        <Link key={idx} href={`/blogs?tag=${makePath(tag)}`}>
                          {tag}
                        </Link>
                      ))
                    : ""}
                </div>
                <div className="post-share">
                  <ul>
                    <li> Share:</li>
                    <li>
                      <Link href="https://www.facebook.com/" target="_blank">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://x.com/" target="_blank">
                        <i className="fa-brands fa-x-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/" target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.linkedin.com/" target="_blank">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div> */}
                {/* <div
                className="tj-post__navigation  wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div
                  className="tj-nav__post previous"
                  style={{ visibility: isPrevItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav prev_post">
                    <Link href={isPrevItem ? `/blogs/${prevId}` : "#"}>
                      <span>
                        <i className="tji-arrow-left"></i>
                      </span>
                      Previous
                    </Link>
                  </div>
                </div>
                <Link href={"/blogs"} className="tj-nav-post__grid">
                  <i className="tji-window"></i>
                </Link>
                <div
                  className="tj-nav__post next"
                  style={{ visibility: isNextItem ? "visible" : "hidden" }}
                >
                  <div className="tj-nav-post__nav next_post">
                    <Link href={isNextItem ? `/blogs/${nextId}` : "#"}>
                      Next
                      <span>
                        <i className="tji-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div> */}

                {/* <div className="tj-comments-container">
                <div className="tj-comments-wrap">
                  <div className="comments-title">
                    <h3 className="title">Top Comments (02)</h3>
                  </div>
                  <div className="tj-latest-comments">
                    <ul>
                      <li className="tj-comment">
                        <div className="comment-content">
                          <div className="comment-avatar">
                            <Image
                              src="/images/blog/avatar-1.webp"
                              alt="Image"
                              width={64}
                              height={64}
                              style={{ height: "auto" }}
                            />
                          </div>
                          <div className="comments-header">
                            <div className="avatar-name">
                              <h6 className="title">
                                <Link href="/blogs/1">Great insights!</Link>
                              </h6>
                            </div>
                            <div className="comment-text">
                              <span className="date">
                                June 18, 2024 at 06:00 pm
                              </span>
                              <Link className="reply" href="/blogs/1">
                                Reply
                              </Link>
                            </div>
                            <div className="desc">
                              <p>
                                "I completely agree that embracing innovation
                                and leveraging data are crucial for any business
                                looking to stay competitive in today's market.
                                The focus on leadership and adaptability really
                                resonated with me. Looking forward to
                                implementing these strategies"
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="tj-comment">
                        <ul className="children">
                          <li className="tj-comment">
                            <div className="comment-content">
                              <div className="comment-avatar">
                                <Image
                                  src="/images/blog/avatar-2.webp"
                                  alt="Image"
                                  width={64}
                                  height={64}
                                  style={{ height: "auto" }}
                                />
                              </div>
                              <div className="comments-header">
                                <div className="avatar-name">
                                  <h6 className="title">
                                    <Link href="/blogs/1">
                                      This was a fantastic read
                                    </Link>
                                  </h6>
                                </div>
                                <div className="comment-text">
                                  <span className="date">
                                    June 18, 2024 at 06:00 pm
                                  </span>
                                  <Link className="reply" href="/blogs">
                                    Reply
                                  </Link>
                                </div>
                                <div className="desc">
                                  <p>
                                    "The lessons on customer-centric approaches
                                    and operational efficiency are especially
                                    relevant. It's inspiring to see how these
                                    core principles can truly unlock a
                                    business's potential. Thanks for sharing
                                    such valuable content!"
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li className="tj-comment">
                        <div className="comment-content">
                          <div className="comment-avatar">
                            <Image
                              src="/images/blog/avatar-2.webp"
                              alt="Image"
                              width={64}
                              height={64}
                              style={{ height: "auto" }}
                            />
                          </div>
                          <div className="comments-header">
                            <div className="avatar-name">
                              <h6 className="title">
                                <Link href="/blogs/1">
                                  This was a fantastic read
                                </Link>
                              </h6>
                            </div>
                            <div className="comment-text">
                              <span className="date">
                                June 18, 2024 at 06:00 pm
                              </span>
                              <Link className="reply" href="/blogs/1">
                                Reply
                              </Link>
                            </div>
                            <div className="desc">
                              <p>
                                "The lessons on customer-centric approaches and
                                operational efficiency are especially relevant.
                                It's inspiring to see how these core principles
                                can truly unlock a business's potential. Thanks
                                for sharing such valuable content!"
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tj-comments__container">
                  <div className="comment-respond">
                    <h3 className="comment-reply-title">Leave a Comment</h3>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-input">
                          <textarea
                            id="comment"
                            name="message"
                            placeholder="Write Your Comment *"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-input">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Full Name *"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-input">
                          <input
                            type="email"
                            id="emailOne"
                            name="name"
                            placeholder="Your Email *"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-input">
                          <input
                            type="text"
                            id="website"
                            name="name"
                            placeholder="Website"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="comments-btn">
                        <ButtonPrimary text={"Submit Now"} type={"submit"} />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
                {!isHappened && (
                  <div className="d-flex align-items-center justify-content-center border-top-dashed pt-4 w-100">
                    <ButtonPrimary text={"Register Now"} type={"submit"} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 blog-sidebar-col">
            <div className="sidebar-sticky-wrapper">
              <BlogSidebar categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsPrimary;
