"use client";

import Image from "next/image";
import Link from "next/link";
const Logo = ({ headerType, isStickyHeader }) => {
	return (
		<div className="site_logo">
			<Link className="logo" href="/">
				<Image
					src={
						
					
						 "/images/logos/logo-3.svg"
							
					}
					alt=""
					width={544}
					height={152}
					style={{ height: "auto", display: "block" }}
				/>
			</Link>
		</div>
	);
};

export default Logo;
