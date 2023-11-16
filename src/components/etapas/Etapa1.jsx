export const Etapa1 = ({ etapaCompetencia }) => {
  // Acceder a las propiedades anidadas de etapaCompetencia
  const { estado, etapa, subetapas } = etapaCompetencia;

  // Determinar el texto del badge según el estado
  const badgeText = estado === "Finalizado" ? "Finalizada" : "";

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar el {etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div className="">
        {subetapas.map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div  className="align-self-center"> {subetapa.nombre}</div><span className="badge-status-finish">{badgeText}</span>
          </div>
        ))}
        <div className="d-flex my-3">
          <div className="text-sans-p me-5">Etapa completada por: $UserName</div>
          <div className="text-sans-p ms-5 ps-5">Fecha última modificación: $lastModified</div>
        </div>
      </div>
    </div>
  );
};