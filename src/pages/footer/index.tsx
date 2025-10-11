import { Link } from "react-router-dom"
import './footer.scss'
import { Container } from "@mui/material"
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
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima tempore soluta cum aliquid laboriosam saepe et porro hic vel debitis!
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="item">
                            <h3>Resources</h3>
                            <ul className="category-list">
                                <li>Courses</li>
                                <li>Forum</li>
                                <li>Quizes</li>
                                <li>Live Classes</li>
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
                        <Link to="">Privacy Policy</Link>
                        <Link to="">Terms & Condition</Link>
                    </div>
                </div>
            </Container>
        </footer>
    )
}
export default Footer