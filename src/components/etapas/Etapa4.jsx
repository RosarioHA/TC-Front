import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa4 = ({ etapa }) =>
{
  const {
    nombre_etapa,
    estado,
    oficio_inicio_gore,
    usuarios_gore,
    formularios_gore,
    fecha_ultima_modificacion
  } = etapa;


  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";


    if (nombre.startsWith("Notificar a") && estado === "finalizada") {
      if (etapa.estado === 'Aún no puede comenzar') {
        // Cambiar el badge a pending si el estado general de la etapa es 'Aún no puede comenzar'
        return <span className="badge-status-pending">{accion}</span>;
      } else {
        // Mantiene el badge como finish si la subetapa está finalizada
        return <span className="badge-status-finish">{accion}</span>;
      }
    }
    switch (nombre)
    {
      case "Subir oficio y su fecha para habilitar formulario GORE":
        path = estado === "finalizada" ? "/home/ver_minuta" : "subir_oficio";
        break;
      case "Completar formulario Sectorial":
        path = estado === "finalizada" ? "/home/ver_minuta" : "/home/formulario_sectorial/";
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
        {usuarios_gore.length > 0 && renderSubetapas(usuarios_gore)}
        { oficio_inicio_gore && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{ oficio_inicio_gore.nombre}</div>
            {renderButtonForSubetapa( oficio_inicio_gore,)}
          </div>
        )}
        {formularios_gore.length > 0 && renderSubetapas(formularios_gore)}
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