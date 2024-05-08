import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';


export const Etapa4 = ({ etapa, etapaTres, idCompetencia }) =>
{
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

  const [ isUsuariosGoreCollapsed, setIsUsuariosGoreCollapsed ] = useState(false);
  const [ isFormulariosGoreCollapsed, setIsFormulariosGoreCollapsed ] = useState(false);

  // const isStageDisabled = estado === "Aún no puede comenzar" || !(etapaTres.estado === "Finalizada" || etapaTres.estado === "Omitida");

  // Función para alternar el collapse de Usuarios GORE
  const toggleUsuariosGoreCollapse = () =>
  {
    setIsUsuariosGoreCollapsed(!isUsuariosGoreCollapsed);
  };

  // Función para alternar el collapse de Formularios GORE
  const toggleFormulariosGoreCollapse = () =>
  {
    setIsFormulariosGoreCollapsed(!isFormulariosGoreCollapsed);
  };

  const renderBadgeOrButtonForUsuario = (usuario) =>
  {
    // Verifica si el usuario tiene el perfil SUBDERE
    if (userSubdere)
    {
      // Aquí agregamos las condiciones específicas para mostrar los badges según tu descripción
      if (etapa.estado === "Aún no puede comenzar" && usuario.estado === "finalizada")
      {
        return <span className="badge-status-pending">{usuario.accion}</span>;
      } else if (etapa.estado !== "Aún no puede comenzar" && usuario.estado === "finalizada")
      {
        return <span className="badge-status-finish">{usuario.accion}</span>;
      }

      switch (usuario.estado)
      {
        case "pendiente":
          return <span className="badge-status-pending">{usuario.accion}</span>;
        case "revision":
          if (usuario.accion === "Asignar usuario")
          {
            return (
              <button
                className="btn-secundario-s text-decoration-none"
                onClick={() => navigate(`/home/editar_competencia/${idCompetencia}`)}
                id="btn">
                <span className="material-symbols-outlined me-1">person_add</span>
                <u>{usuario.accion}</u>
              </button>
            );
          } else
          {
            return <span className="badge-status-review">{usuario.accion}</span>;
          }
        default:
          return null; // Para otros estados no especificados
      }
    } else
    {
      // Si no es SUBDERE, muestra solo el estado del usuario sin botones activos
      if (etapa.estado === "Aún no puede comenzar" && usuario.estado === "finalizada")
      {
        return <span className="badge-status-pending">{usuario.accion}</span>;
      } else if (etapa.estado !== "Aún no puede comenzar" && usuario.estado === "finalizada")
      {
        return <span className="badge-status-finish">{usuario.accion}</span>;
      }

      switch (usuario.estado)
      {
        case "pendiente":
          return <span className="badge-status-pending">{usuario.accion}</span>;
        case "revision":
          return <span className="badge-status-review">{usuario.accion}</span>;
        default:
          return null; // Para otros estados no especificados
      }
    }
  };


  const renderUsuariosGore = () => {
    const usuariosParaRenderizar = usuarios_gore?.detalle_usuarios_gore_notificados || usuarios_gore || [];
  
    if (usuariosParaRenderizar.length === 1) {
      const usuario = usuariosParaRenderizar[0];
      return (
        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario.nombre}</div>
          {renderBadgeOrButtonForUsuario(usuario)}
        </div>
      );
    } else if (usuariosParaRenderizar.length > 1) {
      return (
        <div className='w-100 border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0 my-1" onClick={toggleUsuariosGoreCollapse}>
            <span>{usuariosParaRenderizar[0].nombre}</span>
            <div className="d-flex align-items-center">
              {
                etapa.estado === "Aún no puede comenzar" && usuariosParaRenderizar[0].estado === "revision" ? (
                  <span className="badge-status-pending">{usuariosParaRenderizar[0].accion}</span>
                ) : etapa.estado !== "Aún no puede comenzar" && usuariosParaRenderizar[0].estado === "revision" ? (
                  <span className="badge-status-pending">{usuariosParaRenderizar[0].accion}</span>
                ) : usuariosParaRenderizar[0].estado === "finalizada" ? (
                  <span className="badge-status-finish">{usuariosParaRenderizar[0].accion}</span>
                ) : (
                  <span className={`badge-status-${usuariosParaRenderizar[0].estado}`}>{usuariosParaRenderizar[0].accion}</span>
                )
              }
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
                        <span className="align-self-center my-1">{usuario.nombre}</span>
                        {renderBadgeOrButtonForUsuario(usuario)}
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


  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";

    // Manejo de casos específicos y asignación del path correcto
    if (nombre.startsWith("Notificar a") && estado === "finalizada")
    {
      if (etapa.estado === 'Aún no puede comenzar')
      {
        return <span className="badge-status-pending">{accion}</span>;
      } else
      {
        return <span className="badge-status-finish">{accion}</span>;
      }
    }

    // Condición revisada para habilitación del botón
    const enableButtonForSubdere = (etapaTres.estado === "Finalizada" || etapaTres.estado === "Omitida") && userSubdere;

    // Manejo del botón para subir oficio
    if (nombre.includes("Subir oficio y su fecha para habilitar formulario GORE"))
    {
      if (estado === "finalizada")
      {
        return (
          <button onClick={() => window.open(oficio_origen, '_blank')} className="btn-secundario-s text-decoration-none" id="btn">
            <span className="material-symbols-outlined me-1">{icon}</span>
            <u>{buttonText}</u>
          </button>
        );
      } else
      {
        // Determinar la ruta y si el botón debe estar deshabilitado
        path = `/home/estado_competencia/${etapa.id}/subir_oficio_gore/`;
        const isDisabled = (estado === "pendiente" || estado === "revision") && !enableButtonForSubdere;

        // Manejar el clic en el botón para navegar
        const handleButtonClick = () =>
        {
          if (!isDisabled)
          { // Solo navegar si el botón no está deshabilitado
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
  }

  const renderButtonForFormularioGore = (formulario) =>
  {
    // Define la ruta base para el formulario, esto puede ajustarse según tu enrutamiento
    const basePath = `/home/formulario_gore/${formulario.id}`;

    // Determina el estado del botón basándote en el estado del formulario y el perfil del usuario
    let path, icon, buttonText, isButtonDisabled;

    switch (formulario.estado)
    {
      case "pendiente":
        buttonText = formulario.accion || "Completar";
        path = `${basePath}/paso_1`; // Asumiendo que "paso_1" es el inicio del formulario
        icon = 'edit';
        isButtonDisabled = userProfile !== "GORE"; 
        break;
      // Agrega más casos según otros estados posibles
      default:
        buttonText = "Ver Detalles";
        path = `${basePath}/paso_1`;
        icon = 'visibility';
        isButtonDisabled = false;
        break;
    }
    // Función para manejar la navegación
    const handleNavigation = () =>
    {
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

  const renderSingleFormularioGore = (formulario) =>
  {
    // Aquí utilizamos la lógica específica para renderizar un único formulario
    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
        <span className="my-1">{formulario.nombre}</span>
        {renderButtonForFormularioGore(formulario)}
      </div>
    );
  };


  const renderFormulariosGore = () => {
    // Verifica si formularios_gore es un array directamente, indicando solo un formulario.
    if (Array.isArray(formularios_gore) && formularios_gore.length === 1) {
      return renderSingleFormularioGore(formularios_gore[0]);
    }
  
    // En caso de que formularios_gore contenga las propiedades para múltiples formularios
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
              {/* Modificación aquí para ajustar el badge según el estado de la etapa */}
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
                        <span className="my-2">{formulario.nombre}</span>
                        {renderButtonForFormularioGore(formulario)}
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
            {renderButtonForSubetapa(oficio_inicio_gore,)}
          </div>
        )}
        {renderFormulariosGore()}
        {estado === "En Estudio" && (
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