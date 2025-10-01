import { Outlet } from 'react-router-dom';
import Header from './header/index';

const Layout = () => {
  return (
    <>
      <div className='layout-wrapper'>
        <Header />
        <div className='content-outlet'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;