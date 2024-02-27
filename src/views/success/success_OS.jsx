import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';
import successIcon from '../../static/icons/success.svg';

const SuccessOS = () => {
  const { data, updateFormId, loading } = useContext(FormularioContext);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("data", data)

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
      <h1 className="text-sans-Title mt-5 ms-3">Formulario Sectorial</h1>
      <h1 className="text-sans-h1 ms-3">{data.competencia_nombre}</h1>
      <h2 className="text-sans-h2-grey pb-5 ms-3">{data.sector_nombre}</h2>

      <div className="d-flex justify-content-center">
        <div className="success-container ms-0 col-8 p-3 px-5 mt-5">
          <div className="row align-items-center">
            <div className="col-3">
              <img src={successIcon} alt="Éxito"/>
            </div>
            <div className="col-9">
              <h2 className="text-sans-h2 mb-4">Agregaste tus observaciones con éxito</h2>
              <p className="text-sans-p">El sector tendrá acceso a ver tus observaciones una vez que revises todos los formularios de la competencia y cierres la etapa.</p>
              <p className="text-sans-p mt-4">Vuelve a Observaciones para poder continuar con el proceso.</p>
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

export default SuccessOS;