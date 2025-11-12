import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './DashboardLayout.scss';
import DashboardSidebar from './DashboardSidebar';
import { MenuIcon } from 'lucide-react';


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-page">
      <div className='container'>
        <div className="dashboard-layout">
           <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <MenuIcon color='#000'/>
      </button>
          <DashboardSidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
             {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
          <div className="dashboard-main">
            <div className="dashboard-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;