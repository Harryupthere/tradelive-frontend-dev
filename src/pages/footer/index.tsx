import { Link } from "react-router-dom";
import "./footer.scss";
import { Container } from "@mui/material";
import image from "../../utils/helpers";
const base = import.meta.env.VITE_BASE;

const Footer = () => {
  return (
    <footer>
      <Container maxWidth={false}>
        <div className="logo">
          <img src={`${base}TRADELIVE24-logo.png`} alt="logo" />
        </div>
        <div className="footer-flex">
          <div className="left-side">
            <div className="content">
              TradeLive24 is built on the belief that trading education should
              be free, transparent, and accessible to everyone. Every dollar
              collected is reinvested into maintaining and improving the
              platform — no profits, no hidden agendas, just pure trading wisdom
              for the community.
              <br />
              Learn. Adapt. React. — Empowering traders, one decision at a time.
              <br />
              <br />
              ©️ 2025 TradeLive24. All rights reserved.<br/> Built by traders, for
              traders.
            </div>
          </div>
          <div className="right-side">
            <div className="item">
              <h3>Resources</h3>
              <ul className="category-list">
                <li>Forum</li>
                <li>News</li>
                <li>Courses</li>
                <li>FX Calculator</li>
                <li>Mentors Hub</li>
                <li>Chat & Discussion</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Downloads</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copy-right">
          <div className="copy">©Copyright 2025</div>
          <div className="links">
            <Link to={`${base}privacy-policy`}>Privacy Policy</Link>
            <Link to={`${base}terms-and-condition`}>Terms & Condition</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
