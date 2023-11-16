import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa4 = ({ etapaCompetencia }) =>
{
  const { etapa, subetapas } = etapaCompetencia;

  const SubetapaButton = ({ subetapa }) => {
    let buttonText, icon, path = "/";
    const isFinalizado = subetapa.estado === "Finalizado";
    const isDisabled = subetapa.estado === "Pendiente";
    const isRevision = subetapa.estado === "Revision";

    // Cambiar el ícono a 'draft' si el estado es 'Pendiente' o 'Revisión'
    icon = (isDisabled || isRevision) ? "draft" : "visibility";

    if (isFinalizado) {
      if (subetapa.nombre === "Notificar a") {
        buttonText = "Finalizada";
      } else if (subetapa.nombre === "Completar formulario GORE") {
        buttonText = "Ver Formulario";
        path = "/home/formulario_sectorial";
      }
    } else {
      if (subetapa.nombre === "Notificar a" && (subetapa.estado === "Pendiente" || subetapa.estado === "Revision")) {
        buttonText = "Agregar Usuario";
      } else if (subetapa.nombre === "Completar formulario GORE") {
        buttonText = "Completar Formulario";
        path = "/home/agregar_minuta";
      }
    }

    if (isFinalizado && subetapa.nombre === "Notificar a") {
      return <span className="badge-status-finish">{buttonText}</span>;
    } else if (isDisabled || isRevision) {
      return (
        <button className="btn-secundario-s" id="btn" disabled={isDisabled}>
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    } else {
      return (
        <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </Link>
      );
    }
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {subetapas.map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">
              {subetapa.nombre}
              {subetapa.nombre === "Notificar a" && subetapa.estado === "Finalizado" && subetapa.usuarioDesignado && ` : ${subetapa.usuarioDesignado}`}
            </div>
            <SubetapaButton subetapa={subetapa} />
          </div>
        ))}
        {etapaCompetencia.estado === "En Estudio" && <Counter />}
        <div className="text-sans-p">Fecha última modificación: $lastModified</div>
      </div>
    </div>
  );
};

