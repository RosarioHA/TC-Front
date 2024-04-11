import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormGOREContext } from "../../context/FormGore";
import successIcon from '../../static/icons/success.svg';

const SuccessOS_Gore = () => {
  const { dataFormGore, updateFormId, loading } = useContext(FormGOREContext);
  const { id } = useParams();
  const navigate = useNavigate();



  useEffect(() => {
    if (id) {
      updateFormId(id);
    }
  }, [id, updateFormId]);

  const handleVolverBtn = () => {
    return (
      navigate( `/home/formulario_gore/${dataFormGore.competencia_id}/observaciones_subdere`)
    )
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!dataFormGore) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="container col-11">
      <h1 className="text-sans-Title mt-5 ms-3">Observaciones SUBDERE</h1>
      <h1 className="text-sans-h1 ms-3">Formularios GORE y DIPRES</h1>
      <h2 className="text-sans-h2-grey pb-5 ms-3">{dataFormGore.competencia_nombre}</h2>

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
        <button className="btn-secundario-s text-decoration-underline" onClick={handleVolverBtn}>Volver al expediente de la Competencia</button>
      </div>

    </div>
  )
};

export default SuccessOS_Gore;