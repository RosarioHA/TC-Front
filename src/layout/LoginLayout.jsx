import { Outlet } from 'react-router-dom';
import NavbarLogin from '../components/login/NavbarLogin'; 
import Footer from '../components/login/Footer';

const LoginLayout = () =>
{
  return (
    <>
      <NavbarLogin />
      <Outlet />
      <Footer />
    </>
  );
}

export default LoginLayout;