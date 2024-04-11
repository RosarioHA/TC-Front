import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormGOREContext } from "../../context/FormGore";
import successIcon from '../../static/icons/success.svg';

const SuccessFormGore = () => {
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
      navigate( `/home/`)
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
      <h1 className="text-sans-Title mt-5 ms-3">Formulario Gobierno Regional</h1>
      <h1 className="text-sans-h1 ms-3">{dataFormGore.competencia_nombre}</h1>
      <h2 className="text-sans-h2-grey pb-5 ms-3">{dataFormGore.region_nombre}</h2>

      <div className="d-flex justify-content-center">
        <div className="success-container ms-0 col-8 p-3 px-5 mt-5">
          <div className="row align-items-center">
            <div className="col-2">
              <img src={successIcon} alt="Éxito"/>
            </div>
            <div className="col-9">
              <h2 className="text-sans-h2 mb-4">Enviaste el formulario con éxito</h2>
              <p className="text-sans-p">Ahora deberás esperar a que SUBDERE realice las observaciones respecto a la información del formulario.</p>
              <p className="text-sans-p">En caso de que SUBDERE defina que necesita información adicional, te notificará y podrás hacer las modificaciones solicitadas..</p>
            </div>
          </div>  
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button className="btn-secundario-s" onClick={handleVolverBtn}>
          <i className="material-symbols-rounded me-2">home</i>
          <p className="text-decoration-underline mb-0">Volver al Incio</p>
        </button>
      </div>
    </div>
  )
};

export default SuccessFormGore;