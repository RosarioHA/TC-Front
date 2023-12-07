export const Etapa1 = ({ etapaCompetencia }) => {
  const { estado, nombre_etapa, usuarios_vinculados, fecha_ultima_modificacion, ultimo_editor } = etapaCompetencia;

  // Determinar el texto del badge según el estado
  const badgeText = estado === "Finalizada" ? "Finalizada" : "Sin Usuarios designados";

  // Si no hay usuarios vinculados o no es un arreglo, manejar adecuadamente
  if (!Array.isArray(usuarios_vinculados)) {
    return <div>Error: Datos de usuarios vinculados no disponibles</div>;
  }

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div className="">
        {usuarios_vinculados.map((usuario, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{usuario.nombre}</div>
            <span className="badge-status-finish">{badgeText}</span>
          </div>
        ))}
        <div className="d-flex my-3">
          <div className="text-sans-p me-5">Etapa completada por: {ultimo_editor.nombre_completo}</div>
          <div className="text-sans-p ms-5 ps-5">Fecha última modificación: {fecha_ultima_modificacion}</div>
        </div>
      </div>
    </div>
  );
};