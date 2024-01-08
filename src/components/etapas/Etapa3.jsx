import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa3 = ({ etapa }) =>
{
  const { nombre_etapa, estado, minuta_sectorial, observacion_minuta_sectorial, usuario_notificado, fecha_ultima_modificacion, oficio_inicio_dipres } = etapa;

  const combinedSubetapas = [
    usuario_notificado,
    oficio_inicio_dipres,
    minuta_sectorial,
    observacion_minuta_sectorial,
  ];

  if (!etapa)
  {
    return <div>Loading...</div>;
  }

  const renderButtonForSubetapa = (subetapa) =>
  {
    // Añadir chequeo para el estado general de la etapa
    const etapaInactiva = estado === "Aún no puede comenzar";
    let buttonText, icon, path = "/";
    const isFinalizado = subetapa.estado === "finalizada";
    const isDisabled = subetapa.estado === "pendiente";
    const isRevision = subetapa.estado === "revision";

    buttonText = subetapa.accion; // Texto por defecto
    icon = isFinalizado ? "visibility" : "draft"; // Icono por defecto


    if (etapaInactiva)
    {
      // Si la etapa en general está inactiva, todos los botones se deshabilitan
      return (
        <button className="btn-secundario-s disabled" id="btn">
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    } else
    {
      // Lógica existente para manejar el estado individual de cada subetapa
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
    }
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
        {estado === "En Estudio" && <Counter plazoDias={etapa.plazo_dias}
          tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};