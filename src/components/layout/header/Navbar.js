"use client";

import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ headerType, isStickyHeader }) => {
  const pathname = usePathname();

  const items = [
    { id: 1, name: "Campaigns", path: "/campaigns" },
    { id: 2, name: "Events", path: "/events" },
    { id: 3, name: "About us", path: "/about" },
    { id: 4, name: "Contact", path: "/contact" },
  ];

  return (
    <div className="menu-area d-none d-lg-inline-flex align-items-center">
      <nav id="mobile-menu" className="mainmenu">
        <ul>
          {items.map((ele) => {
            const isActive = pathname === ele.path;

            return (
              <li key={ele.id} className={isActive ? "current-menu-item" : ""}>
                <Link href={ele.path}>{ele.name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
