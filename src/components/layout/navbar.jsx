const Navbar = () =>
{
  return (
    <nav className="d-flex  bg-white border-bottom justify-content-end me-5 w-100 sticky-top mt-1 py-1">
      <div className="align-self-center mx-2 text-sans-h5">
        <span>Hola, $userName</span>
        </div>
        <button className="btn-logout mx-2 my-2" type="button" onClick=''><u>Cerrar Sesión</u><i className="material-symbols-outlined">
          logout
        </i></button> 
    </nav>
  );
};

export default Navbar;