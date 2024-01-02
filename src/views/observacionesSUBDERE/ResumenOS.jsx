import { useNavigate } from 'react-router-dom';
import Observacion from '../../components/obsSUBDERE/resumen/observacion';

const ResumenOS = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  return (
    <>
      <div className="container-fluid">
        <div className="text-center">
          <h1 className="text-sans-h1">Resumen observaciones </h1>
          <hr/>
        </div>

        <div className="mb-5 px-5 me-5">
          <div className="my-4">
            <Observacion 
            index="1"
            titulo="Descripción de la Institución"
            value="hola"/>
          </div>
          <div className="my-4">
            <Observacion 
            index="2"
            titulo="Arquitectura del Proceso"/>
          </div>
          <div className="my-4">
            <Observacion 
            index="3"
            titulo="Cobertura de la Competencia"/>
          </div>
          <div className="my-4">
            <Observacion 
            index="4"
            titulo="Indicadores de Desempeño"/>
          </div>
          <div className="my-4">
            <Observacion 
            index="5"
            titulo="Costeo de la Competencia"/>
          </div>
        </div>

        <div className="mb-5 px-5 me-5">
          <h2 className="text-sans-h2 ms-5">Esta todo listo para que envies las observaciones</h2>
          <h6 className="text-sans-h6 ms-5">Asegurate que las observaciones que ingresaste son suficientes, ya que una vez que las envíes, no podrás editarlas.</h6>
        </div>

        {/*Botones navegacion  */}
        <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">
          <button className="btn-secundario-s" onClick={handleBackButtonClick} >
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            Atrás
          </button>
          <button className="btn-primario-s">
            Enviar Observaciones
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
      </div >
    </>
  )
}
export default ResumenOS; 