import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/sidebar';
import Footer from '../components/layout/footer';

const MainLayout = () =>
{
  return (
    <>
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
}
export default MainLayout;