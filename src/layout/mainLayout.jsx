import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () =>
{
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="col-10 px-0">
            <Navbar />
            {/* <CompetenciaProvider> */}
              <Outlet /> 
            {/* </CompetenciaProvider> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;