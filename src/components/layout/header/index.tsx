import { useState, useEffect } from 'react'
import './header.scss'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const base = import.meta.env.VITE_BASE;


const Header = () => {

  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <>
      <header className={`header-wrapper ${isSticky ? "sticky" : ""}`}>
        <div className='container'>
          <div className='flex-container'>
            <Link to={`${base}`} className='brand'>
              <img src={`${base}logo1.png`} alt="TradeLive Logo" />
            </Link>
            <ul>
              <li><Link to={`${base}`}>Home</Link></li>
              <li><Link to={`${base}courses`}>Courses</Link></li>
              <li><Link to={`${base}news`}>News</Link></li>
              <li><Link to={'#'}>Contact</Link></li>
              <li><Link to={'#'}>About Us</Link></li>
            </ul>
            <div className='right-drawer'>
              <button type='button' className='gradient-btn' onClick={() => navigate(`${base}login`)}>Login</button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header