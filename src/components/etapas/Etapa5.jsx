import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa5 = ({ etapa }) =>
{
    const { userData } = useAuth(); // Asumiendo que useAuth retorna un objeto que contiene userData
    const userSubdere = userData?.perfil?.includes('SUBDERE');
    const userDipres = userData?.perfil?.includes('DIPRES'); // Verificamos si el usuario pertenece a DIPRES

    const {
        nombre_etapa,
        estado,
        usuario_notificado,
        oficio_inicio_dipres,
        minuta_gore,
        observacion_minuta_gore,
        fecha_ultima_modificacion,
        oficio_origen
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
        let buttonText = subetapa.accion;
        const isFinalizado = subetapa.estado === "finalizada";
        let icon = subetapa.estado === "finalizada" ? "visibility" : "draft";
        let path = "/"; // Ruta por defecto

        if (subetapa.nombre.includes("Notificar a") && isFinalizado)
        {
            if (estado === 'Aún no puede comenzar')
            {
                return <span className="badge-status-pending">{buttonText}</span>;
            } else
            {
                return <span className="badge-status-finish">{buttonText}</span>;
            }
        }
        if (userSubdere && subetapa.accion === "Subir oficio" && subetapa.estado === "revision")
        {
            path = `/home/estado_competencia/${etapa.id}/subir_segundo_oficio_dipres`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }

        if (userDipres && subetapa.accion === "Subir minuta" && subetapa.estado === "revision" && subetapa.id === 77)
        {
            path = `/home/minuta_dipres/${etapa.id}/segunda_minuta_dipres`; // Cambiamos aquí la ruta de redirección
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
        if (userSubdere && subetapa.accion === "Subir Observaciones" && subetapa.estado === "pendiente")
        {
            path = `/home/minuta_dipres/${etapa.id}/observaciones_subdere`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }

        if (subetapa.estado === "finalizada")
        {
            return (
                <a href={oficio_origen} target="_blank" rel="noopener noreferrer" className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </a>
            );
        }

        return (
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
                {estado === "En Estudio" && <Counter plazoDias={etapa.plazo_dias} tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
                <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
            </div>
        </div>
    );
};
