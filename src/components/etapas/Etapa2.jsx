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

  const combinedSubetapas = [
    ...usuarios_notificados,
    ...formulario_sectorial,
    ...observaciones_sectorial
  ];

  const renderButtonForSubetapa = (subetapa) =>
  {
    let buttonText = subetapa.accion; // Asigna el texto de acción directamente
    let icon, path = "/";

    const isFinalizado = subetapa.estado === "finalizada";
    const isDisabled = subetapa.estado === "pendiente";
    const isRevision = subetapa.estado === "revision";

    if (subetapa.nombre.startsWith("Notificar a") && isFinalizado)
    {
      return <span className="badge-status-finish">{buttonText}</span>;
    }

    switch (subetapa.nombre)
    {
      case "Completar formulario Sectorial":
        path = isFinalizado ? "/home/formulario_sectorial" : "/home/formulario_sectorial/paso_uno";
        icon = isFinalizado ? "visibility" : "draft"
        break;
      case "Observación del formulario sectorial":
        path = isFinalizado ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
        icon = isFinalizado ? "visibility" : "draft"
        break;
      // Añadir más casos según sea necesario
    }


    return isDisabled || isRevision ? (
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
        {combinedSubetapas.map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{subetapa.nombre}</div>
            {renderButtonForSubetapa(subetapa)}
          </div>
        ))}
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