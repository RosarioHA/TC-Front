import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa2 = ({ etapaCompetencia }) => {
  const { etapa, subetapas } = etapaCompetencia;

  const SubetapaButton = ({ subetapa }) => {
    let buttonText = "Acción"; // Valor por defecto
    let path = "/";
    const isDisabled = subetapa.estado === "Pendiente";

    switch (subetapa.nombre) {
      case "Completar formulario sectorial":
        buttonText = "Completar formulario";
        path = "/home/formulario_sectorial";
        break;
      case "Revisión SUBDERE":
        buttonText = "Subir observaciones";
        path = "/home/ingresar_observaciones";
        break;
      // Añadir más casos según sea necesario
    }

    if (isDisabled) {
      return (
        <button className="btn-secundario-s" disabled>
          <u>{buttonText}</u>
        </button>
      );
    } else {
      return (
        <Link to={path} className="btn-secundario-s">
          <u>{buttonText}</u>
        </Link>
      );
    }
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {subetapas.map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div  className="align-self-center"> {subetapa.nombre} </div>
            {subetapa.estado === "Finalizado" ? (
              <span className="badge-status-finish">Finalizada</span>
            ) : (
              <SubetapaButton subetapa={subetapa} />
            )}
          </div>
        ))}
        {etapaCompetencia.estado === "En Estudio" && <Counter />}
        <div className="text-sans-p">Fecha última modificación: $lastModified</div>
      </div>
    </div>
  );
};
