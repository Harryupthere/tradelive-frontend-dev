import { useState, useEffect } from 'react'
import './header.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { getToken, getTokenKey, getUser } from '../../../utils/tokenUtils';
import Translator from './Translator';
const base = import.meta.env.VITE_BASE;


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };
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
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    setUser(getUser());
    const onStorage = (e: StorageEvent) => {
      if (e.key === getTokenKey() || e.key === null) {
        setUser(getUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const renderUserArea = () => {
    if (!getToken() || !user) {
      return (
        <button type="button" className="gradient-btn" onClick={() => navigate(`${base}login`)}>
          Login
        </button>
      );
    }

    const avatarSrc = user.profile || "";
    const userTypeImage = user?.userType?.image || "";
    const userTypeName = user?.userType?.name || "";

    return (
      <div className="right-drawer user-area">
        <button
          type="button"
          className="user-btn"
          onClick={() => navigate(`${base}profile`)}
          title={`${user.first_name || ""} ${user.last_name || ""}`}
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="profile" className="user-avatar" />
          ) : (
            <div className="user-avatar user-initials">
              {(user.first_name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="user-name">{user.first_name || user.email || "User"}</span>
        </button>

        {userTypeImage ? (
          <div className="user-type-badge" title={userTypeName}>
            <img src={userTypeImage} alt={userTypeName || "type"} />
          </div>
        ) : userTypeName ? (
          <div className="user-type-badge" title={userTypeName}>
            <span className="user-type-text">{userTypeName}</span>
          </div>
        ) : null}

        {/* <button type="button" className="gradient-btn" onClick={handleLogout} aria-label="Logout">
          Logout
        </button> */}
      </div>
    );
  };

  return (
    <>
      <header className={`header-wrapper ${isSticky ? "sticky" : ""}`}>
        <div className='container'>
          <div className='flex-container'>
            <Link to={'/'} className='brand' onClick={closeMobileMenu}>
              <img src={`${base}TRADELIVE24-logo.png`} alt="TradeLive Logo" />
            </Link>

            {/* Desktop Navigation */}
            <ul className='desktop-nav'>
              <li><Link to={`${base}`} className={isActive(`${base}`)}>Home</Link></li>
              <li><Link to={`${base}courses`} className={isActive(`${base}courses`)}>Courses</Link></li>
              <li><Link to={`${base}news`} className={isActive(`${base}news`)}>News</Link></li>
              <li><Link to={`${base}contactus`} className={isActive(`${base}contactus`)}>Contact</Link></li>
              <li><Link to={`${base}about-us`} className={isActive(`${base}about-us`)}>About Us</Link></li>
            </ul>
            <div className='desktop-nav right-drawer'>
              <Translator />
              {renderUserArea()}
            </div>
            <div className='right-drawer'>
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
            <li><Link to={`${base}contactus`} onClick={closeMobileMenu}>Contact</Link></li>
            <li><Link to={`${base}about-us`} onClick={closeMobileMenu}>About Us</Link></li>
          </ul>
            {/* <Translator /> */}
          {renderUserArea()}
        </nav>
      </div>
    </>
  )
}

export default Header