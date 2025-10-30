import { useState, useEffect } from "react";
import "./header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, getUser, removeToken, removeUser } from "../../../utils/tokenUtils";
import Translator from "./Translator";

const base = import.meta.env.VITE_BASE;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { 
    // initialise user from localStorage
    setUser(getUser());
    // reflect changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === getTokenKey() || e.key === null) {
        setUser(getUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Helper to check active route
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  // const handleLogout = () => {
  //   removeToken();
  //   removeUser();
  //   setUser(null);
  //   navigate(`${base}login`);
  // };

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
    <header className={`header-wrapper ${isSticky ? "sticky" : ""}`}>
      <div className="container">
        <div className="flex-container">
          <Link to={`${base}`} className="brand">
            <img src={`${base}TRADELIVE24-logo.png`} alt="TradeLive Logo" />
          </Link>

          <ul>
            <li>
              <Link to={`${base}`} className={isActive(`${base}`)}>
                Home
              </Link>
            </li>
                 <li>
              <Link to={`${base}forum`} className={isActive(`${base}forum`)}>
                Forum
              </Link>
            </li>
            <li>
              <Link to={`${base}contactus`} className={isActive(`${base}contactus`)}>Contact</Link>
            </li>
            <li>
              <Link to={`${base}about-us`} className={isActive(`${base}about-us`)}>
                About Us
              </Link>
            </li>
          </ul>


          <div className="right-drawer">
            <Translator />
            {renderUserArea()}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
