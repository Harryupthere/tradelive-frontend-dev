import { ArrowRight, Home, Shield } from "lucide-react";
import "./Banner.scss";
import VideoFrame from "./VideoFram";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const base = import.meta.env.VITE_BASE;

const Banner = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // 16 May 2026 4:00 PM
    const targetDate = new Date("2026-05-16T16:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();

      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("Services are now live");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="landing-container" data-aos="fade-bottom">
      <div className="blurs_wrapper">
        <div className="blurs_object is-fluo"></div>
      </div>

      <div className="banner-alert">
        <div className="banner-alert__content">
          <div className="banner-alert__icon">
            <Shield size={22} />
          </div>
          <div className="banner-alert__text">
            <h3>Platform Maintenance In Progress</h3>

            <p>
              We’re currently upgrading our infrastructure and trading modules
              to improve performance and stability.
            </p>

            <div className="maintenance-timer">
              Services Resume In: <span>{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

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
