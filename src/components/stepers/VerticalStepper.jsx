import { Etapa1, Etapa2, Etapa3, Etapa4, Etapa5 } from "../etapas";

const Etapa = ({ etapaInfo, index, id, usuarios}) => {

  switch (index) {
    case 0: return <Etapa1 etapa={etapaInfo.etapa1} id={id}/>;
    case 1: return <Etapa2 etapa={etapaInfo.etapa2} etapaUno={etapaInfo.etapa1}   sectoriales={usuarios.usuarios_sectoriales} idCompetencia={id}/>;
    case 2: return <Etapa3 etapa={etapaInfo.etapa3} etapaDos={etapaInfo.etapa2}  idCompetencia={id} />;
    case 3: return <Etapa4 etapa={etapaInfo.etapa4} etapaTres={etapaInfo.etapa3}  idCompetencia={id} />;
    case 4: return <Etapa5 etapa={etapaInfo.etapa5} etapaCuatro={etapaInfo.etapa4}  idCompetencia={id} />;
    default: return null;
  }
};


export const VerticalStepper = ({ etapasObjeto, etapaDatos, id }) => {
  if (!etapasObjeto)
  {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando...</div>;
  }
  
  const etapasInfo = etapasObjeto.etapas_info;
  const etapasClaves = Object.keys(etapasInfo);
  const idCompetencia = id



  let lastCompletedIndex = etapasClaves.findIndex((key, index) =>
    etapasInfo[ key ].estado !== 'Finalizada' && (index === 0 || etapasInfo[ etapasClaves[ index - 1 ] ].estado === 'Finalizada'));


  const renderBadge = (estado) =>
  {
    switch (estado)
    {
      case 'Finalizada':
        return <span className="badge-status-finish">{estado}</span>;
      case 'En Estudio':
        return <span className="badge-status-review">{estado}</span>;
      case 'En revisión SUBDERE':
          return <span className="badge-status-study">{estado}</span>;
      case 'Aún no puede comenzar':
        return <span className="badge-status-pending">{estado}</span>;
      case 'Omitida':
        return <span className="badge-status-pending">{estado}</span>;
      case 'Atrasada':
          return <span className="badge-status-borderRed">{estado}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="wrapper d-flex justify-content-start mx-0">
      <ol className="stepper">
        {etapasClaves.map((clave, index) =>
        {
          const etapa = etapasInfo[ clave ];
          return (
            <li
              className={`stepperItem ${etapa.estado === 'Finalizada' ? 'completed' : ''} ${index === lastCompletedIndex ? 'next-step' : ''}`}
              key={index} 
            >
              <div className="stepNumber">
                {etapa.estado === 'Finalizada' ? (
                  <i className="material-symbols-outlined">done</i>
                ) : (
                  <span className="stepIndex">{index + 1}</span>
                )}
              </div>
              <div className="stepperContent">
                <div className="d-flex justify-content-between">
                  <h3 className="stepperTitle">{etapa.nombre}</h3>
                  <div>{renderBadge(etapa.estado)}</div>
                </div>
                <Etapa etapaInfo={etapaDatos} index={index} id={idCompetencia} usuarios={etapaDatos}/>

              </div>
            </li>
          );
        })}
        <div className="stepper-line-end"></div>
      </ol>
    </div>
  );
};