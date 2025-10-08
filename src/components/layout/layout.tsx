import { Outlet } from 'react-router-dom';
import Header from './header/index';
import Footer from '../../pages/footer';

const Layout = () => {
  return (
    <>
      <div className='layout-wrapper'>
        <Header />
        <div className='content-outlet'>
          <Outlet />
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Layout;