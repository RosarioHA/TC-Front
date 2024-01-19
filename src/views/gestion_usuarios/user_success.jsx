import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import successIcon from '../../static/icons/success.svg';

const SuccessViews = () => {
  const history = useNavigate();
  const location = useLocation();
  const origen = location.state?.origen;

  const handleBackButtonClick = () => {
    history('/home/administrar_usuarios');
  };
  
  let titulo = "";
  let subtitulo = "";
  let tituloRecuadro = "";
  if (origen === "crear_usuario") {
    titulo = "Administrar Usuarios";
    subtitulo = "Crear Usuario";
    tituloRecuadro = "Creaste un usuario con éxito"
  }

  console.log("origen desde vista success", origen)
  
  return (
    <div className="container view-container ms-5">
      {/* Titulo deberia ser condicional, segun de donde venga el usuario */}
      <h2 className="text-sans-h2 mt-3">{titulo}</h2>
      <h3 className="text-sans-h3 mt-3 mb-5">{subtitulo}</h3>
  
      <div className="success-container col-7 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">{tituloRecuadro}</h2>
            <p className="text-sans-p">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.</p>
          </div>
        </div>  
      </div>

      <div className="col-10 d-flex justify-content-center mt-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">home</i>
          <p className="mb-0 text-decoration-underline">Volver a Administrar Usuarios</p>
        </button>
      </div>
    </div>   
  );
}
    
export default SuccessViews ;