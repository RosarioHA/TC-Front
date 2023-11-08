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
    <div className="row my-4 col-12">
      {/* Navegacion */}
      <div className="mx-5  mx-lg-auto mx-xl-auto d-flex flex-column flex-md-row justify-content-start px-5">
        <Link to="/" className="link text-black text-underline mx-md-3 d-none d-md-block"> Inicio </Link>
      </div>
    </div> 
  </>
);
};

export default NavbarLogin;