import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa3 = ({ etapa, idCompetencia, etapaDos }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userDipres = userData?.perfil?.includes('DIPRES');
  const userGore = userData?.perfil?.includes('GORE');

  const {
    nombre_etapa,
    estado,
    minuta_sectorial,
    observacion_minuta_sectorial,
    usuario_notificado,
    fecha_ultima_modificacion,
    oficio_inicio_dipres,
    oficio_origen
  } = etapa;

  if (!etapa) {
    return <div>Cargando...</div>;
  }

  const renderButtonOrBadgeForSubetapa = (subetapa) => {
    const isFinalizado = subetapa.estado === "finalizada";
    let buttonText = subetapa.accion;
    let icon = isFinalizado ? "visibility" : "draft";

    // Verificar si el estado general es 'Omitida'
    if (estado === "Omitida") {
      return <span className="badge-status-pending">{buttonText}</span>;
    }

    const onClickAction = () => {
      if (subetapa.accion === "Subir Observaciones" && subetapa.nombre === "Revisión SUBDERE" && subetapa.estado === "revision" && userSubdere) {
        navigate(`/home/minuta_dipres/${idCompetencia}/observaciones_subdere`);
        return;
      }

      if (isFinalizado && subetapa.accion === "Ver oficio") {
        window.open(oficio_origen, '_blank');
      } else if (subetapa.accion === "Subir minuta" && subetapa.estado === "revision" && userDipres) {
        navigate(`/home/minuta_dipres/${idCompetencia}`);
      } else if (isFinalizado && subetapa.accion === "Ver minuta") {
        navigate(`/home/minuta_dipres/${idCompetencia}`);
      } else if (isFinalizado && subetapa.accion === "Ver Observaciones") {
        navigate(`/home/minuta_dipres/${idCompetencia}/observaciones_subdere`);
      } else if (etapaDos.estado === "Finalizada") {
        navigate(`/home/estado_competencia/${idCompetencia}/subir_oficio_dipres`);
      }
    };

    const isDisabled = !(isFinalizado && subetapa.accion === "Ver minuta") &&
      !((subetapa.estado === "revision" && userSubdere && subetapa.nombre.includes("Subir oficio") && etapaDos.estado === "Finalizada") ||
        (isFinalizado && subetapa.accion === "Ver oficio" && !userGore) ||  // Disable "Ver oficio" if the user is GORE
        (subetapa.accion === "Subir Observaciones" && userSubdere && subetapa.estado === "revision") ||
        (subetapa.accion === "Subir minuta" && userDipres && subetapa.estado === "revision") ||
        (isFinalizado && subetapa.accion === "Ver Observaciones"));

    return !isDisabled ? (
      <button onClick={onClickAction} className="btn-secundario-s text-decoration-none" id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      <button className="btn-secundario-s disabled" id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    );
  };

  const handleClick = (usuario) => {
    if (usuario.estado === "pendiente") {
      navigate(`/home/editar_competencia/${idCompetencia}`);
    }
  };

  const renderNotificacionUsuario = (usuario) => {
    const isFinalizado = usuario.estado === "finalizada";
    const icon = isFinalizado ? "visibility" : "person_add";
    const isPending = etapaDos.estado !== "Finalizada";

    // Verificar si el estado general es 'Omitida'
    if (estado === "Omitida") {
      return (
        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario.nombre}</div>
          <span className="badge-status-pending">{usuario.accion}</span>
        </div>
      );
    }

    if (isFinalizado && !isPending) {
      return (
        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario.nombre}</div>
          <span className="badge-status-finish">{usuario.accion}</span>
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
        <div className="align-self-center">{usuario.nombre}</div>
        {isPending ? (
          <span className="badge-status-pending">{usuario.accion}</span>
        ) : (
          <button onClick={() => handleClick(usuario)} className="btn-secundario-s text-decoration-none" disabled={isPending}>
            <span className="material-symbols-outlined me-1">{icon}</span>
            <u>{usuario.accion}</u>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {usuario_notificado && usuario_notificado.nombre.includes("Notificar a") && renderNotificacionUsuario(usuario_notificado)}
        {[oficio_inicio_dipres, minuta_sectorial, observacion_minuta_sectorial].map((subetapa, index) => (
          <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{subetapa.nombre}</div>
            {renderButtonOrBadgeForSubetapa(subetapa)}
          </div>
        ))}
        {estado !== "Aún no puede comenzar" && <Counter plazoDias={etapa.plazo_dias} tiempoTranscurrido={etapa.calcular_tiempo_transcurrido} />}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};
