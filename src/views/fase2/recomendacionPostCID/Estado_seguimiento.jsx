import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompetencia } from '../../../hooks/competencias/useCompetencias';
import { useFormularioSubdere } from '../../../hooks/fase1/revisionFinalSubdere/useFormularioSubdere';
import { useResumenFinal } from '../../../hooks/fase1/revisionFinalSubdere/useResumenFinal';
import { VerticalStepper } from '../../../components/stepers/VerticalStepper';
import { PersonsAssigned } from '../../../components/fase1/tables/PersonsAssigned';
import { CardDocumento } from '../../../components/fase1/commons/CardDocumento';

const EstadoSeguimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const [ competencia, setCompetencia ] = useState(null);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const { dataFormSubdere } = useFormularioSubdere(id);
  const { resumen } = useResumenFinal(id);
  const [isLevantamientoOpen, setIsLevantamientoOpen] = useState(false);
  const [isSeguimientoOpen, setIsSeguimientoOpen] = useState(false);

  const mostrarMensajeFinalizada = competenciaDetails?.estado === 'Finalizada' && resumen?.formulario_final_enviado === true;

  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };


  const toggleLevantamiento = () => {
    setIsLevantamientoOpen(!isLevantamientoOpen);
  };

  const toggleSeguimiento = () => {
    setIsSeguimientoOpen(!isSeguimientoOpen);
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
        {/* AQUI VA UN CLON DE SummaryDetail, CREAR */}
      </div>

      <div className="my-5">
        <div className="text-sans-h2 my-4">Personas asignadas</div>
        <PersonsAssigned
          usuariosSubdere={competencia?.usuarios_subdere}
          usuariosDipres={competencia?.usuarios_dipres}
          usuariosSectoriales={competencia?.usuarios_sectoriales}
          usuariosGore={competencia?.usuarios_gore} />
      </div>

      {userSubdere && (
        // NECESITA UN TERCER ESTADO DONDE NO MUESTRE EL BOTON "GENERAR DOCUMENTO"
        <CardDocumento
          id={id}
          editorName={dataFormSubdere?.ultimo_editor?.nombre_completo}
          editionDate={dataFormSubdere?.fecha_ultima_modificacion}
          antecedentes={resumen?.antecedente_adicional_revision_subdere}
          descripcion={resumen?.descripcion_antecedente}
          resumen={resumen}
          estadoFinalizado={mostrarMensajeFinalizada} />
      )}

      <div className="mt-5 mx-0">
        <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
          {/* Desplegable Levantamiento informacion */}
          <div>
            <button onClick={toggleLevantamiento}>
              {/* AQUI COMPONENTE QUE CAMBIE DE COLOR Y ETC CUANDO ESTE ABIERTO O CERRADO, PARA TODOS LOS DESPLEGABLES */}
              {isLevantamientoOpen ? 'Cerrar Estado Competencia' : 'Abrir Estado Competencia'}
            </button>
            {isLevantamientoOpen && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <VerticalStepper etapasObjeto={competencia?.resumen_competencia} etapaDatos={competencia} id={id} />
                </div>
              </div>
            )}
          </div>

          {/* Desplegable Recomendacion Post CID */}
          <div className="my-3">
            <button onClick={toggleSeguimiento}>
              {/* AQUI COMPONENTE QUE CAMBIE DE COLOR Y ETC CUANDO ESTE ABIERTO O CERRADO, PARA TODOS LOS DESPLEGABLES */}
              {isSeguimientoOpen ? 'Cerrar Estado Competencia' : 'Abrir Estado Competencia'}
            </button>
            {isSeguimientoOpen && (
              <div className="estado-competencia-content">
                <div className="mt-5 mx-0">
                  <div className="text-sans-h2 my-3">nuevo stepper de fase 2</div>
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