import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import successIcon from '../../static/icons/success.svg';

const SuccessCierreOS = () => {
  const { data, updateFormId, loading } = useContext(FormularioContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { competenciaDetails } = useCompetencia(id);

  useEffect(() => {
    if (id) {
      updateFormId(id);
    }
  }, [id, updateFormId]);

  const handleVolverBtn = () => {
    return (
      navigate( `/home/observaciones_subdere/${id}/`)
    )
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!data) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="container col-11">
      <h1 className="text-sans-Title mt-5 ms-3">Observaciones SUBDERE</h1>
      <h1 className="text-sans-h1 ms-3">Formularios sectoriales</h1>
      <h2 className="text-sans-h2-grey pb-5 ms-3">{competenciaDetails?.nombre}</h2>

      <div className="d-flex justify-content-center">
        <div className="success-container ms-0 col-8 p-3 px-5 mt-5">
          <div className="row align-items-center">
            <div className="col-2">
              <img src={successIcon} alt="Éxito"/>
            </div>
            <div className="col-9">
              <h2 className="text-sans-h2 mb-4">Cerraste la Revisión SUBDERE con éxito</h2>
              <p className="text-sans-p">Dependiendo de la decisión que hayas tomado sobre la siguiente etapa, el usuario correspondiente será notificado para comenzar con la etapa que le corresponda.</p>
            </div>
          </div>  
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button className="btn-secundario-s text-decoration-underline" onClick={handleVolverBtn}>Volver a Observaciones</button>
      </div>

    </div>
  )
};

export default SuccessCierreOS;