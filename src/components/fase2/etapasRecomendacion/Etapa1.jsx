import { Link } from 'react-router-dom';

export const Etapa1Recomendacion = ({ etapa, id }) => {
  const { competencia_creada, usuarios_vinculados, fecha_ultima_modificacion, ultimo_editor } = etapa;

  return (
    <div className="my-3">
      <div>
        {competencia_creada && competencia_creada.length > 0 && competencia_creada.map((competencia, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{competencia.nombre}</div>
            <span className="badge-status-finish">{competencia.accion}</span>
          </div>
        ))}

        <h1>{etapa.nombre_etapa}</h1>
        {/* Manejar usuarios_vinculados que es un objeto individual */}
        {/* <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">nombre</div>
            
          </div> */}
        {usuarios_vinculados && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{usuarios_vinculados.nombre}</div>
            {usuarios_vinculados.accion === "Editar usuario(s)" ? (
              <Link to={`/home/editar_competencia/${id}`} className="btn-secundario-s text-decoration-none" id="btn">
                <span className="material-symbols-outlined me-1">folder</span>
                <u>{usuarios_vinculados.accion}</u>
              </Link>
            ) : (
              <span className="badge-status-finish">{usuarios_vinculados.accion}</span>
            )}
          </div>
        )}

        <div className="d-flex my-3">
          <div className="text-sans-p me-5">Última modificación por: {ultimo_editor.nombre_completo}</div>
          <div className="text-sans-p ms-5 ps-5">Fecha última modificación: {fecha_ultima_modificacion}</div>
        </div>
      </div>
    </div>
  );
};
