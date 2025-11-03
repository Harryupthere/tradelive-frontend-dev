import { useState, useEffect } from 'react'
import './header.scss'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
const base = import.meta.env.VITE_BASE;


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);



  return (
    <>
      <header className={`header-wrapper ${isSticky ? "sticky" : ""}`}>
        <div className='container'>
          <div className='flex-container'>
            <Link to={'/'} className='brand' onClick={closeMobileMenu}>
              TradeLive
            </Link>

            {/* Desktop Navigation */}
            <ul className='desktop-nav'>
              <li><Link to={`${base}`}>Home</Link></li>
              <li><Link to={`${base}courses`}>Courses</Link></li>
              <li><Link to={`${base}news`}>News</Link></li>
              <li><Link to={'#'}>Contact</Link></li>
              <li><Link to={'#'}>About Us</Link></li>
            </ul>

            <div className='right-drawer'>
              <button type='button' className='gradient-btn desktop-login'>Login</button>

              {/* Mobile Menu Toggle */}
              <button
                type='button'
                className='mobile-menu-toggle'
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}>
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <ul>
            <li><Link to={`${base}`} onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to={`${base}courses`} onClick={closeMobileMenu}>Courses</Link></li>
            <li><Link to={`${base}news`} onClick={closeMobileMenu}>News</Link></li>
            <li><Link to={'#'} onClick={closeMobileMenu}>Contact</Link></li>
            <li><Link to={'#'} onClick={closeMobileMenu}>About Us</Link></li>
          </ul>
          <button type='button' className='gradient-btn mobile-login' onClick={closeMobileMenu}>Login</button>
        </nav>
      </div>
    </>
  )
}

export default Header