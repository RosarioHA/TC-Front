const Landing = () => {
  return (
    <div>
      <div>
        <p>LANDING: DASHBOARD RESUMEN</p>
        <div className="d-flex flex-column col-6">
          <button className="btn-primario-s mb-2">Primario S</button>
          <button className="btn-primario-l mb-2">Primario L</button>
          <button className="btn-secundario-s mb-2">Secundario S</button>
          <button className="btn-secundario-l mb-2">Secundario L</button>
          <button className="btn-terciario mb-2">Terciario</button>
          <button className="btn-danger mb-2">Danger</button>
        </div>
      </div>
    </div>
    );
};

export default Landing;