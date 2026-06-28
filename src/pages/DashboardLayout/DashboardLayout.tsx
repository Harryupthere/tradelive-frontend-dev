import {useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import './DashboardLayout.scss';
import DashboardSidebar from './DashboardSidebar';
import { MenuIcon } from 'lucide-react';
import TermsAcceptanceModal from "../../components/common/TncPopup";
import { createPortal } from "react-dom";
import { getUser } from "../../utils/tokenUtils";
import { useSelector } from 'react-redux';
const base = import.meta.env.VITE_BASE;

const DashboardLayout = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
const user = useSelector(
  (state: RootState) => state.auth.user
);

// useEffect(() => {
//   const user = getUser();

//   if (user && user.tnc_accepted == 0) {
//     setShowTermsModal(true);
//   }
// }, []);
useEffect(() => {
  if (user?.tnc_accepted == 0) {
    setShowTermsModal(true);
  } else {
    setShowTermsModal(false);
  }
}, [user?.tnc_accepted]);


  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (<>
   {showTermsModal &&
      createPortal(
        <TermsAcceptanceModal
          isOpen={showTermsModal}
          onClose={() => setSidebarOpen(false)}
          termsPath={`${base}terms-and-condition`}
          redirectPath={`${base}dashboard`}
          sourcePath="dashboard"
        />,
        document.body
      )}
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
    </>
  );
};

export default DashboardLayout;