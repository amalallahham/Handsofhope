import countDataLength from "@/libs/countDataLength";
import filterItems from "@/libs/filterItems";

import getBlogs from "@/libs/getBlogs";
import makePath from "@/libs/makePath";
import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";

const BlogCategoriesWidget = ({ categories }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day} - ${month} - ${year}`;
  };
  const data = [
    { title: "Event Date:", value: formatDate(categories?.event_date) },
    { title: "Adult Price:", value: categories?.adult_price + "$"  , className: "golden-color"},
    { title: "Child Price:", value: categories?.child_price + "$" , className: "golden-color"},
    { title: "Doors Open:", value: categories?.doors_open },
    { title: "Venue:", value: categories?.venue },
    { title: "Address:", value: categories?.address },
  ];
  

  return (
    <div className="tj-sidebar-widget widget-categories">
      <h4 className="widget-title">Details</h4>
      <ul>
        {data?.map((category, idx) => (
          category?.value && 
          <li key={idx}>
            <p>
              {category?.title}{" "}
              <span className={`number ${category?.className || ""}`}>
                
               

				 {category?.value || "N/A"}
                
              </span>
            </p>{" "}
          </li>
          
        ))}
      </ul>
    </div>
  );
};

export default BlogCategoriesWidget;
