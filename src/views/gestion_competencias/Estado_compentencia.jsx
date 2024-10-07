import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SummaryDetail } from "../../components/fase1/tables/SummaryDetail";
import { PersonsAssigned } from "../../components/fase1/tables/PersonsAssigned";
import { VerticalStepper } from "../../components/stepers/VerticalStepper";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useFormularioSubdere } from "../../hooks/fase1/revisionFinalSubdere/useFormularioSubdere";
import { useResumenFinal } from "../../hooks/fase1/revisionFinalSubdere/useResumenFinal";
import { useCompetenciasPostCid } from "../../hooks/competencias/fase2/useCompetenciasPostCID";
import { CardDocumento } from "../../components/fase1/commons/CardDocumento";
import { CardInicioFase2 } from "../../components/fase2/estadoSeguimiento/CardInicioFase2";

const EstadoCompetencia = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const { resumen } = useResumenFinal(id);
  const navigate = useNavigate();
  const [ competencia, setCompetencia ] = useState(null);
  const { dataFormSubdere } = useFormularioSubdere(id);
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const mostrarMensajeFinalizada = competenciaDetails?.estado === 'Finalizada' && resumen?.competencia_fase1_finalizada === true;

  const { updateCompetencia } = useCompetenciasPostCid(id);

  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleIniciarPreImplementacion = async () => {
    try {
      const dataToUpdate = { iniciar_etapa_preimplementacion: true };
      await updateCompetencia(dataToUpdate);
      console.log("FASE PREIMPLEMENTACION INICIADA CORRECTAMENTE")
      navigate(`/home/estado_seguimiento/${id}/`)
    } catch (error) {
      console.error('Error al iniciar la pre-implementación:', error);
      console.log("ERROR AL INICIAR FASE PREIMPLEMENTACION")
    }
  };

  if (loading && competencia) {
    return <div className="d-flex align-items-center flex-column ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando detalles de la competencia...</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  } 
  if (error) {
    return <div>Error al cargar los detalles: {error.message}</div>;
  }

  return (
    <>
      <div className="container col-10 col-xxl-11 my-3">
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
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Estado de la Competencia: {competencia?.nombre}</li>
            </ol>
          </nav>
        </div>
        <span className="text-sans-Title">Estado de la Competencia</span>
        <div className="my-3">
          <div className="d-flex">
            <span className="badge-tipo mt-1">{competencia?.agrupada ? 'Agrupada' : 'Individual'}</span>
            <h1 className="text-sans-h1 mb-4 ms-2">{competencia?.nombre}</h1>
          </div>
          {competencia && <SummaryDetail competencia={competencia} />}
        </div>
        <div className="my-5">
          <div className="text-sans-h2 my-4">Personas asignadas</div>
          <PersonsAssigned
            usuariosSubdere={competencia?.usuarios_subdere}
            usuariosDipres={competencia?.usuarios_dipres}
            usuariosSectoriales={competencia?.usuarios_sectoriales}
            usuariosGore={competencia?.usuarios_gore}
            usuariosSeguimiento={competencia?.usuarios_seguimiento}
          />
        </div>

        {userSubdere && mostrarMensajeFinalizada && (
          <CardInicioFase2
          onButtonClick={handleIniciarPreImplementacion}
          />
        )}

        {userSubdere && (
          <CardDocumento
            id={id}
            editorName={dataFormSubdere?.ultimo_editor?.nombre_completo}
            editionDate={dataFormSubdere?.fecha_ultima_modificacion}
            antecedentes={resumen?.antecedente_adicional_revision_subdere}
            descripcion={resumen?.descripcion_antecedente}
            resumen={resumen}
            estadoFinalizado={mostrarMensajeFinalizada}
          />
        )}

        <div className="mt-5 mx-0">
          <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
          <VerticalStepper etapasObjeto={competencia?.resumen_competencia} etapaDatos={competencia} id={id} />
        </div>
      </div>
    </>
  );
};

export default EstadoCompetencia;
