import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa4 = ({ etapaCompetencia }) =>
{
  const {
    nombre_etapa,
    estado,
    usuarios_gore,
    formularios_gore,
    fecha_ultima_modificacion
  } = etapaCompetencia;


  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";


    if (nombre.startsWith("Notificar a") && estado === "finalizada")
    {
      return <span className="badge-status-finish">{accion}</span>;
    }

    switch (nombre)
    {
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
        {formularios_gore.length > 0 && renderSubetapas(formularios_gore)}
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