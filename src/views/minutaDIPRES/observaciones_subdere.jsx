import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import CustomTextarea from "../../components/forms/custom_textarea";

const ObservacionesSubdereDipres = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);

  console.log("competenciaDetails en OS Minuta Dipres", competenciaDetails);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return(
    <div className="container col-11">
      <div className="py-3 d-flex">
        <div className="align-self-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
        </div>
        <nav className="container mx-5" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${id}`}>Estado de la Competencia: {competenciaDetails?.nombre} </Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
          </ol>
        </nav>
      </div>

      <div className="border-bottom pb-3">
        <h1 className="text-sans-Title mt-5">Observaciones SUBDERE</h1>
        <h2 className="text-sans-h1 mt-4">Formularios GORE y Minuta DIPRES</h2>
        <h2 className="text-sans-h2">{competenciaDetails.nombre}</h2>
      </div>

      <div className="mt-5 border-bottom pb-3">
        <SubirArchivo
          readOnly={true}
          archivoDescargaUrl={competenciaDetails?.etapa3?.archivo_minuta_etapa3}
          tituloDocumento="Minuta DIPRES"
        />
      </div>

      <div className="mt-5">
        <CustomTextarea 
          label="Observaciones (Opcional)"
          placeholder="Escribe tus observaciones de este paso del formulario"
          rows={6}
          maxLength={500}
          // value={observacionPaso1}
          // onChange={(e) => setObservacionPaso1(e.target.value)}
          // readOnly={observacionesEnviadas}
          // onBlur={handleGuardarObservacion}
          // loading={loadingObservaciones}
        />
      </div>

      <div className="d-flex justify-content-end my-5">
        <button className="btn-primario-s" disabled={false}>
          <p className="mb-0 text-decoration-underline">Cerrar etapa</p>
          <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
        </button>
      </div>
    </div>
  )
};

export default ObservacionesSubdereDipres;