import { useEffect, useRef, useState } from "react";
import "./Highlightsection.scss";

interface Point {
  icon: string;
  label: string;
  desc: string;
  delay: number;
}

const points: Point[] = [
  {
    icon: "📊",
    label: "Learn Real Price Action",
    desc: "Master market structure, candlesticks & key levels",
    delay: 0,
  },
  {
    icon: "🤖",
    label: "AI Trading Assistant",
    desc: "Real-time AI signals & market analysis at your fingertips",
    delay: 100,
  },
  {
    icon: "📚",
    label: "Beginner → Pro Roadmap",
    desc: "Step-by-step curriculum from zero to consistent trader",
    delay: 200,
  },
  {
    icon: "💬",
    label: "Active Trader Community",
    desc: "Trade alongside thousands of growth-focused members",
    delay: 300,
  },
];

export default function HighlightSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`hl-section ${visible ? "hl-section--visible" : ""}`}
      ref={sectionRef}
    >
      {/* Ambient background orbs */}
      <div className="hl-orb hl-orb--1" />
      <div className="hl-orb hl-orb--2" />
      <div className="hl-orb hl-orb--3" />

      {/* Grid lines */}
      <div className="hl-grid" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div className="hl-grid__line" key={i} />
        ))}
      </div>

      <div className="hl-card">
        {/* Top accent bar */}
        <div className="hl-card__bar" />

        <div className="hl-card__inner">
          {/* Badge */}
          <div className="hl-badge">
            <span className="hl-badge__dot" />
            AI-Powered Platform
          </div>

          <h2 className="hl-title">
            Unlock Smarter Trading
            <span className="hl-title__accent"> with AI + Real Education</span>
          </h2>

          <p className="hl-subtitle">
            Why struggle with random signals when you can learn how markets
            actually work? TradeLive24 gives you AI-powered insights, real
            trading education, and a community that helps you grow —{" "}
            <em>not gamble.</em>
          </p>

          {/* Feature cards */}
          <div className="hl-points">
            {points.map((p: Point, i: number) => (
              <div
                key={i}
                className={`hl-point ${hoveredCard === i ? "hl-point--hovered" : ""}`}
                style={{ transitionDelay: `${p.delay + 300}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="hl-point__glow" />
                <div className="hl-point__icon-wrap">
                  <span className="hl-point__icon">{p.icon}</span>
                </div>
                <div className="hl-point__text">
                  <span className="hl-point__label">{p.label}</span>
                  <span className="hl-point__desc">{p.desc}</span>
                </div>
                <div className="hl-point__arrow">→</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hl-cta-wrap">
            <button className="hl-btn" type="button">
              <span className="hl-btn__text">Start Learning Now</span>
              <span className="hl-btn__arrow">→</span>
              <div className="hl-btn__shine" />
            </button>
            <p className="hl-cta-note">No credit card required · Free to start</p>
          </div>
        </div>
      </div>
    </section>
  );
}