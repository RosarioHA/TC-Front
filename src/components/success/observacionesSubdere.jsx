import { useNavigate } from 'react-router-dom';
import successIcon from '../../static/icons/success';
import SubirArchivo from '../forms/subir_archivo';

const SuccessOS = () => {
  const history = useNavigate();
  
  const handleBackButtonClick = () => {
    // aqui redirigir a donde corresponda, "Observaciones"??
    history('/home');
  };
  
  return (
    <div className="container view-container ms-5">
      
      <div className="success-container col-7 p-3 px-5 mt-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">Agregaste tus observaciones con éxito</h2>
            <p className="text-sans-p">El sector tendrá acceso a ver tus observaciones una vez que revises todos los formularios de la competencia y cierres la etapa.</p>
            <p className="text-sans-p mt-2">Vuelve a Observaciones para poder continuar con el proceso.</p>
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
          <p className="mb-0 text-decoration-underline">Volver a Observaciones</p>
        </button>
      </div>
    </div>   
  );
}
    
export default SuccessOS ;