import { Etapa1, Etapa2, Etapa3, Etapa4, Etapa5 } from "../etapas";

export const VerticalStepper = ({ competencia }) =>
{

  if (!competencia)
  {
    console.log('Competencia no definida');
    return <div>Cargando...</div>;
  }

  const etapas = competencia.etapas;
  let lastCompletedIndex = etapas.findIndex(stage => stage.estado !== 'Finalizado');

  const renderBadge = (estado) =>
  {
    switch (estado)
    {
      case 'Finalizado':
        return <span className="badge-status-finish">Finalizada</span>;
      case 'En Estudio':
        return <span className="badge-status-review">En Estudio</span>;
      case 'Pendiente':
        return <span className="badge-status-pending">Aún no puede comenzar</span>;
      default:
        return null;
    }
  };

  return (
    <div className="wrapper d-flex justify-content-start mx-1">
      <ol className="stepper">
        {etapas.map((etapa, index) => (
          <li
            className={`stepperItem ${etapa.estado === 'Finalizado' ? 'completed' : ''} ${index === lastCompletedIndex ? 'next-step' : ''}`}
            key={etapa.id}
          >
            <div className="stepNumber" >
              {etapa.estado === 'Finalizado' ? (
                <i className="material-symbols-outlined" >done</i>
              ) : etapa.estado === 'En Estudio' ? (
                <span className="stepIndex revision">{index + 1}</span>
              ) : (
                <span className="stepIndex pendiente">{index + 1}</span>
              )}
            </div>
            <div className="stepperContent">
              <div className="d-flex justify-content-between "><h3 className="stepperTitle">{etapa.etapa}</h3><div>{renderBadge(etapa.estado)}</div></div>
              {index === 0 && <Etapa1 etapaCompetencia={competencia.etapas[ 0 ]} />}
              {index === 1 && <Etapa2 etapaCompetencia={competencia.etapas[ 1 ]} />}
              {index === 2 && <Etapa3 etapaCompetencia={competencia.etapas[ 2 ]} />}
              {index === 3 && <Etapa4 etapaCompetencia={competencia.etapas[ 3 ]} />}
              {index === 4 && <Etapa5 etapaCompetencia={competencia.etapas[ 4 ]} />}
            </div>
          </li>
        ))}
        <div className="stepper-line-end"></div>
      </ol>
    </div>
  );
};