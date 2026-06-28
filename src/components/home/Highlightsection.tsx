import { useEffect, useRef, useState } from "react";
import "./Highlightsection.scss";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import image from "../../utils/helpers";
const base = import.meta.env.VITE_BASE;

interface Point {
  icon: string;
  label: string;
  desc: string;
  delay: number;
}

const points: Point[] = [
  {
    icon: image['bar-graph.png'],
    label: "Learn Real Price Action",
    desc: "Master market structure, candlesticks & key levels",
    delay: 0,
  },
  {
    icon: image['robot.png'],
    label: "AI Trading Assistant",
    desc: "Real-time AI signals & market analysis at your fingertips",
    delay: 100,
  },
  {
    icon: image['roadmap.png'],
    label: "Beginner → Pro Roadmap",
    desc: "Step-by-step curriculum from zero to consistent trader",
    delay: 200,
  },
  {
    icon: image['message.png'],
    label: "Active Trader Community",
    desc: "Trade alongside thousands of growth-focused members",
    delay: 300,
  },
];

export default function HighlightSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();
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
            Unlock Smarter Trading with
            <span className="hl-title__accent">  AI + Real Education only at $0.13 per day</span>
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
                  <span className="hl-point__icon">
                    <img src={p.icon} alt="icon"/>
                    </span>
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
      </div>
    </section>
  );
}