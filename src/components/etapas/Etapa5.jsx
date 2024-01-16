import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa5 = ({ etapa }) =>
{
    const {
        nombre_etapa,
        estado,
        usuario_notificado,
        oficio_inicio_dipres,
        minuta_gore,
        observacion_minuta_gore,
        fecha_ultima_modificacion
    } = etapa;

    const combinedSubetapas = [
        usuario_notificado,
        oficio_inicio_dipres,
        minuta_gore,
        observacion_minuta_gore
    ];

    if (!etapa)
    {
        return <div>Loading...</div>;
    }

    const renderButtonForSubetapa = (subetapa) => {
        let buttonText, icon, path = "/";
        const isFinalizado = subetapa.estado === "finalizada";
    
        buttonText = subetapa.accion; // Texto por defecto
        icon = isFinalizado ? "visibility" : "draft"; // Icono por defecto
    
        if (subetapa.nombre.startsWith("Notificar a") && isFinalizado) {
            if (estado === 'Aún no puede comenzar') {
                return <span className="badge-status-pending">{buttonText}</span>;
            } else {
                return <span className="badge-status-finish">{buttonText}</span>;
            }
        }
    
        // Uso directo del estado de 'etapa'
        return (estado === "Finalizada" || estado === "En Estudio") ? (
            <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                <span className="material-symbols-outlined me-1">{icon}</span>
                <u>{buttonText}</u>
            </Link>
        ) : (
            <button className="btn-secundario-s disabled" id="btn">
                <span className="material-symbols-outlined me-1">{icon}</span>
                <u>{buttonText}</u>
            </button>
        );
    };
    
    return (
        <div className="my-3">
        <div className="d-flex justify-content-between my-2 text-sans-p">
            Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
        </div>
        <div>
            {combinedSubetapas.map((subetapa, index) => (
                <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
                    <div className="align-self-center">{subetapa.nombre}</div>
                    {renderButtonForSubetapa(subetapa)}
                </div>
            ))}
            {estado === "En Estudio" && <Counter plazoDias={etapa.plazo_dias}
                tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
            <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
        </div>
    </div>
    );
};