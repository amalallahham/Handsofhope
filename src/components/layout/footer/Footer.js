import Link from "next/link";

const Footer = () => {
  return (
    <footer className="tj-footer-section footer-1 section-gap-x">
      <div className="footer-main-area">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget wow fadeInUp" data-wow-delay=".1s">
                <div className="footer-logo">
                  <Link href="/">
                    <img src="/images/logos/logo-2.svg" alt="Logos" />
                  </Link>
                </div>
                <div className="footer-text">
                  <p>
                    Hands of Hope is dedicated to supporting communities through
                    meaningful events, compassionate campaigns, and initiatives
                    that bring relief, dignity, and hope.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="footer-widget widget-nav-menu wow fadeInUp"
                data-wow-delay=".3s"
              >
                <h5 className="title">Quick Links</h5>
                <ul>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/events">Events</Link>
                  </li>
                  <li>
                    <Link href="/campaigns">Campaigns</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="col-xl-2 col-lg-4 col-md-6">
              <div
                className="footer-widget widget-nav-menu wow fadeInUp"
                data-wow-delay=".5s"
              >
                <h5 className="title">Resources</h5>
                <ul>
                  <li>
                    <Link href="/contact">Contact us</Link>
                  </li>
                  <li>
                    <Link href="/team">Team Member</Link>
                  </li>
                  <li>
                    <Link href="#">Recognitions</Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      Careers <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs">News</Link>
                  </li>
                  <li>
                    <Link href="#">Feedback</Link>
                  </li>
                </ul>
              </div>
            </div> */}
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div
                className="footer-widget widget-subscribe wow fadeInUp"
                data-wow-delay=".7s"
              >
                <h3 className="title">Subscribe to Our Newsletter.</h3>
                <div className="subscribe-form">
                  <form action="#">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                    />
                    <button type="submit">
                      <i className="tji-plane"></i>
                    </button>
                    <label htmlFor="agree">
                      <input id="agree" type="checkbox" />
                      Agree to our{" "}
                      <Link href="/terms-and-conditions">
                        Terms & Condition?
                      </Link>
                    </label>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tj-copyright-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="copyright-content-area">
                <div className="footer-contact">
                  <ul>
                    <li>
                      <Link href="tel:10095447818">
                        <span className="icon">
                          <i className="tji-phone-2"></i>
                        </span>
                        <span className="text">+1 (236) 335-9951</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="mailto:info@handsofhopeorg.ca">
                        <span className="icon">
                          <i className="tji-envelop-2"></i>
                        </span>
                        <span className="text">info@handsofhopeorg.ca</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="social-links">
                  <ul>
                    <li>
                      <Link href="https://www.facebook.com/handsofhopebc" target="_blank">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/handsofhopebc" target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>

                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-shape-1">
        <img src="/images/shape/pattern-2.svg" alt="" />
      </div>
      <div className="bg-shape-2">
        <img src="/images/shape/pattern-3.svg" alt="" />
      </div>
    </footer>
  );
};

export default Footer;
