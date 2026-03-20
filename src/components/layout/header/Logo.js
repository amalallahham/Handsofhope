"use client";

import Image from "next/image";
import Link from "next/link";
const Logo = ({ headerType, isStickyHeader }) => {
  return (
    <div className="site_logo">
      <Link className="logo" href="/">
        <Image
          src="/images/logos/logo.png"
          alt="Hands of Hope logo"
          width={544}
          height={152}
          style={{
            width: "100%",
            maxWidth: "544px",
            height: "auto",
            display: "block",
          }}
        />
      </Link>
    </div>
  );
};

export default Logo;
