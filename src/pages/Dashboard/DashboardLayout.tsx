import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './DashboardLayout.scss';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-page">
      <div className='dashboard-container'>
        <div className="dashboard-layout">
          <DashboardSidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
          {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
          <div className="dashboard-main">
            <div className="dashboard-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
    </div>
  );
};

export default DashboardLayout;