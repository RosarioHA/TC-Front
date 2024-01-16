import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa2 = ({ etapa }) =>
{
  const {
    nombre_etapa,
    estado,
    oficio_inicio_sectorial,
    formulario_sectorial,
    observaciones_sectorial,
    usuarios_notificados,
    fecha_ultima_modificacion
  } = etapa;
  const navigate = useNavigate();

  const etapaNum = 2;

  const handleNavigation = (path) => {
    console.log("Navegando a:", path);
    navigate(path);
  };

  if (!etapa || etapa.nombre_etapa === undefined)
  {
    return <div>Data is loading or not available</div>;
  }

  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre, id: subetapaId } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";

    switch (true)
    {
      case nombre.startsWith("Notificar a") && estado === "finalizada":
        if (etapa.estado === 'Aún no puede comenzar')
        {
          return <span className="badge-status-pending">{accion}</span>;
        } else
        {
          return <span className="badge-status-finish">{accion}</span>;
        }

      case nombre.includes("Subir oficio y su fecha para habilitar formulario sectorial"):
        path = estado === "finalizada" ? "/home/ver_minuta" : `/home/estado_competencia/${etapa.id}/subir_oficio/${etapaNum}/${subetapaId}`;
        break;

      case nombre.includes("Completar formulario Sectorial"):
        path = estado === "finalizada" ? "/home/ver_minuta" : `/home/formulario_sectorial/${etapa.id}/paso_1`;
        break;

      case nombre.includes("Observación del formulario sectorial"):
        path = estado === "finalizada" ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
        break;

      // Puedes agregar más casos según sea necesario
      default:
        break;
    }

    const isDisabled = estado === "pendiente";

    return isDisabled ? (
      <button className={`btn-secundario-s ${estado === "pendiente" ? "disabled" : ""}`} id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      <button onClick={() => handleNavigation(path)} className="btn-secundario-s text-decoration-none" id="btn">
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
        {oficio_inicio_sectorial && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{oficio_inicio_sectorial.nombre}</div>
            {renderButtonForSubetapa(oficio_inicio_sectorial)}
          </div>
        )}
        {formulario_sectorial.length > 0 && renderSubetapas(formulario_sectorial)}
        {observaciones_sectorial.length > 0 && renderSubetapas(observaciones_sectorial)}
        {estado === "En Estudio" && (
          <Counter
            plazoDias={etapa.plazo_dias}
            tiempoTranscurrido={etapa.calcular_tiempo_transcurrido}
          />
        )}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};
