import { useEffect, useRef, useState } from "react";
import "./Maintenance.scss";

const Maintenance = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 50,
    minutes: 42,
    seconds: 17,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let total =
          prev.hours * 3600 + prev.minutes * 60 + prev.seconds;

        if (total <= 0) return prev;

        total--;

        return {
          hours: Math.floor(total / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.3,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,106,.45)";
        ctx.fill();
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleNotify = () => {
    if (!email.includes("@")) return;

    setShowToast(true);
    setEmail("");

    setTimeout(() => setShowToast(false), 3000);
  };

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="maintenance-page">
      <div className="aurora">
        <div className="aurora__inner" />
      </div>

      <canvas ref={canvasRef} className="dust-canvas" />

      <div className="noise" />

      <div className={`toast ${showToast ? "show" : ""}`}>
        You're on the list
      </div>

      <div className="page">
        <header>
          <div className="logo">
            <div className="logo__icon">📈</div>
            <div className="logo__word">
              Trade<strong>Live</strong>24
            </div>
          </div>

          <div className="header-status">
            <span className="pip" />
            Systems Upgrading
          </div>
        </header>

        <main className="centre">
          <p className="eyebrow">Scheduled Maintenance</p>

          <h1 className="title">
            Elevating
            <br />
            your <em>edge.</em>
          </h1>

          <div className="rule" />

          <p className="subtitle">
            We are refining every corner of the TradeLive24 education and
            evaluation experience. The platform returns sharper, faster, and
            worthy of the traders who use it.
          </p>

          <div className="countdown">
            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.hours)}</span>
              <span className="countdown__label">Hours</span>
            </div>

            <span className="countdown__sep">:</span>

            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.minutes)}</span>
              <span className="countdown__label">Minutes</span>
            </div>

            <span className="countdown__sep">:</span>

            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.seconds)}</span>
              <span className="countdown__label">Seconds</span>
            </div>
          </div>

          <div className="notify">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleNotify}>Notify Me</button>
          </div>
        </main>

        <footer>
          <span>© 2025 TradeLive24 Education Hub</span>

          <div className="links">
            <a href="#">Support</a>
            <a href="#">Community</a>
            <a href="#">Legal</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Maintenance;
