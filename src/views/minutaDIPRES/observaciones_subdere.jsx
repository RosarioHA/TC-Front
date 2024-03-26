import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import CustomTextarea from "../../components/forms/custom_textarea";
import { useEtapa3 } from "../../hooks/minutaDIPRES/useEtapa3";
import { SuccessOSminutaDIPRES } from "../../components/success/OSminutaDipres";

const ObservacionesSubdereDipres = () => {
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { patchComentarioMinuta, loadingPatch } = useEtapa3();
  const [observacionMinutaDipres, setObservacionMinutaDipres] = useState("");
  const [observacionEnviada, setObservacionEnviada] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const navigate = useNavigate();
  const observacionesEnviadas = competenciaDetails?.etapa3?.observacion_minuta_sectorial_enviada;
 
  console.log("competenciaDetails en OS Minuta Dipres", competenciaDetails);
  console.log("observacionMinutaDipres en OS Minuta Dipres", observacionMinutaDipres);
  console.log("observacionesEnviadas en OS Minuta Dipres", observacionesEnviadas);

  useEffect(() => {
    // Verificar si las observaciones ya han sido enviadas
    if (competenciaDetails?.etapa3?.observacion_minuta_sectorial_enviada) {
      // Establecer las observaciones existentes como estado inicial
      setObservacionMinutaDipres(competenciaDetails.etapa3.comentario_minuta_etapa3);
    }
  }, [competenciaDetails]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleGuardarObservacion = () => {
    setObservacionEnviada(true);
  };

  const handleCerrarEtapa = async () => {
    await patchComentarioMinuta(id, observacionMinutaDipres);
    setIsSubmitSuccessful(true);
  }

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
        <h2 className="text-sans-h1 mt-4">Minuta DIPRES</h2>
        <h2 className="text-sans-h2">{competenciaDetails.nombre}</h2>
      </div>

      {!isSubmitSuccessful ? (
      <>
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
            value={observacionMinutaDipres}
            onChange={(e) => setObservacionMinutaDipres(e.target.value)}
            readOnly={observacionesEnviadas}
            onBlur={handleGuardarObservacion}
            loading={loadingPatch}
          />
        </div>

        { !observacionesEnviadas && (
        <div className="d-flex justify-content-end my-5">
          <button className="btn-primario-s" disabled={!observacionEnviada} onClick={handleCerrarEtapa}>
            <p className="mb-0 text-decoration-underline">Cerrar etapa</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
        )}
      </>
      ) : (
        <SuccessOSminutaDIPRES 
        idCompetencia={competenciaDetails?.id}/>
      )}

    </div>
  )
};

export default ObservacionesSubdereDipres;