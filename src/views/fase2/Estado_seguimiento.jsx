import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCompetencia } from '../../hooks/competencias/useCompetencias';
import { useFormularioSubdere } from '../../hooks/fase1/revisionFinalSubdere/useFormularioSubdere';
import { useResumenFinal } from "../../hooks/fase1/revisionFinalSubdere/useResumenFinal";
import { useCompetenciasPostCid } from '../../hooks/competencias/fase2/useCompetenciasPostCID';
import { VerticalStepper } from '../../components/stepers/VerticalStepper';
import { VerticalStepperRecomendacion } from '../../components/fase2/estadoSeguimiento/VerticalStepperRecomendacion';
import { PersonsAssigned } from '../../components/fase1/tables/PersonsAssigned';
import { DesplegableEstadoFase2 } from '../../components/fase2/estadoSeguimiento/DesplegableEstado';
import { SummaryDetail2 } from '../../components/fase2/estadoSeguimiento/SummaryDetails2';
import { CardDocumento } from '../../components/fase1/commons/CardDocumento';

const EstadoSeguimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dataFormSubdere } = useFormularioSubdere(id);
  const { resumen } = useResumenFinal(id);
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const [ competencia, setCompetencia ] = useState(null);
  const { competenciaPostCid } = useCompetenciasPostCid(id);
  //const [ competenciaPostCid, setCompetenciaPostCid ] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const mostrarMensajeFinalizada = competenciaDetails?.estado === 'Finalizada' && resumen?.competencia_fase1_finalizada === true;
  
  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  // useEffect(() => {
  //   if (CompetenciasPC) {
  //     setCompetenciaPostCid(CompetenciasPC);
  //   }
  // }, [ CompetenciasPC ]);

  console.log("competenciaPostCid en estado seguimiento", competenciaPostCid)

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const toggleDropdown = (dropdown) => {
    // Si el desplegable actual está abierto, cerrarlo. Si no, abrir el nuevo y cerrar el anterior.
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  if (loading && competencia) {
    return <div className="d-flex align-items-center flex-column ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando detalles de la competencia...</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  } if (error) {
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
        {competencia && <SummaryDetail2 competencia={competencia} />}
      </div>

      <div className="my-5">
        <div className="text-sans-h2 my-4">Personas asignadas</div>
        <PersonsAssigned
          usuariosSubdere={competencia?.usuarios_subdere}
          usuariosDipres={competencia?.usuarios_dipres}
          usuariosSectoriales={competencia?.usuarios_sectoriales}
          usuariosGore={competencia?.usuarios_gore} />
      </div>

      <div className="mt-5 mx-0">
        <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>

        {/* Desplegable Levantamiento informacion */}
        <div>
            <DesplegableEstadoFase2 
            onButtonClick={() => toggleDropdown('levantamiento')} 
            isOpen={openDropdown === 'levantamiento'}
            title="Levantamiento de información sectorial y de gobiernos regionales"
            />
            {openDropdown === 'levantamiento' && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <CardDocumento
                    id={id}
                    editorName={dataFormSubdere?.ultimo_editor?.nombre_completo}
                    editionDate={dataFormSubdere?.fecha_ultima_modificacion}
                    antecedentes={resumen?.antecedente_adicional_revision_subdere}
                    descripcion={resumen?.descripcion_antecedente}
                    resumen={resumen}
                    estadoFinalizado={mostrarMensajeFinalizada}
                    documentoCerrado={true}
                  />
                  <VerticalStepper 
                  etapasObjeto={competencia?.resumen_competencia} 
                  etapaDatos={competencia} 
                  id={id} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desplegable Recomendacion Post CID */}
          <div className="my-3">
            <DesplegableEstadoFase2 
            onButtonClick={() => toggleDropdown('recomendacion')} 
            isOpen={openDropdown === 'recomendacion'}
            title="Recomendación de transferencia post-CID y “pre-implementación” "
            />
            {openDropdown === 'recomendacion' && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <h2 className="text-sans-h2 my-3">Etapa de Recomendación de transferencia post-CID y Definición de plazos de implementación y seguimiento</h2>
                  < VerticalStepperRecomendacion 
                  etapasObjeto={competenciaPostCid?.resumen_competencia} 
                  etapaDatos={competenciaPostCid} 
                  id={id}
                  /> 
                </div>
              </div>
            )}
          </div>

          {/* Desplegable Implementacion */}
          <div className="my-3">
            <DesplegableEstadoFase2 
            onButtonClick={() => toggleDropdown('implementacion')} 
            isOpen={openDropdown === 'implementacion'}
            title="Implementación"
            />
            {openDropdown === 'implementacion' && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <h2 className="text-sans-h2 my-3">Etapas de implementación</h2>
                </div>
              </div>
            )}
          </div>

          {/* Desplegable Seguimiento */}
          <div className="my-3">
            <DesplegableEstadoFase2 
            onButtonClick={() => toggleDropdown('seguimiento')} 
            isOpen={openDropdown === 'seguimiento'}
            title="Seguimiento"
            />
            {openDropdown === 'seguimiento' && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <h2 className="text-sans-h2 my-3">Etapas de seguimiento</h2>
                </div>
              </div>
            )}
          </div>

          {/* Desplegable Evaluacion */}
          <div className="my-3">
            <DesplegableEstadoFase2 
            onButtonClick={() => toggleDropdown('evaluacion')} 
            isOpen={openDropdown === 'evaluacion'}
            title="Evaluación"
            />
            {openDropdown === 'evaluacion' && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <h2 className="text-sans-h2 my-3">Etapas de evaluación</h2>
                  <p className="text-sans-p">No disponible.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default EstadoSeguimiento;