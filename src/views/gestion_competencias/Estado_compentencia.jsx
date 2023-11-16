import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { competencias } from '../../Data/Competencias';
import { SummaryDetail } from "../../components/tables/SummaryDetail";
import { PersonsAssigned } from "../../components/tables/PersonsAssigned";
import { VerticalStepper } from "../../components/tables/VerticalStepper";

const EstadoCompetencia = () =>
{
  let { id } = useParams();
  const [ competencia, setCompetencia ] = useState(null);

  // Maneja boton de volver atras.
  const history = useNavigate();
  const handleBackButtonClick = () =>
  {
    history(-1);
  };


  useEffect(() =>
  {
    const comp = competencias.find(c => c.id.toString() === id);
    setCompetencia(comp);
  }, [ id ]);

  if (!competencia)
  {
    return <div>No se encontró la competencia con ID: {id}</div>;
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
          <div className="text-sans-h1 mb-4">{competencia.nombre} ($SectorCompetencia)</div>
          <SummaryDetail competencia={competencia} />
        </div>
        <div className="mt-5">
          <div className="text-sans-h2 my-4">Personas asignadas</div>
          <PersonsAssigned />
        </div>
        <div className="mt-5">
        <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
        <VerticalStepper competencia={competencia}/>
        </div>
      </div>
    </>
  );
}

export default EstadoCompetencia;