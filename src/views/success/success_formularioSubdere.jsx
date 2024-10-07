import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import successIcon from '../../static/icons/success.svg';
import { FormSubdereContext } from "../../context/RevisionFinalSubdere";

const SuccessFormSubdere = () =>
{
  const { dataFormSubdere, updateFormId, loading } = useContext(FormSubdereContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() =>
  {
    if (id)
    {
      updateFormId(id);
    }
  }, [ id, updateFormId ]);

  const handleVolverBtn = () =>
  {
    return (
      navigate(`/home/estado_seguimiento/${id}`)
    )
  };

  if (loading)
  {
    return <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando...</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>;
  }
  if (!dataFormSubdere)
  {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="container col-11 ps-5 ms-5">
      <h1 className="text-sans-Title mt-5 ms-3">Revision final SUBDERE Post CID</h1>
      <h1 className="text-sans-h1 ms-3">{dataFormSubdere.competencia_nombre}</h1>
      <h2 className="text-sans-h2-grey pb-5 ms-3">{dataFormSubdere.sector_nombre}</h2>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="success-container ms-0 col-8 p-3 px-5 mt-5 ">
          <div className="row align-items-center">
            <div className="col-2">
              <img src={successIcon} alt="Éxito" />
            </div>
            <div className="col-9">
              <h2 className="text-sans-h2 mb-4">Terminaste el proceso con éxito</h2>
              <p className="text-sans-p">Todos los formularios estarán disponibles por separado en el expediente de la competencia.</p>
            </div>
          </div>
        </div>
        <div className=" ms-0 col-8 p-3  mt-5 text-sans-p">Recuerda notificar al usuario de seguimiento para que continue con el siguiente paso.</div>
      </div>

      <div className="d-flex justify-content-center my-5">
        <button className="btn-secundario-s" onClick={handleVolverBtn}>
          <p className="text-decoration-underline mb-0"><u>Ir al expediente</u></p>
        </button>
      </div>
    </div>
  )
};

export default SuccessFormSubdere;