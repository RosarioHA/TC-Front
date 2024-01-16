import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa3 = ({ etapa }) => {
  const {
    nombre_etapa,
    estado,
    minuta_sectorial,
    observacion_minuta_sectorial,
    usuario_notificado,
    fecha_ultima_modificacion,
    oficio_inicio_dipres
  } = etapa;

  if (!etapa) {
    return <div>Loading...</div>;
  }

  const renderButtonOrBadgeForSubetapa = (subetapa) => {
    const isFinalizado = subetapa.estado === "finalizada";
    let buttonText = subetapa.accion;
    let icon = isFinalizado ? "visibility" : "draft";
    let path = "/";

    if (subetapa.nombre.includes("Notificar a") && isFinalizado) {
      if (estado === 'Aún no puede comenzar') {
        // Cambiar el badge a pending si el estado general de la etapa es 'Aún no puede comenzar'
        return <span className="badge-status-pending">{buttonText}</span>;
      } else {
        // Mantiene el badge como finish si la subetapa está finalizada
        return <span className="badge-status-finish">{buttonText}</span>;
      }
    }

    const isDisabled = subetapa.estado === "pendiente" || subetapa.estado === "revision";

    return isDisabled ? (
      <button className={`btn-secundario-s ${isDisabled ? "disabled" : ""}`} id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </Link>
    );
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {[usuario_notificado, oficio_inicio_dipres, minuta_sectorial, observacion_minuta_sectorial].map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{subetapa.nombre}</div>
            {renderButtonOrBadgeForSubetapa(subetapa)}
          </div>
        ))}
        {estado === "En Estudio" && <Counter plazoDias={etapa.plazo_dias} tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};
