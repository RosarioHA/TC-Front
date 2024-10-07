// import { Etapa1, Etapa2, Etapa3, Etapa4, Etapa5 } from "../fase1/etapas";
import { Etapa1Recomendacion } from "../etapasRecomendacion/Etapa1";
import { Etapa2Recomendacion } from "../etapasRecomendacion/Etapa2";

// const Etapa = ({ etapaInfo, index, id }) => {
//   switch (index) {
//     case 0: return <Etapa1Recomendacion etapa={etapaInfo.recomendacionpostcid} id={id} />;
//     case 1: return <Etapa2Recomendacion etapa={etapaInfo.definicionplazos} etapaUno={etapaInfo.recomendacionpostcid} id={id} />;
//     default: return null;
//   }
// };
const Etapa = ({ etapaInfo, index, id }) => {
  switch (index) {
    case 0:
      return <Etapa1Recomendacion etapa={etapaInfo.recomendacionpostcid} id={id} />;
    case 1:
      return <Etapa2Recomendacion etapa={etapaInfo.definicionplazos} etapaUno={etapaInfo.recomendacionpostcid} id={id} />;
    default:
      return null;
  }
};

export const VerticalStepperRecomendacion = ({ etapasObjeto, etapaDatos, id }) => {
  if (!etapasObjeto) {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando...</div>;
  }
  
  console.log("etapaDatos", etapaDatos);
  console.log("etapasObjeto", etapasObjeto);

  const etapasInfo = etapasObjeto.etapas_info;
  const etapasClaves = Object.keys(etapasInfo);
  const idCompetencia = id

  const etapasFiltradas = etapasClaves.slice(0, 2);

  let lastCompletedIndex = etapasFiltradas.findIndex((key, index) =>
    etapasInfo[key].estado !== 'Finalizada' && (index === 0 || etapasInfo[etapasFiltradas[index - 1]].estado === 'Finalizada')
  );

  const renderBadge = (estado) => {
    switch (estado) {
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
        {etapasFiltradas.map((clave, index) => {
          const etapa = etapasInfo[clave];
          const isCompleted = etapa.estado === 'Finalizada' || etapa.estado === 'Omitida';
          const nombreEtapa = (() => {
            switch (index) {
              case 0: return etapaDatos.recomendacionpostcid.nombre_etapa;
              case 1: return etapaDatos.definicionplazos.nombre_etapa;
              default: return etapa.nombre;
            }
          })();

          return (
            <li
              className={`stepperItem ${isCompleted ? 'completed' : ''} ${index === lastCompletedIndex ? 'next-step' : ''}`}
              key={index}
            >
              <div className="stepNumber">
                {isCompleted ? (
                  <i className="material-symbols-outlined">done</i> // Se muestra el ícono 'done' si la etapa está 'Finalizada' u 'Omitida'
                ) : (
                  <span className="stepIndex">{index + 1}</span>
                )}
              </div>
              <div className="stepperContent">
                <div className="d-flex justify-content-between">
                  <h3 className="stepperTitle">{nombreEtapa}</h3>
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