import { Link } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Etapa5 = ({ etapa, idCompetencia, etapaCuatro }) => {
    const { userData } = useAuth();
    const userSubdere = userData?.perfil?.includes('SUBDERE');
    const userDipres = userData?.perfil?.includes('DIPRES');
    const navigate = useNavigate();

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

    if (!etapa) {
        return <div>Cargando...</div>;
    }

    const renderButtonForSubetapa = (subetapa) => {
        let buttonText = subetapa.accion;
        let icon = subetapa.estado === "finalizada" ? "visibility" : "draft";
        let path = "/";
        const isDisabled = subetapa.estado === "pendiente" || etapaCuatro.estado !== "Finalizada";

        const handleButtonClick = (event) => {
            if (isDisabled) {
                event.preventDefault(); // Previene la navegación si el botón está deshabilitado
            } else {
                navigate(path); // Usa el hook 'navigate' para redirigir
            }
        };

        // Condición específica para mostrar el botón activo para "Subir Observaciones"
        if (userSubdere && subetapa.accion === "Subir Observaciones" && subetapa.estado === "revision") {
            path = `/home/formulario_gore/${etapa.id}/observaciones_subdere`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }

        // Otros casos ya manejados en el código existente
        if (subetapa.nombre.includes("Notificar a") && subetapa.estado === "finalizada") {
            if (estado === 'Aún no puede comenzar') {
                return <span className="badge-status-pending">{buttonText}</span>;
            } else {
                return <span className="badge-status-finish">{buttonText}</span>;
            }
        }

        if (userSubdere && subetapa.accion === "Revisión SUBDERE" && subetapa.estado === "finalizada") {
            path = `/home/formulario_gore/${etapa.id}/observaciones_subdere`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
        if (userDipres && subetapa.accion === "Subir minuta" && subetapa.estado === "revision") {
            path = `/home/minuta_dipres/${idCompetencia}/segunda_minuta_dipres`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
        if (subetapa.accion === "Ver minuta" && subetapa.estado === "finalizada") {
            path = `/home/minuta_dipres/${idCompetencia}/segunda_minuta_dipres`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
        if (userSubdere && subetapa.accion === "Subir Observaciones" && subetapa.estado === "pendiente") {
            path = `/home/formulario_gore/${idCompetencia}/observaciones_subdere`;
            return (
                <button to={path} className="btn-secundario-s text-decoration-none disabled" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </button>
            );
        }
        if (subetapa.accion === "Ver Observaciones" && subetapa.estado === "finalizada") {
            path = `/home/formulario_gore/${idCompetencia}/observaciones_subdere`;
            return (
                <Link to={path} className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </Link>
            );
        }
        if (userSubdere && subetapa.accion === "Subir oficio" && subetapa.estado === "revision") {
            path = `/home/estado_competencia/${idCompetencia}/subir_segundo_oficio_dipres`;
            return (
                <button onClick={handleButtonClick} className={`btn-secundario-s text-decoration-none ${isDisabled ? 'disabled' : ''}`} id="btn" disabled={isDisabled}>
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </button>
            );
        }

        // Caso finalizado para el oficio
        if (subetapa.accion === "Ver oficio" && subetapa.estado === "finalizada") {
            return (
                <a href={oficio_origen} target="_blank" rel="noopener noreferrer" className="btn-secundario-s text-decoration-none" id="btn">
                    <span className="material-symbols-outlined me-1">{icon}</span>
                    <u>{buttonText}</u>
                </a>
            );
        }
    
        // Aplicar la clase disabled basado en la variable isDisabled
        return (
            <button className={`btn-secundario-s text-decoration-none ${isDisabled ? 'disabled' : ''}`} id="btn" disabled={isDisabled}>
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
                {estado !== "Aún no puede comenzar" && <Counter plazoDias={etapa.plazo_dias} tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
                <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
            </div>
        </div>
    );
};
