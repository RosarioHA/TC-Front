import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa2 = ({ etapaCompetencia }) =>
{
  const {
    nombre_etapa,
    estado,
    formulario_sectorial,
    observaciones_sectorial,
    usuarios_notificados,
    fecha_ultima_modificacion
  } = etapaCompetencia;

const renderButtonForSubetapa = (subetapa) => {
  const { estado, accion, nombre } = subetapa;
  let buttonText = accion;
  let icon = estado === "finalizada" ? "visibility" : "draft";
  let path = "/";

  if (nombre.startsWith("Notificar a") && estado === "finalizada") {
    return <span className="badge-status-finish">{accion}</span>;
  }

  switch (true) {
    case nombre.includes("Completar formulario Sectorial"):
      path = estado === "finalizada" ? "/home/ver_minuta" : "/home/formulario_sectorial/";
      break;
    case nombre.includes("Observación del formulario sectorial"):
      path = estado === "finalizada" ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
      break;
    default:      // Manejo de otros casos o nombre por defecto
      break;
  }
  
  const isDisabled = estado === "pendiente" || estado === "revision";

  return isDisabled ? (
    <button className={`btn-secundario-s ${estado === "pendiente" ? "disabled" : ""}`} id="btn">
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

  const renderSubetapas = (subetapas) =>
  {
    return subetapas.map((subetapa, index) => (
      <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
        <div className="align-self-center">{subetapa.nombre}</div>
        {renderButtonForSubetapa(subetapa)}
      </div>
    ));
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {usuarios_notificados.length > 0 && renderSubetapas(usuarios_notificados)}
        {formulario_sectorial.length > 0 && renderSubetapas(formulario_sectorial)}
        {observaciones_sectorial.length > 0 && renderSubetapas(observaciones_sectorial)}
        {estado === "En Estudio" && (
          <Counter
            plazoDias={etapaCompetencia.plazo_dias}
            tiempoTranscurrido={etapaCompetencia.calcular_tiempo_transcurrido}
          />
        )}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};
