export const Etapa1 = ({ etapa }) => {
  const { nombre_etapa, estado, usuarios_vinculados, fecha_ultima_modificacion, ultimo_editor } = etapa;

console.log("etapa1",etapa);
  const badgeText = estado === "Finalizada" ? "Finalizada" : "En Progreso";

  if (!Array.isArray(usuarios_vinculados) || usuarios_vinculados.length === 0) {
    return <div>Error: No hay usuarios vinculados o datos no disponibles</div>;
  }

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        {nombre_etapa} - {estado}
      </div>
      <div>
        {usuarios_vinculados.map((usuario, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{usuario.nombre}</div>
            <span className="badge-status-finish">{badgeText}</span>
          </div>
        ))}
        <div className="d-flex my-3">
          <div className="text-sans-p me-5">Última modificación por: {ultimo_editor.nombre_completo}</div>
          <div className="text-sans-p ms-5 ps-5">Fecha última modificación: {fecha_ultima_modificacion}</div>
        </div>
      </div>
    </div>
  );
};