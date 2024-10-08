import { Link } from 'react-router-dom';

export const Etapa2Recomendacion = ({ etapa }) => {
  const { calcular_tiempo_transcurrido, fecha_ultima_modificacion, formulario_plazos, estado } = etapa;

  console.log("etapa dentro de etapa2", etapa)

  return (
    <div className="my-3">
      <div>
        <div className="d-flex justify-content-between text-sans-p my-3 py-1">
          <div className="align-self-center">Para completar esta etapa con éxito deben cumplirse estas condiciones:</div>  
        </div>

        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">Recomendación de transferencia post-CID</div>
          {estado === 'En Estudio' ? (
            <Link to={`/home/`} className="btn-secundario-s text-decoration-none" id="btn">
              <span className="material-symbols-outlined me-1">insert_drive_file</span>
              <u>{formulario_plazos?.accion}</u>
            </Link>
          ) : (
            <button className="btn-secundario-s text-decoration-none" id="btn" disabled>
              <span className="material-symbols-outlined me-1">insert_drive_file</span>
              <u>{formulario_plazos?.accion}</u>
            </button>
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
