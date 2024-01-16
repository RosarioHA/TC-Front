export const Etapa1 = ({ etapa }) => {
  const { competencia_creada, usuarios_vinculados, fecha_ultima_modificacion, ultimo_editor } = etapa;

  return (
    <div className="my-3">

      <div>
        {/* Manejar competencia_creada que es un array */}
        {competencia_creada && competencia_creada.length > 0 && competencia_creada.map((competencia, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{competencia.nombre}</div>
            <span className="badge-status-finish">{competencia.accion}</span>
          </div>
        ))}

        {/* Manejar usuarios_vinculados que es un objeto individual */}
        {usuarios_vinculados && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{usuarios_vinculados.nombre}</div>
            <span className="badge-status-finish">{usuarios_vinculados.accion}</span>
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
