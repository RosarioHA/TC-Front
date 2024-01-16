import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SummaryDetail } from "../../components/tables/SummaryDetail";
import { PersonsAssigned } from "../../components/tables/PersonsAssigned";
import { VerticalStepper } from "../../components/stepers/VerticalStepper";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";

const EstadoCompetencia = () =>
{
  const { id } = useParams();
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const navigate = useNavigate();
  const [ competencia, setCompetencia ] = useState(null);

  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [competenciaDetails]);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  if (loading)
  {
    return <div>Cargando detalles de la competencia...</div>;
  }

  if (error)
  {
    return <div>Error al cargar los detalles: {error.message}</div>;
  }

  if (!competencia)
  {
    return <div>No se encontraron detalles de la competencia</div>;
  }


  return (
    <>
      <div className="my-3 mx-5">
        <div className="py-3 d-flex">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
          <nav className="container mx-5" aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style d-flex my-2">
              <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Estado de la Competencia: {competencia.nombre}</li>
            </ol>
          </nav>
        </div>
        <span className="text-sans-Title">Estado de la Competencia</span>
        <div className="my-3">
          <div className="text-sans-h1 mb-4">{competencia.nombre}</div>
          <SummaryDetail competencia={competencia} />
        </div>
        <div className="mt-5">
          <div className="text-sans-h2 my-4">Personas asignadas</div>
          <PersonsAssigned
            usuariosSubdere={competencia.usuarios_subdere}
            usuariosDipres={competencia.usuarios_dipres}
            usuariosSectoriales={competencia.usuarios_sectoriales}
            usuariosGore={competencia.usuarios_gore}
          />
        </div>
        <div className="mt-5 mx-0">
          <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
          <VerticalStepper etapasObjeto={competencia.resumen_competencia}  etapaDatos={competencia} id={id} />
        </div>
      </div>
    </>
  );
};

export default EstadoCompetencia;
