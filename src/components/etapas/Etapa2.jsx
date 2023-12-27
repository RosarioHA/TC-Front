import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleNavigation = (path,id) =>
  {
    navigate(path, { state: { id} });
  };
  
  console.log('data2',etapaCompetencia); 

  const renderButtonForSubetapa = (subetapa) =>
  {

    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";
    let id = subetapa.id;

    if (nombre.startsWith("Notificar a") && estado === "finalizada")
    {
      if (etapaCompetencia.estado === 'Aún no puede comenzar')
      {
        // Cambiar el badge a pending si el estado general de la etapa es 'Aún no puede comenzar'
        return <span className="badge-status-pending">{accion}</span>;
      } else
      {
        // Mantiene el badge como finish si la subetapa está finalizada
        return <span className="badge-status-finish">{accion}</span>;
      }
    }
    if (nombre)
    
    {
      switch (true)
      {
        case nombre.includes("Completar formulario Sectorial"):
          path = estado === "finalizada" ? "/home/ver_minuta" : `/home/formulario_sectorial/${id}/paso_1`;
          break;
        case nombre.includes("Observación del formulario sectorial"):
          path = estado === "finalizada" ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
          break;
        default:
          break;
      }
    }
    const isDisabled = estado === "pendiente";

    return isDisabled ? (
      <button className={`btn-secundario-s ${estado === "pendiente" ? "disabled" : ""}`} id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      <button onClick={() => handleNavigation(path, id)} className="btn-secundario-s text-decoration-none" id="btn">
      <span className="material-symbols-outlined me-1">{icon}</span>
      <u>{buttonText}</u>
    </button>
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
