
const Home = () =>
{


  return (
    <div className="container ms-3 my-5">
      <div>
        <p>LANDING: DASHBOARD RESUMEN</p>
        <div className="d-flex flex-column col-8">
          <button className="btn-primario-s mb-2">Primario S</button>
          <button className="btn-primario-l mb-2">Primario L</button>
          <button className="btn-secundario-s mb-2">Secundario S</button>
          <button className="btn-secundario-l mb-2">Secundario L</button>
          <button className="btn-terciario mb-2">Terciario</button>
          <button className="btn-terciario-ghost">
            <p className="mb-0">Eliminar</p>
            <i className="material-symbols-rounded me-2">delete</i>
          </button>
          <button className="btn-danger my-2">Danger</button>

          <button className="btn-sidebar my-2">sidebar</button>

          <button className='btn-logout my-2'>logout</button>        
        </div>
      </div>
    </div>
  );
};

export default Home;