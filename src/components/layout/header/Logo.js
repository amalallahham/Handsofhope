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
          width={550}
          height={170}
          style={{
            width: "100%",
            maxWidth: "550px",
            height: "auto",
            display: "block",
          }}
        />
      </Link>
    </div>
  );
};

export default Logo;
