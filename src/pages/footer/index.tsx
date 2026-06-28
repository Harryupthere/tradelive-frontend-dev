import { Link } from "react-router-dom";
import "./footer.scss";
import { Container } from "@mui/material";
import image from "../../utils/helpers";
import { getUser } from "../../utils/tokenUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;

const Footer = () => {
  const navigate = useNavigate();
  const handlePageNavigation = (path: string, shouldNavigate: boolean) => {
    if (getUser() && getUser().userType && getUser().userType.id == 2) {
      navigate(`${base}${path}`);
    } else if (getUser() && getUser().userType && getUser().userType.id == 1) {
      if(shouldNavigate){
navigate(`${base}registration-plans`);
      }else{
        navigate(`${base}${path}`);
      }
      
    } else {
      navigate(`${base}login`);
    }
  };

  return (
    <footer>
      <Container maxWidth={false}>
        <div className="logo">
          <img
            src="https://d2vg0c60oys8dk.cloudfront.net/c5fb5e4d-07a0-43fb-90ce-744cd854b544-tradelive-logo.png"
            alt="logo"
          />
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
              ©️ 2025 TradeLive24. All rights reserved.
              <br /> Built by traders, for traders.
            </div>
          </div>
          <div className="right-side">
            <div className="item">
              <h3>Resources</h3>
              <ul className="category-list">
                {/* <li onClick={() => handlePageNavigation("/forum")}>Forum</li> */}
                <li onClick={() => handlePageNavigation("news",true)}>News</li>
                <li onClick={() => handlePageNavigation("courses",true)}>Courses</li>
                <li onClick={() => handlePageNavigation("forax-calculators",true)}>FX Calculator</li>
                <li onClick={() => handlePageNavigation("chat-discussions",true)}>Chat & Discussion</li>
                <li onClick={() => handlePageNavigation("about-us",false)}>About Us</li>
                <li onClick={() => handlePageNavigation("contactus",false)}>Contact Us</li>
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
