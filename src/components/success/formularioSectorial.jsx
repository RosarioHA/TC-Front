import { useNavigate } from 'react-router-dom';
import successIcon from '../../static/icons/success';
import SubirArchivo from '../forms/subir_archivo';

const SuccessSectorial = () => {
  const history = useNavigate();
  
  const handleBackButtonClick = () => {
    history('/home');
  };
  
  return (
    <div className="container ps-5 ms-5">
      
      <div className="success-container col-7 p-3 px-5 mt-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">Enviaste el formulario con éxito</h2>
            <p className="text-sans-p">Ahora deberás esperar a que SUBDERE realice las observaciones respecto a la información del formulario.</p>
            <p className="text-sans-p mt-2">En caso de que SUBDERE defina que necesita información adicional, te notificará y podrás hacer las modificaciones solicitadas..</p>
          </div>
        </div>  
      </div>

      <div className="margin-container col-7 mt-4">
        <p className="text-sans-p">Puedes descargar el formulario que ingresaste:</p>
        <div>
          <SubirArchivo 
          readOnly={true}
          tituloDocumento="$NombreCompetencia_Form_Sectorial_$SECTOR.pdf"/>
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
    
export default SuccessSectorial ;