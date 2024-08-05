import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import CustomTextarea from "../../components/forms/custom_textarea";
import { SuccessOSminutaDIPRES } from "../../components/success/OSminutaDipres";
import { useEtapa } from "../../hooks/etapa/useEtapa";

const ObservacionesSubdereDipres = () => {
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const idEtapa = competenciaDetails?.etapa3?.id;
  const { etapa, updateEtapa } = useEtapa(idEtapa, 3);
  const [observacionMinutaDipres, setObservacionMinutaDipres] = useState("");
  const [observacionEnviada, setObservacionEnviada] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const navigate = useNavigate();
  const observacionesEnviadas = etapa?.observacion_minuta_sectorial_enviada;

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleGuardarObservacion = () => {
    setObservacionEnviada(true);
  };

  const handleCerrarEtapa = async () => {
    const data = {
      comentario_minuta_sectorial: observacionMinutaDipres,
      observacion_minuta_sectorial_enviada: true
    };

    try {
      await updateEtapa(3, data);
      setIsSubmitSuccessful(true);
    } catch (error) {
      console.error("Error closing stage:", error);
    }
  };

  return (
    <div className="container col-10 col-xxl-11">
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
        <h2 className="text-sans-h1 mt-4">Minuta DIPRES</h2>
        <h2 className="text-sans-h2">{competenciaDetails?.nombre}</h2>
      </div>

      {!isSubmitSuccessful ? (
      <>
        <div className="mt-5 border-bottom pb-3">
          <SubirArchivo
            readOnly={true}
            archivoDescargaUrl={etapa?.archivo_minuta_etapa3}
            tituloDocumento="Minuta DIPRES"
          />
        </div>

        <div className="mt-5">
          <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            rows={6}
            maxLength={500}
            value={etapa?.comentario_minuta_sectorial || ""}
            onChange={(e) => setObservacionMinutaDipres(e.target.value)}
            readOnly={observacionesEnviadas}
            onBlur={handleGuardarObservacion}
          />
        </div>

        { !observacionesEnviadas && (
        <div className="d-flex justify-content-end my-5">
          <button className="btn-primario-s" onClick={handleCerrarEtapa}>
            <p className="mb-0 text-decoration-underline">Cerrar etapa</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
        )}
      </>
      ) : (
        <SuccessOSminutaDIPRES 
        idCompetencia={competenciaDetails?.id}
        mensaje="Para continuar con la siguiente etapa del proceso asegúrate de subir el oficio que notifica al grupo de usuarios GORE."
        />
      )}
    </div>
  );
};

export default ObservacionesSubdereDipres;
