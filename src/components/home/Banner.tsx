import { ArrowRight, Home, Shield } from "lucide-react";
import "./Banner.scss";
import VideoFrame from "./VideoFram";
import { useNavigate } from "react-router-dom";

const base = import.meta.env.VITE_BASE;

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container" data-aos="fade-bottom">
      <div className="blurs_wrapper">
        <div className="blurs_object is-fluo"></div>
      </div>

      {/* <div className="banner-alert">
          <div className="banner-alert__content">
            <div className="banner-alert__icon">
              <Shield size={22} />
            </div>
            <div className="banner-alert__text">
              <h3>Scheduled maintenance in progress until 29th, 6AM</h3>
              <p>
                Module playback, payments, and news APIs may not work as
                expected during this time. Services will be restored shortly.
                Thank you for your patience.
              </p>
            </div>
          </div>
        </div> */}

        <div className="landing-body">

      <div className="content-section">
        

        <h1 className="main-heading">
          <div className="white-text">Learn To Trade</div>
          <div className="gradient-text">The Right Way</div>
        </h1>

        <p className="description">
          Master real market structure, price action, and mindset — not just
          theory. Join a community built by traders, for traders.
        </p>

        <div className="input-section">
          {/* <div className="phone-input">
            <span className="country-code">+91</span>
            <input type="tel" placeholder="Enter Mobile Number" />
          </div> */}
          <button
            className="get-started-btn"
            onClick={() => {
              navigate(`${base}login`);
            }}
          >
            Start Learning
            <ArrowRight size={20} />
          </button>
        </div>

        <button className="google-btn">
          <Home size={20} />
          Join The Community
        </button>
      </div>
      <div className="right-section">
        <VideoFrame
          videoUrl="https://d2vg0c60oys8dk.cloudfront.net/f8b0589d-438e-4f64-bef3-9bf06d19c15b-TL24 Welcome.mov"
          poster="/video-poster.jpg"
        />
      </div>
      </div>
    </div>
  );
};

export default Banner;
