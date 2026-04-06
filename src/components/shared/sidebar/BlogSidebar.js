import ButtonPrimary from "../buttons/ButtonPrimary";
import BlogCategoriesWidget from "./widgets/BlogCategoriesWidget";


const BlogSidebar = ({ categories, hideBtn }) => {
  const isHappened = categories?.event_date
    ? new Date(categories.event_date) < new Date()
    : false;

  const isSameDay = categories?.event_date
    ? (() => {
        const eventDate = new Date(categories.event_date);
        const today = new Date();
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      })()
    : false;
  return (
    <aside className={`tj-main-sidebar`}>
      {/* <!-- search --> */}
      {!isSameDay && !isHappened && !hideBtn && (
        <div className="tj-sidebar-widget widget-search p-4 hide-sm">
          <ButtonPrimary
            className="w-100"
            text={"Register Now"}
            url={`/events/${categories?.slug}/register`}
          />
        </div>
      )}
      {/* <!-- recent post --> */}

      {/* <!-- category --> */}
      <BlogCategoriesWidget categories={categories} />
      {/* <!-- tags --> */}

      {/* <RecentBlogWidget /> */}
      {/* <BlogTagsWidget /> */}
    </aside>
  );
};

export default BlogSidebar;
