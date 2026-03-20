import getBlogs from "@/libs/getBlogs";
import sliceText from "@/libs/sliceText";
import Image from "next/image";
import Link from "next/link";

const RecentBlogWidget = ({ title, recentBlogs }) => {

  return (
    <div className="tj-sidebar-widget tj-recent-posts">
      <h4 className="widget-title">{title}</h4>
      <ul>
        {recentBlogs?.length
          ? recentBlogs?.map(({ id, poster_url, title, status }, idx) => (
              <li key={idx}>
                <div className="post-thumb">
                  <Link href={`/blogs/${id}`}>
                    {" "}
                    <Image
                      src={poster_url}
                      alt="Blog"
                      width={150}
                      style={{ height: "150px" }}
                      height={150}
                    />
                  </Link>
                </div>
                <div className="post-content">
                  <h6 className="post-title">
                    <Link href={`/blogs/${id}`}>
                      {sliceText(title, 32, true)}
                    </Link>
                  </h6>
                  <div className="blog-meta">
                    <ul>
                      <li>
                        <span
                          className={`status-badge ${status?.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            ))
          : ""}
      </ul>
    </div>
  );
};

export default RecentBlogWidget;
