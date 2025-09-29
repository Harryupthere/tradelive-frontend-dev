import { useState, useEffect } from 'react'
import './header.scss'
import { Link } from 'react-router-dom'


const Header = () => {

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
            <Link to={'/'} className='brand'>
              TradeLive
            </Link>
            <ul>
              <li><Link to={'/home'}>Home</Link></li>
              <li><Link to={'/courses'}>Courses</Link></li>
              <li><Link to={'#'}>News</Link></li>
              <li><Link to={'#'}>Contact</Link></li>
              <li><Link to={'#'}>About Us</Link></li>
            </ul>
            <div className='right-drawer'>
              <button type='button' className='gradient-btn'>Login</button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header