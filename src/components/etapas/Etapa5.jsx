import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";

export const Etapa5 = ({ etapaCompetencia }) =>
{
    const { nombre_etapa, estado, minuta_sectorial, observacion_minuta_sectorial, usuario_notificado, fecha_ultima_modificacion } = etapaCompetencia;


    // Combina todas las subetapas en un solo arreglo
    const combinedSubetapas = [
        usuario_notificado,
        minuta_sectorial,
        observacion_minuta_sectorial ];


    const renderButtonForSubetapa = (subetapa) =>
    {
        let buttonText, icon, path = "/";
        const isFinalizado = subetapa.estado === "finalizada";
        const isDisabled = subetapa.estado === "pendiente";
        const isRevision = subetapa.estado === "revision";

        if (subetapa.nombre.startsWith("Notificar a DIPRES") && isFinalizado)
        {
            return <span className="badge-status-finish">{subetapa.accion}</span>;
        }
        switch (subetapa.nombre)
        {
            case "Notificar a DIPRES":
                if (isFinalizado)
                {
                    buttonText = subetapa.accion;

                } else if (isRevision)
                {
                    buttonText = subetapa.accion;
                    icon = "draft";
                } else
                {
                    buttonText = subetapa.accion;
                    icon = "draft";
                }
                break;
            case "Subir minuta":
                buttonText = isFinalizado ? subetapa.accion : subetapa.accion;
                path = isFinalizado ? "/home/ver_minuta" : "/home/agregar_minuta";
                icon = isFinalizado ? "visibility" : "draft"
                break;
            case "Subir Observaciones":
                buttonText = isFinalizado ? subetapa.accion : subetapa.accion;
                path = isFinalizado ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
                icon = isFinalizado ? "visibility" : "draft"
                break;
        }

        // Aquí puedes ajustar el comportamiento del botón basado en si está en revisión
        if (isDisabled || isRevision)
        {
            return (
                <button className={`btn-secundario-s ${isDisabled ? "disabled" : ""}`} id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </button>
            );
        } else
        {
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
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
                {combinedSubetapas.map((subetapa, index) => (
                    <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
                        <div className="align-self-center">{subetapa.nombre}</div>
                        {renderButtonForSubetapa(subetapa)}
                    </div>
                ))}
                {estado === "En Estudio" && <Counter plazoDias={etapaCompetencia.plazo_dias}
                    tiempoTranscurrido={etapaCompetencia.calcular_tiempo_transcurrido} />}
                <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
            </div>
        </div>
    );
};