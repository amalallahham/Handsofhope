import ButtonPrimary from "../buttons/ButtonPrimary";
import BlogCategoriesWidget from "./widgets/BlogCategoriesWidget";

const BlogSidebar = ({ categories, hideBtn }) => {
  const rawDate = categories?.event_date_raw;

  const isHappened = rawDate ? new Date(rawDate) < new Date() : false;

  const isSameDay = rawDate
    ? (() => {
        const eventDate = new Date(rawDate);
        const today = new Date();
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      })()
    : false;

  const showRegisterBtn = !isSameDay && !isHappened && !hideBtn;

  return (
    <aside className="tj-main-sidebar">
      {showRegisterBtn && (
        <div className="tj-sidebar-widget widget-search p-4 hide-sm">
          <ButtonPrimary
            className="w-100"
            text="Register Now"
            url={`/events/${categories?.slug}/register`}
          />
        </div>
      )}
      <BlogCategoriesWidget categories={categories} />
    </aside>
  );
};

export default BlogSidebar;