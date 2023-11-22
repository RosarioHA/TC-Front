import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa2 = ({ etapaCompetencia }) => {
  const { etapa, subetapas } = etapaCompetencia;

  const SubetapaButton = ({ subetapa }) => {
    let buttonText = "Acción";
    let path = "/";
    const isDisabled = subetapa.estado === "Pendiente";

    switch (subetapa.nombre) {
      case "Completar formulario sectorial":
        buttonText = "Completar formulario";
        path = "/home/formulario_sectorial";
        break;
      case "Revisión SUBDERE":
        buttonText = "Subir observaciones";
        path = "/home/ingresar_observaciones";
        break;
      // Añadir más casos según sea necesario
    }

    if (isDisabled) {
      return <button className="btn-secundario-s" id="btn" disabled><span className="material-symbols-outlined me-1">
      draft
      </span><u>{buttonText}</u></button>;
    } else {
      return <Link to={path} className="btn-secundario-s text-decoration-none" id="btn"><span className="material-symbols-outlined me-1">
      draft
      </span><u>{buttonText}</u></Link>;
    }
  };

  const renderButtonForSubetapa = (subetapa) => {
    switch (subetapa.nombre) {
      case "Completar formulario sectorial":
        return <Link to={`/resumen/${subetapa.id}`} className="btn-secundario-s text-decoration-none" id="btn" ><span className="material-symbols-outlined me-2">
        visibility
    </span><u>Ver Formulario</u></Link>;
      case "Revisión SUBDERE":
        return <Link to={`/observaciones/${subetapa.id}`} className="btn-secundario-s text-decoration-none" id="btn" type="button">
        <span className="material-symbols-outlined me-2">
            visibility
        </span>
        <u>Ver Observaciones</u>
    </Link>
      default:
        return <div>Error: Nombre de subetapa desconocido.</div>; 
    }
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
      {subetapas.map((subetapa, index) => {
          return (
            <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
              <div className="align-self-center">{subetapa.nombre}</div>
              {subetapa.estado === "Finalizado" ? (
                renderButtonForSubetapa(subetapa)
              ) : (
                <SubetapaButton subetapa={subetapa} />
              )}
            </div>
          );
        })}
        {etapaCompetencia.estado === "En Estudio" && <Counter />}
        <div className="text-sans-p">Fecha última modificación: $lastModified</div>
      </div>
    </div>
  );
};
