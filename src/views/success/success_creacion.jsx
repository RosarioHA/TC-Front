import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import successIcon from '../../static/icons/success.svg';

const SuccessCreacion = () => {
  const history = useNavigate();
  const location = useLocation();
  const origen = location.state?.origen;
  const id = location.state?.id;
  console.log("id de usuario en vista success creacion", id)

  const handleButtonClick = () => {
    // Verifica que id tenga un valor antes de intentar acceder a sus propiedades
    if (id) {
      // Realizar la navegación condicional según la procedencia del usuario
      switch (origen) {
        case "crear_usuario":
          history(`/home/editar_usuario/${id}`);
          break;
        case "crear_competencia":
          history(`/home/editar_competencia/${id}`);
          break;
        default:
          history('/home');
      }
    } else {
      console.error("El ID del usuario es nulo o indefinido.");
      // Puedes manejar este caso según tus necesidades, por ejemplo, redirigir a una página de error.
    }
  };
  
  let titulo = "";
  let subtitulo = "";
  let tituloRecuadro = "";
  let nombreBoton = "";
  if (origen === "crear_usuario") {
    titulo = "Administrar Usuarios";
    subtitulo = "Crear Usuario";
    tituloRecuadro = "Creaste un usuario con éxito";
    nombreBoton = "Volver a Administrar Usuarios";
  } else if (origen === "crear_competencia") {
    titulo = "Administrar Competencias";
    subtitulo = "Crear Competencia";
    tituloRecuadro = "Creaste una competencia con éxito";
    nombreBoton = "Volver a Listado de Competencias";
  } else {
    titulo = "Exito!";
    subtitulo = "Plataforma Transferencia de Competencias";
    tituloRecuadro = "Esta es la vista de success";
  }

  return (
    <div className="container view-container ms-5">
      <h2 className="text-sans-h2 mt-3">CREACION COMPETENCIA{titulo}</h2>
      <h3 className="text-sans-h3 mt-3 mb-5">{subtitulo}</h3>
  
      <div className="success-container col-7 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} alt="Éxito"/>
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">{tituloRecuadro}</h2>
            <p className="text-sans-p">Descripción detallada del éxito de la operación realizada.</p>
          </div>
        </div>  
      </div>

      <div className="col-10 d-flex justify-content-center mt-5">
        <button className="btn-secundario-s" onClick={handleButtonClick}>
          <p className="mb-0 text-decoration-underline">{nombreBoton}</p>
        </button>
      </div>
    </div>   
  );
}
    
export default SuccessCreacion ;
