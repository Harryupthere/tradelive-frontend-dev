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

  { path: `${base}profile`, icon: Home, label: "Profile", exact: true },
  { path: `${base}courses`, icon: Notebook, label: "Courses", exact: true },
  { path: `${base}news`, icon: Newspaper, label: "News", exact: true },
  {
    path: `${base}forum-calculators`,
    icon: Calculator,
    label: "FX Calculators",
    exact: true,
  },
  {
    path: `${base}instructors`,
    icon: School,
    label: "Mentor Hub",
    exact: true,
  },
  {
    path: `${base}chat-discussions`,
    icon: Users2Icon,
    label: "Chat Discussion",
    exact: true,
  },
  {
    path: `${base}trade-journal`,
    icon: ArrowUpRightSquareIcon,
    label: "Trade Journal",
    exact: true,
  },
  { path: `#/`, icon: BookPlus, label: "Resources", exact: true },
  { path: `#/`, icon: FolderEdit, label: "Market Feed", exact: true },
];
function DashboardSidebar({ sidebarOpen, closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

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
