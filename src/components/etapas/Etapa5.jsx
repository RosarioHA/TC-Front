import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa5 = ({ etapaCompetencia }) => {
    console.log('etapa5', etapaCompetencia);
    const { nombre_etapa, estado, minuta_sectorial, observacion_minuta_sectorial, usuario_notificado, fecha_ultima_modificacion } = etapaCompetencia;

    // Combina todas las subetapas en un solo arreglo
    const subetapas = [usuario_notificado, minuta_sectorial, observacion_minuta_sectorial ];

    const SubetapaButton = ({ subetapa }) => {
        let buttonText, icon, path = "/";
        const isFinalizado = subetapa.estado === "Finalizada";
        const isDisabled = subetapa.estado === "Pendiente";

        switch (subetapa.nombre) {
            case "Subir minuta":
                buttonText = isFinalizado ? "Ver Minuta" : "Subir Minuta";
                path = isFinalizado ? "/home/ver_minuta" : "/home/agregar_minuta";
                break;
            case "Subir Observaciones":
                buttonText = isFinalizado ? "Ver Observaciones" : "Subir Observaciones";
                path = isFinalizado ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
                break;
            case "Notificar a DIPRES":
                buttonText = isFinalizado ? "Finalizada" : "Agregar Usuario";
                break;
            default:
                buttonText = "Acción";
        }

        icon = isFinalizado ? "check" : "edit";

        if (isFinalizado) {
            return <span className="badge-status-finish">{buttonText}</span>;
        } else {
            return (
                <Link to={path} className={`btn-secundario-s text-decoration-none ${isDisabled ? "disabled" : ""}`} id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
    };

    return (
        <div className="my-3">
            <div className="d-flex justify-content-between my-2 text-sans-p">
                Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
            </div>
            <div>
                {subetapas.map((subetapa, index) => (
                    <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
                        <div className="align-self-center">
                            {subetapa.nombre}
                        </div>
                        <SubetapaButton subetapa={subetapa} />
                    </div>
                ))}
                {estado === "En Estudio" && <Counter />}
                <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
            </div>
        </div>
    );
};