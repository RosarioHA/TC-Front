import NavbarLogin from "../components/login/NavbarLogin";
import Footer from "../components/login/Footer";

const Landing = () =>
{
  return (
    <>
      <NavbarLogin />
      <div className="container-fluid">
        <div className="container d-flex flex-column my-5">
          <p className="text-serif-h1 text-center">Plataforma de Gestión de <br /> Transferencia de Competencias</p>
          <div className="container line">
            <div className="blue" />
            <div className="red" />
          </div>
        </div>
        <div className="container d-flex flex-column my-5">
          <div className="text-center text-sans-h3 my-2">Ingresa con tu ClaveÚnica</div>
          <div className="d-flex justify-content-center my-2"><button className="btn-primario-s">Inicio Sesion</button></div>
          <div className="text-center text-sans-p my-2 mx-5 px-5">Profundizemos la descentralización entregando más poder, competencias y capacidades a las regiones,<br/> para que sean éstas quienes lideren los procesos que les son propios, sumando talentos, proyectos,<br/> instituciones y recursos.</div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Landing;