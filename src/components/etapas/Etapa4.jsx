import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa4 = ({ etapa, etapaTres, idCompetencia }) => {
  const {
    nombre_etapa,
    estado,
    oficio_inicio_gore,
    usuarios_gore,
    formularios_gore,
    fecha_ultima_modificacion,
    oficio_origen
  } = etapa;

  const navigate = useNavigate();
  const { userData } = useAuth();
  const userRegionId = userData.region;
  const userProfile = userData.perfil;
  const userSubdere = userData?.perfil?.includes('SUBDERE');

  const [isUsuariosGoreCollapsed, setIsUsuariosGoreCollapsed] = useState(false);
  const [isFormulariosGoreCollapsed, setIsFormulariosGoreCollapsed] = useState(false);

  const toggleUsuariosGoreCollapse = () => {
    setIsUsuariosGoreCollapsed(!isUsuariosGoreCollapsed);
  };

  const toggleFormulariosGoreCollapse = () => {
    setIsFormulariosGoreCollapsed(!isFormulariosGoreCollapsed);
  };

  const renderBadgeOrButtonForUsuario = (usuario) => {
    if (userSubdere) {
      if (etapa.estado === "Aún no puede comenzar" && usuario.estado === "finalizada") {
        return <span className="badge-status-pending">{usuario.accion}</span>;
      } else if (etapa.estado !== "Aún no puede comenzar" && usuario.estado === "finalizada") {
        return <span className="badge-status-finish">{usuario.accion}</span>;
      }

      switch (usuario.estado) {
        case "pendiente":
          return <span className="badge-status-pending">{usuario.accion}</span>;
        case "revision":
          if (usuario.accion === "Asignar usuario") {
            return (
              <button
                className="btn-secundario-s text-decoration-none"
                onClick={() => navigate(`/home/editar_competencia/${idCompetencia}`)}
                id="btn">
                <span className="material-symbols-outlined me-1">person_add</span>
                <u>{usuario.accion}</u>
              </button>
            );
          } else {
            return <span className="badge-status-review">{usuario.accion}</span>;
          }
        default:
          return null;
      }
    } else {
      if (etapa.estado === "Aún no puede comenzar" && usuario.estado === "finalizada") {
        return <span className="badge-status-pending">{usuario.accion}</span>;
      } else if (etapa.estado !== "Aún no puede comenzar" && usuario.estado === "finalizada") {
        return <span className="badge-status-finish">{usuario.accion}</span>;
      }

      switch (usuario.estado) {
        case "pendiente":
          return <span className="badge-status-pending">{usuario.accion}</span>;
        case "revision":
          return <span className="badge-status-review">{usuario.accion}</span>;
        default:
          return null;
      }
    }
  };

  const renderUsuariosGore = () => {
    const usuariosParaRenderizar = usuarios_gore?.detalle_usuarios_gore_notificados || usuarios_gore || [];
    const detalleUsuarios = usuarios_gore?.usuarios_gore_notificados;

    if (usuariosParaRenderizar.length === 1) {
      const usuario = usuariosParaRenderizar[0];
      return (
        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario.nombre}</div>
          <div>{renderBadgeOrButtonForUsuario(usuario)}</div>
        </div>
      );
    } else if (usuariosParaRenderizar.length > 1) {
      return (
        <div className='w-100 border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0 my-1" onClick={toggleUsuariosGoreCollapse}>
            <span>{detalleUsuarios[0].nombre}</span>
            <div className="d-flex align-items-center">
              {etapa.estado === "Aún no puede comenzar" && detalleUsuarios[0].estado === "revision" ? (
                <span className="badge-status-pending">{detalleUsuarios[0].accion}</span>
              ) : etapa.estado !== "Aún no puede comenzar" && detalleUsuarios[0].estado === "revision" ? (
                <span className="badge-status-review">{detalleUsuarios[0].accion}</span>
              ) : etapa.estado === "Aún no puede comenzar" && detalleUsuarios[0].estado === "finalizada" ? (
                <span className="badge-status-pending">{detalleUsuarios[0].accion}</span>
              ) : detalleUsuarios[0].estado === "finalizada" ? (
                <span className="badge-status-finish">{detalleUsuarios[0].accion}</span>
              ) : (
                <span className={`badge-status-pending`}>{detalleUsuarios[0].accion}</span>
              )}
              <span className="material-symbols-outlined text-black">
                {isUsuariosGoreCollapsed ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </button>
          <div className={`collapse ${isUsuariosGoreCollapsed ? 'show' : ''}`}>
            <div className="card card-body border-0">
              <table className="table table-striped">
                <tbody>
                  {usuariosParaRenderizar.map((usuario, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="align-self-center my-1 col-8">{usuario.nombre}</span>
                        <div className="my-auto">{renderBadgeOrButtonForUsuario(usuario)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderButtonForSubetapa = (subetapa) => {
    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";

    if (nombre.startsWith("Notificar a") && estado === "finalizada") {
      if (etapa.estado === 'Aún no puede comenzar') {
        return <span className="badge-status-pending">{accion}</span>;
      } else {
        return <span className="badge-status-finish">{accion}</span>;
      }
    }

    const enableButtonForSubdere = (etapaTres.estado === "Finalizada" || etapaTres.estado === "Omitida") && userSubdere;

    if (nombre.includes("Subir oficio y su fecha para habilitar formulario GORE")) {
      if (estado === "finalizada") {
        return (
          <button onClick={() => window.open(oficio_origen, '_blank')} className="btn-secundario-s text-decoration-none" id="btn">
            <span className="material-symbols-outlined me-1">{icon}</span>
            <u>{buttonText}</u>
          </button>
        );
      } else {
        path = `/home/estado_competencia/${idCompetencia}/subir_oficio_gore/`;
        const isDisabled = (estado === "pendiente" || estado === "revision") && !enableButtonForSubdere;

        const handleButtonClick = () => {
          if (!isDisabled) {
            navigate(path, { state: { extraData: "GORE", seccion: 'etapa4' } });
          }
        };

        return (
          <button onClick={handleButtonClick} className={`btn-secundario-s text-decoration-none ${isDisabled ? 'disabled' : ''}`} id="btn">
            <span className="material-symbols-outlined me-1">{icon}</span>
            <u>{buttonText}</u>
          </button>
        );
      }
    }
  };

  const renderButtonForFormularioGore = (formulario) => {
    const basePath = `/home/formulario_gore/${formulario.id}`;
    let path, icon, buttonText, isButtonDisabled;

    switch (formulario.estado) {
      case "pendiente":
        buttonText = formulario.accion ;
        path = `${basePath}/paso_1`;
        icon = 'edit';
        isButtonDisabled = userProfile !== "GORE" || estado === 'Aún no puede comenzar';
        break;
      default:
        buttonText = formulario.accion;
        path = `${basePath}/paso_1`;
        icon = 'visibility';
        isButtonDisabled = estado === 'Aún no puede comenzar';
        break;
    }

    const handleNavigation = () => {
      navigate(path);
    };

    return (
      <button
        onClick={handleNavigation}
        className={`btn-secundario-s text-decoration-none ${isButtonDisabled ? 'disabled' : ''}`}
        id={`btn-formulario-${formulario.id}`}
        disabled={isButtonDisabled}
      >
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    );
  };

  const renderSingleFormularioGore = (formulario) => {
    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
        <span className="my-1">{formulario.nombre}</span>
        {renderButtonForFormularioGore(formulario)}
      </div>
    );
  };

  const renderFormulariosGore = () => {
    if (Array.isArray(formularios_gore) && formularios_gore.length === 1) {
      return renderSingleFormularioGore(formularios_gore[0]);
    }

    const { detalle_formularios_gore = [] } = formularios_gore || {};
    const formulariosParaRenderizar = userProfile === 'GORE'
      ? detalle_formularios_gore.filter(formulario => formulario.region_id === userRegionId)
      : detalle_formularios_gore;

    const formularioCompleto = formularios_gore.formularios_gore_completos[0];

    if (formulariosParaRenderizar.length === 1) {
      return renderSingleFormularioGore(formulariosParaRenderizar[0]);
    } if (formulariosParaRenderizar.length > 1 && userProfile !== 'GORE') {
      return (
        <div className='w-100 border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0 my-1" onClick={toggleFormulariosGoreCollapse}>
            <span>{formularioCompleto.nombre}</span>
            <div className="d-flex align-items-center">
              <span className={etapa.estado === "Aún no puede comenzar" ? "badge-status-pending" : (formularioCompleto.estado === "revision" ? "badge-status-review" : "badge-status-finish")}>
                {formularioCompleto.accion}
              </span>
              <span className="material-symbols-outlined text-black">
                {isFormulariosGoreCollapsed ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </button>
          <div className={`collapse ${isFormulariosGoreCollapsed ? 'show' : ''}`}>
            <div className="card card-body border-0">
              <table className="table table-striped">
                <tbody>
                  {formulariosParaRenderizar.map((formulario, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="my-2 col-8">{formulario.nombre}</span>
                        <div>{renderButtonForFormularioGore(formulario)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {renderUsuariosGore()}
        {oficio_inicio_gore && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{oficio_inicio_gore.nombre}</div>
            {renderButtonForSubetapa(oficio_inicio_gore)}
          </div>
        )}
        {renderFormulariosGore()}
        {estado !== "Aún no puede comenzar" && (
          <Counter
            plazoDias={etapa.plazo_dias}
            tiempoTranscurrido={etapa.calcular_tiempo_transcurrido}
          />
        )}
        <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
      </div>
    </div>
  );
};
