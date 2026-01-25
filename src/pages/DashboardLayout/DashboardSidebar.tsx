import {
  ArrowUpRightSquareIcon,
  BookPlus,
  Calculator,
  FolderEdit,
  Home,
  LogOut,
  Newspaper,
  Notebook,
  School,
  Users2Icon,
  UserCheck,
  TicketPlus,
  LogIn,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeToken, removeUser } from "../../utils/tokenUtils";
const base = import.meta.env.VITE_BASE;

const mainMenuItems = [
  {
    path: `${base}dashboard`,
    icon: UserCheck,
    label: "Dashboard",
    exact: true,
  },

  // { path: `${base}courses`, icon: Notebook, label: "Courses", exact: true },
  // { path: `${base}news`, icon: Newspaper, label: "News", exact: true },
  // {
  //   path: `${base}forax-calculators`,
  //   icon: Calculator,
  //   label: "FX Calculators",
  //   exact: true,
  // },
  // {
  //   path: `${base}instructors`,
  //   icon: School,
  //   label: "Mentor Hub",
  //   exact: true,
  // },
  // {
  //   path: `${base}chat-discussions`,
  //   icon: Users2Icon,
  //   label: "Chat Discussion",
  //   exact: true,
  // },
  // {
  //   path: `${base}trade-journal`,
  //   icon: ArrowUpRightSquareIcon,
  //   label: "Trade Journal",
  //   exact: true,
  // },
  { path: `${base}resources`, icon: BookPlus, label: "Resources", exact: true },
  // {
  //   path: `${base}activation-coupons`,
  //   icon: TicketPlus,
  //   label: "Activation Coupons",
  //   exact: true,
  // },

  // { path: `${base}profile`, icon: Home, label: "Profile", exact: true },
  // {
  //   path: `${base}login-sessions`,
  //   icon: LogIn,
  //   label: "Login Sessions",
  //   exact: true,
  // },

  //   { path: `#/`, icon: FolderEdit, label: "Market Feed", exact: true },
];

import { useState } from "react";

function DashboardSidebar({ sidebarOpen, closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tradeliveDropdownOpen, setTradeliveDropdownOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate(`${base}login`);
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Close dropdown on navigation
  const handleDropdownLinkClick = () => {
    setTradeliveDropdownOpen(false);
    closeSidebar && closeSidebar();
  };

  return (
    <div className={`dashboard-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
      <div className="sidebar-content">
        <div className="menu-section">
          <nav className="menu-nav">
            {mainMenuItems.map((item) =>
              item.newTab ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-item"
                  onClick={closeSidebar}
                >
                  <item.icon className="menu-icon" />
                  <span className="menu-label">{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item ${
                    isActive(item.path, item.exact) ? "active" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon className="menu-icon" />
                  <span className="menu-label">{item.label}</span>
                </Link>
              )
            )}
            {/* Tradelive24 Section Dropdown */}
            {/* <div
              className={`menu-item tradelive24-dropdown${
                tradeliveDropdownOpen ? " open" : ""
              }`}
            >
              <div
                className="tradelive24-dropdown__toggle"
                onClick={() => setTradeliveDropdownOpen((v) => !v)}
                tabIndex={0}
                style={{ userSelect: "none", cursor: "pointer" }}
              >
                <img
                  src={`${base}tradelive24-logo-bar.png`}
                  alt="Tradelive24"
                  className="tradelive24-logo-bar"
                />
                <span className="menu-label">Tradelive24 Sections</span>
                <span
                  className="tradelive24-dropdown__arrow"
                  style={{
                    transform: tradeliveDropdownOpen
                      ? "rotate(180deg)"
                      : undefined,
                  }}
                >
                  ▼
                </span>
              </div>
              <div className="tradelive24-dropdown__menu">
                <Link
                  to={`${base}platform-tutorial`}
                  className="tradelive24-dropdown__item"
                  onClick={handleDropdownLinkClick}
                >
                  Platform Tutorial
                </Link>
                <Link
                  to={`${base}brokerage-tutorial`}
                  className="tradelive24-dropdown__item"
                  onClick={handleDropdownLinkClick}
                >
                  Brokerage Tutorial
                </Link>
                <Link
                  to={`${base}deposit-withdrawal`}
                  className="tradelive24-dropdown__item"
                  onClick={handleDropdownLinkClick}
                >
                  Deposit and Withdrawal
                </Link>
                <Link
                  to={`${base}navigate-tradelive`}
                  className="tradelive24-dropdown__item"
                  onClick={handleDropdownLinkClick}
                >
                  How to Navigate TradeLive
                </Link>
                <Link
                  to={`${base}faq`}
                  className="tradelive24-dropdown__item"
                  onClick={handleDropdownLinkClick}
                >
                  FAQ
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="menu-item"
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={()=>navigate(`${base}checkout?whatsappTrade=true`)}
            >
                <img
                  src={`${base}whatsapp-logo.png`}
                  alt="Tradelive24"
                  className="logo-images"
                />
                <span className="menu-label">Whatsapp Trade</span>
             
            </button> */}
            <button
              type="button"
              onClick={handleLogout}
              className="menu-item"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <LogOut />
              <span className="menu-label">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
