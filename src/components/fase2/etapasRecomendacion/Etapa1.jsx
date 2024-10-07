import { Link } from 'react-router-dom';

export const Etapa1Recomendacion = ({ etapa }) => {
  const { usuario_notificado, fecha_ultima_modificacion, calcular_tiempo_transcurrido, formulario_recomendacion } = etapa;

  console.log("etapa dentro de etapa1", etapa)

  return (
    <div className="my-3">
      <div>
        <div className="d-flex justify-content-between text-sans-p my-3 py-1">
          <div className="align-self-center">Para completar esta etapa con éxito deben cumplirse estas condiciones:</div>  
        </div>

        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">Recomendación de transferencia post-CID</div>
          <Link to={`/home/`} className="btn-secundario-s text-decoration-none" id="btn">
            <span className="material-symbols-outlined me-1">insert_drive_file</span>
            <u>{formulario_recomendacion?.accion}</u>
          </Link>
        </div>

        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario_notificado?.nombre}</div>
          {usuario_notificado?.estado === "finalizado" ? (
            <span className="badge-status-finish">{usuario_notificado?.estado}</span>  
            ) : (
            <Link to={`/home/`} className="btn-secundario-s text-decoration-none" id="btn">
              {/* <span className="material-symbols-outlined me-1">folder</span> */}
              <u>{usuario_notificado?.accion}</u>
            </Link>
          )}
        </div>

        <div className="my-3">
          <div className="text-sans-p mb-3 mt-4">
            Tiempo transcurrido:  
            <b> {calcular_tiempo_transcurrido?.dias} días {calcular_tiempo_transcurrido?.horas} horas {calcular_tiempo_transcurrido?.minutos} minutos </b>
          </div>
          <div className="text-sans-p">Fecha última modificación: <b> {fecha_ultima_modificacion}</b></div>
        </div>
      </div>
    </div>
  );
};
