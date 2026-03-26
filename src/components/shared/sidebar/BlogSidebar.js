import ButtonPrimary from "../buttons/ButtonPrimary";
import BlogCategoriesWidget from "./widgets/BlogCategoriesWidget";
import BlogTagsWidget from "./widgets/BlogTagsWidget";
import RecentBlogWidget from "./widgets/RecentBlogWidget";

const BlogSidebar = ({ categories, hideBtn }) => {
    const isHappened = categories?.event_date ? new Date(categories.event_date) < new Date() : false;

  return (
    <aside className={`tj-main-sidebar`}>
      {/* <!-- search --> */}
     {!isHappened && !hideBtn && (
        <div className="tj-sidebar-widget widget-search p-4 hide-sm">
          <ButtonPrimary className="w-100" text={"Register Now"}   url={`/events/${categories?.slug}/register`}
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
