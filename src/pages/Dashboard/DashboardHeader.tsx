import { NotificationAddOutlined } from '@mui/icons-material'
import { MenuIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <div className="dashboard-header">
      <div className='container header-content'>
        <div className="header-left">
          <MenuIcon color='#fff' onClick={onMenuClick} style={{ cursor: 'pointer' }} />
          <Link to="/" className="logo">
            <h2 className="logo-text animate-gradient ">ARC</h2>
          </Link>
        </div>
        <div className="header-right">
          <span className="user-name">Kunika</span>
          <div className="user-avatar">KK</div>
          <div className="notification-badge">
            <NotificationAddOutlined sx={{ color: '#fff' }}/>
            <span className="badge-count">1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader