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
    (match, p1, p2) => p1 + p2.toUpperCase(),
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
    ticket_types: option?.event_ticket_types || [],
  };

  const isHappened = option?.event_date
    ? new Date(option?.event_date) < new Date()
    : false;

  const isSameDay = option?.event_date
    ? (() => {
        const eventDate = new Date(option.event_date);
        const today = new Date();
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      })()
    : false;

  const sortByOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

  const media_partenrs = [...(option?.sponsors || [])]
    .filter((s) => s?.type === "media_partner")
    .sort(sortByOrder);

  const sponsors = [...(option?.sponsors || [])]
    .filter((s) => s?.type !== "media_partner")
    .sort(sortByOrder);

  const ticketTypes = [...(option?.event_ticket_types || [])]
    .filter((ticket) => ticket?.is_active !== false) // ← handles it
    .sort(sortByOrder);

  return (
    <section className="tj-blog-section section-gap-1 slidebar-stickiy-container ">
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
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODcwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+"
                />
              </div>
              {!isHappened && !isSameDay ? (
                <div className="tj-sidebar-widget widget-search p-4 hide-lg">
                  <ButtonPrimary
                    className="w-100"
                    text={"Register Now"}
                    url={`/events/${categories?.slug}/register`}
                  />
                </div>
              ) : (
                <></>
              )}

              <div
                className="card border-0 blog-category-two wow fadeInUp p-4"
                data-wow-delay=".3s"
              >
                <h1 className="title title-anim color-red">{title}</h1>

                <div
                  className="blog-category-two wow w-100 fadeInUp"
                  data-wow-delay=".3s"
                >
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

                  {ticketTypes?.length > 0 && (
                    <div className="category-item">
                      <div className="cate-icons">
                        <Image
                          src={"/icons/tickets.svg"}
                          alt="Images"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="cate-text">
                        <span className="degination">Tickets</span>
                        <div className="text d-flex flex-column">
                          {ticketTypes.map((ticket) => (
                            <p key={ticket.id} className="mb-0">
                              {ticket.name}:{" "}
                              <span className="color-green">
                                ${(ticket.price_cents / 100).toFixed(2)}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="blog-text">
                  <p
                    className="wow fadeInUp"
                    data-wow-delay=".3s"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {option?.description}
                  </p>

                  {option?.collaboration_note && (
                    <blockquote
                      className="wow fadeInUp my-2"
                      data-wow-delay=".3s"
                    >
                      <p style={{ whiteSpace: "pre-line" }} className="mb-1">
                        {option?.collaboration_note}
                      </p>
                      <cite>{option?.event_collaborators?.[0]?.name}</cite>
                    </blockquote>
                  )}

                  {option?.event_collaborators?.length > 0 && (
                    <section className="border-top-dashed py-4">
                      <h3 className="wow fadeInUp" data-wow-delay=".3s">
                        Organized by
                      </h3>

                      <div className="sponsors-grid-2 wow fadeInUp">
                        {option?.event_collaborators?.map((collaborator, i) => (
                          <div key={i} className="sponsor-card-2">
                            <div className="sponsor-image-2 collaborator">
                              <Image
                                src={collaborator.logo_url}
                                alt={collaborator.name}
                                width={100}
                                height={100}
                              />
                            </div>
                            <p className="sponsor-name-2">
                              {collaborator.name}
                            </p>
                          </div>
                        ))}
                        <div className="sponsor-card-2">
                          <div className="sponsor-image-2 collaborator-2">
                            <Image
                              src={"/images/logos/logo-bg-white.png"}
                              alt="Hands Of Hope"
                              width={500}
                              height={500}
                            />
                          </div>
                          <p className="sponsor-name-2">Hands Of Hope</p>
                        </div>
                      </div>
                    </section>
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
                </div>

                {!isHappened && !isSameDay ? (
                  <div className="d-flex align-items-center justify-content-center border-top-dashed pt-4 w-100">
                    <ButtonPrimary
                      className="w-100"
                      text={"Register Now"}
                      url={`/events/${categories?.slug}/register`}
                    />
                  </div>
                ) : null}
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
