import { ArrowUpRightSquareIcon, BookPlus, Calculator, FolderEdit, Home, LogOut, Newspaper, Notebook, School, Users2Icon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { removeToken, removeUser } from '../../utils/tokenUtils';

const base = import.meta.env.VITE_BASE;

const mainMenuItems = [
  { path: `${base}profile`, icon: Home, label: 'Profile', exact: true },
  { path: `${base}courses`, icon: Notebook, label: 'Courses', exact: true },
  { path: `${base}news`, icon: Newspaper, label: 'News', exact: true },
  { path: `${base}forum-calculators`, icon: Calculator, label: 'FX Calculators', exact: true },
  { path: `${base}instructors`, icon: School, label: 'Mentor Hub', exact: true },
  { path: `#/`, icon: FolderEdit, label: 'Market Feed', exact: true },
  { path: `#/`, icon: Users2Icon, label: 'Community/Discissions', exact: true },
  { path: `#/`, icon: ArrowUpRightSquareIcon, label: 'Trade Journal', exact: true },
  { path: `#/`, icon: BookPlus, label: 'Resources', exact: true },

];
function DashboardSidebar({ sidebarOpen, closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate()

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
    <div className={`dashboard-sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>


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
                  className={`menu-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <item.icon className="menu-icon" />
                  <span className="menu-label">{item.label}</span>
                </Link>
              )
            )}
            <button type='button' onClick={handleLogout} className='menu-item'  style={{backgroundColor:'transparent', border:'none'}}>
              <LogOut/>
              <span className="menu-label">Logout</span>
            </button>
          </nav>
        </div>

      </div>
    </div>
  )
}

export default DashboardSidebar