import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CountdownPage.scss";
const base = import.meta.env.VITE_BASE;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LaunchDetails {
  id: number;
  launch_date: string;
  content: string;
}

const apiUrl = "https://app.tradelive24.com/api/v1/launch-details";

const getTimeLeft = (targetDate: number): TimeLeft => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const CountdownPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [dynamicHtml, setDynamicHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // fallback HTML from your old page
  const fallbackHtml = `<div style="margin-top:2.5rem;font-size:1.2rem;color:#eaeaea;text-align:center;line-height:1.8;letter-spacing:0.02em;animation:fadeInUp 1.3s ease-out 0.8s both;">
  <p>
    A next-generation platform built to make trading education 
    <span style="color:#a8ff00;font-weight:700;font-family:Orbitron,sans-serif;letter-spacing:0.04em;text-shadow:0 0 8px rgba(168,255,0,0.3);">
      free, transparent, and accessible
    </span> 
    to everyone.<br/><br/>
    From structured lessons to live discussions — everything you need to become a skilled trader exists 
    <strong>in one intelligent hub.</strong><br/><br/>
    <span style="color:#a8ff00;font-weight:700;font-family:Orbitron,sans-serif;letter-spacing:0.04em;text-shadow:0 0 8px rgba(168,255,0,0.3);">
      Built by traders, for traders.
    </span><br/>
    TradeLive24 is where knowledge, community, and real market experience come together — 
    free for everyone who wants to grow.
  </p>
</div>`;

  // Fetch launch details on mount
  useEffect(() => {
    const fetchLaunchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        const data: LaunchDetails | undefined = response.data?.data?.[0];

        if (data) {
          setDynamicHtml(data.content || "");
          const dateMs = new Date("2026-05-19T18:00:00").getTime();
          setTargetDate(dateMs);
          setTimeLeft(getTimeLeft(dateMs));
        } else {
          // No data from API → fallback
          setDynamicHtml(fallbackHtml);
          const fallbackDate = new Date("2026-05-19T18:00:00").getTime();
          setTargetDate(fallbackDate);
          setTimeLeft(getTimeLeft(fallbackDate));
        }
      } catch (err: any) {
        setError(err);
        setDynamicHtml(fallbackHtml);
        const fallbackDate = new Date("2026-05-19T18:00:00").getTime();
        setTargetDate(fallbackDate);
        setTimeLeft(getTimeLeft(fallbackDate));
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchDetails();
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => num.toString().padStart(2, "0");

  const showDays = timeLeft.days > 0;

  return (
    <div className="countdown-page">
      <div className="countdown-page__container">
        {loading ? (
          <div className="countdown-page__loader">
            <div className="countdown-page__spinner"></div>
            <div>Loading...</div>
          </div>
        ) : (
          <>
            {/* Logo Section (Layout 1: stacked logos) */}
            <div className="countdown-page__logo-section">
              <div className="countdown-page__logo-container">
                <div className="countdown-page__logo-image">
                  <div className="logo">
                    <img
                      src={`${base}tradelive-logo-full.png`}
                      alt="TradeLive Logo"
                    />
                  </div>
                  <div className="main-title-image">
                    <img
                      src='../tradelive-logo.png'
                      alt="TRADELIVE24"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Title (text version under logos if you still want it) */}
            {/* <div className="countdown-page__title-section">
              <h1 className="countdown-page__main-title">
                TRADE<span className="countdown-page__highlight">LIVE</span>24
              </h1>
            </div> */}

            {/* <div className="countdown-page__home-btn">
              <a href={`${base}`} className="home-btn-link">
                ⬅ Back to Home
              </a>
            </div> */}

            {/* Countdown Timer */}
            

            {/* Dynamic HTML from API (option A: directly under countdown) */}
            {/* {dynamicHtml && (
              <div
                className="countdown-page__dynamic-html"
                dangerouslySetInnerHTML={{ __html: dynamicHtml }}
              />
            )} */}

            {/* Info Section (you can keep / edit this part as you like) */}
            {/* <div className="countdown-page__info-section">
              <div className="countdown-page__main-message">
                <p className="countdown-page__tagline">
                  A new era of trading wisdom begins.
                </p>
              </div>

              <div className="countdown-page__launch-info">
                <p className="countdown-page__launch-text">
                  <span className="countdown-page__brand-highlight">
                    TradeLive24
                  </span>{" "}
                  goes live soon. Stay tuned for the official launch date.
                </p>
              </div>

              <div className="countdown-page__call-to-action">
                <p className="countdown-page__cta-text">
                  Get ready to{" "}
                  <span className="countdown-page__action-word">Learn.</span>{" "}
                  <span className="countdown-page__action-word">Adapt.</span>{" "}
                  <span className="countdown-page__action-word">React.</span>
                </p>
              </div>

             
            </div> */}
            <div className="countdown-page__info-section">
  <div className="countdown-page__main-message">
    <p className="countdown-page__tagline">
      We’re upgrading the TradeLive24 experience.
    </p>
  </div>

  <div className="countdown-page__launch-info">
    <p className="countdown-page__launch-text">
      <span className="countdown-page__brand-highlight">
        TradeLive24
      </span>{" "}
       has completed major platform upgrades and enhancements. We are currently
    conducting final validation and performance checks to ensure everything
    runs smoothly before relaunch.
    </p>
  </div>

  <div className="countdown-page__call-to-action">
    <p className="countdown-page__cta-text">
      Enhanced platform experience in{" "}
      <span className="countdown-page__action-word">
        {/* {timeLeft} */}
      </span>
    </p>
  </div>
  <div className="countdown-page__countdown">
              <div className="countdown-page__timer">
                {showDays && (
                  <>
                    <div className="countdown-page__time-unit">
                      <div className="countdown-page__time-number">
                        {formatNumber(timeLeft.days)}
                      </div>
                      <div className="countdown-page__time-label">DAYS</div>
                    </div>
                    <div className="countdown-page__separator">:</div>
                  </>
                )}

                <div className="countdown-page__time-unit">
                  <div className="countdown-page__time-number">
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <div className="countdown-page__time-label">HOURS</div>
                </div>

                <div className="countdown-page__separator">:</div>

                <div className="countdown-page__time-unit">
                  <div className="countdown-page__time-number">
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <div className="countdown-page__time-label">MINUTES</div>
                </div>

                <div className="countdown-page__separator">:</div>

                <div className="countdown-page__time-unit">
                  <div className="countdown-page__time-number">
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <div className="countdown-page__time-label">SECONDS</div>
                </div>
              </div>
            </div>
</div>

            {/* Footer */}
            <div className="countdown-page__footer">
              <p>© 2025 TradeLive24. All rights reserved.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountdownPage;
