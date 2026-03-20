"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useIsSticky from "@/hooks/useIsSticky";
import Link from "next/link";
import { useState } from "react";
import ContactMenu from "./ContactMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

const Header = ({
  headerType = 1,
  isHeaderTop = false,
  topbarType = 1,
  isStickyHeader = false,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSticky = useIsSticky(isStickyHeader);
  const handleContactTogglerClick = () => {
    setIsContactOpen(true);
  };
  const handleMobileTogglerClick = () => {
    setIsMobileMenuOpen(true);
  };
  return (
    <>
      {/* <!-- start: Offcanvas Menu --> */}
      <ContactMenu
        isContactOpen={isContactOpen}
        setIsContactOpen={setIsContactOpen}
      />

      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {/* <!-- end: Offcanvas Menu --> */}

      {/* Search Popup --> */}
      <div
        className={`search-popup-overlay ${
          isSearchOpen ? "search-popup-overlay-open" : ""
        }`}
        onClick={() => setIsSearchOpen(false)}
      ></div>
      <header
        className={`header-area header-1  section-gap-x ${
          isStickyHeader
            ? `header-duplicate header-sticky ${isSticky ? "sticky" : ""}`
            : "header-absolute"
        } `}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="header-wrapper">
                {/* <!-- site logo --> */}
                <Logo headerType={headerType} isStickyHeader={isStickyHeader} />

                {/* <!-- navigation --> */}
                <Navbar />
                {/* <!-- header right info --> */}
                <div className="header-right-item d-none d-lg-inline-flex">
                  <div className="header-button">
                    {/* <ButtonPrimary text={"Donate Now"} url={"/contact"} /> */}
                  </div>
                </div>
                {/* <!-- menu bar --> */}
                <div
                  className="menu_bar mobile_menu_bar d-lg-none"
                  onClick={handleMobileTogglerClick}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Search Popup --> */}
        <div className={`search_popup ${isSearchOpen ? "search-opened" : ""}`}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-8">
                <div className="tj_search_wrapper">
                  <div className="search_form">
                    <form action="#">
                      <div className="search_input">
                        <div className="search-box">
                          <input
                            className="search-form-input"
                            type="text"
                            placeholder="Type Words and Hit Enter"
                            required
                          />
                          <button type="submit">
                            <i className="tji-search"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
