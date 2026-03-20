import Link from "next/link";

const ContactTop = () => {
  return (
    <div className="tj-contact-area section-gap pt-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-heading text-center">
              <span className="sub-title wow fadeInUp" data-wow-delay=".1s">
                <i className="tji-box"></i>Contact info
              </span>
              <h2 className="sec-title title-anim">
                <span>Reach</span> Out to Us
              </h2>
            </div>
          </div>
        </div>
        <div className="row row-gap-4 justify-content-center">
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div
              className="contact-item style-2 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="contact-icon">
                <i className="tji-location-3"></i>
              </div>
              <h3 className="contact-title">Our Location</h3>
              <p>Delta, BC Canada</p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div
              className="contact-item style-2 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <div className="contact-icon">
                <i className="tji-envelop"></i>
              </div>
              <h3 className="contact-title">Email us</h3>
              <ul className="contact-list">
        
                <li>
                  <Link href="mailto:info@handsofhopeorg.ca">info@handsofhopeorg.ca</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-sm-6">
            <div
              className="contact-item style-2 wow fadeInUp"
              data-wow-delay=".7s"
            >
              <div className="contact-icon">
                <i className="tji-phone"></i>
              </div>
              <h3 className="contact-title">Call us</h3>
              <ul className="contact-list">
                <li>
                  <Link href="tel:+1-236-335-9951">P: +1 (236) 335-9951</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTop;
