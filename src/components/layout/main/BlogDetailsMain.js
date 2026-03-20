import BlogDetailsPrimary from "@/components/sections/blogs/BlogDetailsPrimary";
import HeroInner from "@/components/sections/hero/HeroInner";


const BlogDetailsMain = ({ items }) => {

	// const option = getPreviousNextItem(items, currentId);
	// const { title } = option?.currentItem || {};
	return (
		<div>
			{/* <HeroInner
				title={items?.title}
				text={items?.title || "Blog Details"}
				breadcrums={[{ name: "Events", path: "/events" }]}
			/> */}
			<BlogDetailsPrimary option={items} />
		</div>
	);
};

export default BlogDetailsMain;
