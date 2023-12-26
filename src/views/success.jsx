import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import successIcon from '../static/icons/success.svg';

const SuccessViews = () => {
  const history = useNavigate();
  const location = useLocation();
  const origen = location.state?.origen;

  const handleBackButtonClick = () => {
    history('/home');
  };
  
  let titulo = "";
  let subtitulo = "";
  let bajada = "";
  let tituloRecuadro = "";
  let contenidoP1 = "";
  let contenidoP2 = "";
  if (origen === "crear_usuario") {
    titulo = "Administrar Usuarios";
    subtitulo = "Crear Usuario";
    tituloRecuadro = "Creaste un usuario con éxito";
  } else if (origen === "crear_competencia") {
    titulo = "Administrar Competencias";
    subtitulo = "Crear Competencia";
    tituloRecuadro = "Creaste una competencia con éxito";
  } else if (origen === "editar_usuario") {
    titulo = "Administrar Usuario";
    subtitulo = "Editar Usuario";
    tituloRecuadro = "Editaste un usuario con éxito";
  } else if (origen === "formulario_sectorial") {
    titulo = "Formulario Sectorial";
    subtitulo = "$NombreCompetencia";
    bajada = "$NombreCompetencia"
    tituloRecuadro = "Enviaste el formulario con éxito";
    contenidoP1="Ahora deberás esperar a que SUBDERE realice las observaciones respecto a la información del formulario.      "
    contenidoP2="En caso de que SUBDERE defina que necesita información adicional, te notificará y podrás hacer las modificaciones solicitadas.."
  }else {
    titulo = "Exito!";
    subtitulo = "Plataforma Transferencia de Competencias";
    tituloRecuadro = "Esta es la vista de success";
  }

  console.log("origen desde vista success", origen)
  
  return (
    <div className="container view-container ms-5">
      {/* Titulo deberia ser condicional, segun de donde venga el usuario */}
      <h2 className="text-sans-h2 mt-3">{titulo}</h2>
      <h3 className="text-sans-h3 mt-3 mb-5">{subtitulo}</h3>
      <p className="text-sans-h2-grey">{bajada}</p>
  
      <div className="success-container col-7 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">{tituloRecuadro}</h2>
            <p className="text-sans-p">{contenidoP1}</p>
            <p className="text-sans-p">{contenidoP2}</p>
          </div>
        </div>  
      </div>

      <div className="col-10 d-flex justify-content-center mt-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">home</i>
          <p className="mb-0 text-decoration-underline">Volver al inicio</p>
        </button>
      </div>
    </div>   
  );
}
    
export default SuccessViews ;