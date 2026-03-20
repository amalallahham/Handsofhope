"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavbar = () => {
  const pathname = usePathname();

  const items = [
    { id: 1, name: "Campaigns", path: "/campaigns" },
    { id: 2, name: "Events", path: "/events" },
    { id: 3, name: "Contact", path: "/contact" },
  ];

  return (
    <div className="hamburger_menu">
      <div className="mobile_menu mean-container">
        <div className="mean-bar">
          <Link
            href="#nav"
            className="meanmenu-reveal"
            style={{ right: 0, left: "auto" }}
          >
            <span>
              <span>
                <span></span>
              </span>
            </span>
          </Link>

          <nav className="mean-nav">
            <ul>
              {items.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <li
                    key={item.id}
                    className={isActive ? "current-menu-item" : ""}
                  >
                    <Link href={item.path}>{item.name}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;