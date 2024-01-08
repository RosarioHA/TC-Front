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

    const renderButtonForSubetapa = (subetapa) =>
    {
        const etapaActivada = estado === "Finalizada" || estado === "En Estudio";
        let buttonText, icon, path = "/";
        const isFinalizado = subetapa.estado === "finalizada";
        const isDisabled = subetapa.estado === "pendiente";
        const isRevision = subetapa.estado === "revision";

        buttonText = subetapa.accion; // Texto por defecto
        icon = isFinalizado ? "visibility" : "draft"; // Icono por defecto

        switch (subetapa.nombre)
        {
            case "Notificar a Juan Carlos Santiago (juan@gmail.com)":
                path = isFinalizado ? "/home/ver_oficio" : "/"; // Ajusta según necesites
                break;
            case "Subir oficio y su fecha para habilitar minuta DIPRES":
                path = isRevision ? "/home/subir_oficio" : "/home/ver_oficio";
                break;
            case "Subir minuta":
                path = isDisabled ? "/home/agregar_minuta" : "/home/ver_minuta";
                break;
            case "Revisión SUBDERE":
                path = isDisabled ? "/home/ingresar_observaciones" : "/home/ver_observaciones";
                break;
            // Agrega más casos según sea necesario
        }

        return etapaActivada ? (
            // Si la etapa está activa, mostramos los botones según su estado individual
            <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                <span className="material-symbols-outlined me-1">{icon}</span>
                <u>{buttonText}</u>
            </Link>
        ) : (
            // Si la etapa no está activa, todos los botones se deshabilitan
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