import { useState, useEffect } from 'react'
import './header.scss'
import { Link } from 'react-router-dom'
import { BellDotIcon } from 'lucide-react';


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
              <li><Link to={'#'}>Courses</Link></li>
              <li><Link to={'#'}>News</Link></li>
              <li><Link to={'#'}>Contact</Link></li>
              <li><Link to={'#'}>About Us</Link></li>

              <li>
                <div className='search-header'>
                  <input
                    placeholder="search"
                  />
                </div>
              </li>
            </ul>
            <div className='right-drawer'>
              <a href='#notification' className='notification'><BellDotIcon /></a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header