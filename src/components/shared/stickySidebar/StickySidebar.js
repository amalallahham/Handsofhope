"use client";

import { useEffect, useRef, useState } from "react";

const StickySidebar = ({ children, top = 120 }) => {
  const wrapperRef = useRef(null);

  const [style, setStyle] = useState({
    position: "relative",
    top: "auto",
    left: "auto",
    width: "100%",
  });

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      if (window.innerWidth < 992) {
        setStyle({
          position: "relative",
          top: "auto",
          left: "auto",
          width: "100%",
        });
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const startSticky = window.scrollY + rect.top - top;

      if (window.scrollY < startSticky) {
        setStyle({
          position: "relative",
          top: "auto",
          left: "auto",
          width: "100%",
        });
      } else {
        setStyle({
          position: "fixed",
          top: `${top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        });
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [top]);

  return (
    <div ref={wrapperRef} className="sticky-sidebar-wrapper-js">
      <div style={style} className="sticky-sidebar-box-js">
        {children}
      </div>
    </div>
  );
};

export default StickySidebar;