import { Link } from 'react-router-dom';


const NavbarLogin = () =>{  

  return (
  <>
    <nav className="container-fluid">
      <div className="row">
        <div className="col">
          {/* Logo subdere */}
          <Link to="/" className="text-decoration-none " >
            <div className="line-container row">
              <div id="lineBlue" />
              <div id="lineRed" />
            </div>
            <p className="text-sans-m-bold mt-2 ">Subsecretaría de Desarrollo <br/> Administrativo y Regional</p>  
          </Link>
        </div>
      </div>
    </nav>  
  </>
);
};

export default NavbarLogin;