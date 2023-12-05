import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { SummaryDetail } from "../../components/tables/SummaryDetail";
import { PersonsAssigned } from "../../components/tables/PersonsAssigned";
import { VerticalStepper } from "../../components/tables/VerticalStepper";
import { useCompetencia } from "../../hooks/useCompetencias";

const EstadoCompetencia = () =>
{
  let { id } = useParams();
  const { competenciaDetails, fetchCompetenciaDetails} = useCompetencia(id);
  const navigate = useNavigate();
  const location = useLocation();
  const [competencia, setCompetencia] = useState(location.state?.competencia);

  console.log(competenciaDetails)

  useEffect(() => {
    if (!competencia) {
      fetchCompetenciaDetails(id);
    } else {
      console.log("Competencia recibida en el estado de navegación:", competencia);
    }
  }, [id, fetchCompetenciaDetails, competencia]);

  useEffect(() => {
    if (competenciaDetails) {
      // Si los detalles de la competencia están disponibles, usarlos
      setCompetencia(competenciaDetails);
    }
  }, [competenciaDetails]);

  if (!competencia) {
    return <div>Cargando detalles de la competencia...</div>;
  }


  const etapas = [];
  // Asigna las etapas de la competencia a un array
  // Asumiendo que competenciaDetails tiene un formato similar al de competencia
  Object.keys(competencia).forEach(key => {
    if (key.startsWith('etapa') && Array.isArray(competencia[key])) {
      etapas.push(...competencia[key]);
    }
  });

  const handleBackButtonClick = () => {
    navigate(-1);
  };


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
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Estado de la Competencia: {competenciaDetails.nombre}</li>
            </ol>
          </nav>
        </div>
        <span className="text-sans-Title">Estado de la Competencia</span>
        <div className="my-3">
          <div className="text-sans-h1 mb-4">{competencia.nombre}</div>
          <SummaryDetail competencia={competencia}/>
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
          <VerticalStepper etapas={etapas}    />
        </div>
      </div>
    </>
  );
}

export default EstadoCompetencia;