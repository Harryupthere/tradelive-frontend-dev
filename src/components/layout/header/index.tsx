import { useState, useEffect } from 'react'
import './header.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const base = import.meta.env.VITE_BASE;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to check active route
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className={`header-wrapper ${isSticky ? "sticky" : ""}`}>
      <div className='container'>
        <div className='flex-container'>
          <Link to={`${base}`} className='brand'>
            <img src={`${base}TRADELIVE24-logo.png`} alt="TradeLive Logo" />
          </Link>

          <ul>
            <li><Link to={`${base}`} className={isActive(`${base}`)}>Home</Link></li>
            <li><Link to={`${base}courses`} className={isActive(`${base}courses`)}>Courses</Link></li>
            <li><Link to={`${base}news`} className={isActive(`${base}news`)}>News</Link></li>
            <li><Link to={`${base}forum`} className={isActive(`${base}forum`)}>Forum</Link></li>
            <li><Link to={`${base}forum-calculators`} className={isActive(`${base}forum-calculators`)}>FX Calculators</Link></li>
            <li><Link to={'#'}>Contact</Link></li>
            <li><Link to={`${base}about-us`} className={isActive(`${base}about-us`)}>About Us</Link></li>
          </ul>

          <div className='right-drawer'>
            <button type='button' className='gradient-btn' onClick={() => navigate(`${base}login`)}>Login</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
