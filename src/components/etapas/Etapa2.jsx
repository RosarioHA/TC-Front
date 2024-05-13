import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa2 = ({ etapa, idCompetencia }) =>
{
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userGore = userData?.perfil?.includes('GORE');
  const [ isCollapsed, setIsCollapsed ] = useState(false);
  const usuarioSector = userData?.sector;

  const toggleCollapse = () =>
  {
    setIsCollapsed(!isCollapsed);
  };
  const {
    nombre_etapa,
    estado,
    oficio_inicio_sectorial,
    observaciones_sectorial,
    fecha_ultima_modificacion,
    usuarios_notificados,
    oficio_origen,
    formulario_sectorial
  } = etapa;

  const accionFormulario = formulario_sectorial?.formularios_sectoriales?.[ 0 ];
  const estadoObservaciones = observaciones_sectorial.resumen_observaciones_sectoriales?.[ 0 ];
  const estadoObservacion = observaciones_sectorial[ 0 ];


  const usuariosNotificadosDetalles = usuarios_notificados?.detalle_usuarios_notificados || [];

  const renderBadge  = (usuario) => {
    switch (usuario.estado) {
      case "finalizada":
        return <span className="badge-status-finish">{usuario.accion}</span>;
      case "pendiente":
        return <span className="badge-status-pending">{usuario.accion}</span>; // Mostrar este badge si el estado es "pendiente"
      case "revision":
        return <span className="badge-status-review">{usuario.accion}</span>;
      default:
        return null; // No badge si no cumple ninguna de las condiciones anteriores
    }
  };

  const renderBadgeForEstado = (estado) =>
  {
    switch (estado)
    {
      case "finalizada":
        return <span className="badge-status-finish">{accionFormulario.accion}</span>;
      case "revision":
        return <span className="badge-status-review">{accionFormulario.accion}</span>;
      case "pendiente":
        return <span className="badge-status-pending">{accionFormulario.accion}</span>;
      default:
        return null;
    }
  };

  const handleNavigation = (path) =>
  {
    navigate(path);
  };

  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre,
      //  id: subetapaId 
    } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";
    const formularios = formulario_sectorial && formulario_sectorial?.formularios_sectoriales && formulario_sectorial.formularios_sectoriales.length > 0 ? formulario_sectorial.formularios_sectoriales[0] : null;
    let isDisabled = estado === "pendiente" || (formularios && formularios?.estado !== "finalizada");

    if (nombre.includes("Observaciones de formularios sectoriales") || nombre.includes("Observación del formulario sectorial")) {
      isDisabled = formularios && formularios?.estado !== "finalizada";
    }


    const userMinisterio = userData?.perfil?.includes('Ministerio');
    const userGobiernoRegional = userData?.perfil?.includes('Gobierno Regional');

    // Condiciones de habilitación extendidas para incluir más roles
    const isButtonEnabled = (userSubdere || userGore || userMinisterio || userGobiernoRegional) && (estado === "pendiente" || estado === "revision" || estado === "finalizada");

    switch (true)
    {
      case nombre.startsWith("Notificar a") && estado === "finalizada":
        if (etapa.estado === 'Aún no puede comenzar')
        {
          return <span className="badge-status-pending">{accion}</span>;
        } else
        {
          return <span className="badge-status-finish">{accion}</span>;
        }

      case nombre.includes("Subir oficio y su fecha para habilitar formulario sectorial"):
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
          path = `/home/estado_competencia/${idCompetencia}/subir_oficio_sectorial`;
        } break;
      case nombre.includes("Observaciones de formularios sectoriales"):
        // Adaptar el path y las condiciones para otros roles también, si necesario
        path = estado === "revision" ? `/home/observaciones_subdere/${idCompetencia}/` : `/home/observaciones_subdere/${idCompetencia}/`;
        buttonText = accion;
        icon = estado === "revision" ? "draft" : "visibility";
        isDisabled = formularios?.estado !== "finalizada";
        break;
        case nombre.includes("Observación del formulario sectorial"):
          // Establecer el path. Considerar diferentes rutas si es necesario para otros roles.
          path = `/home/observaciones_subdere/${idCompetencia}/`;
        
          // Establecer el texto y el icono del botón basado en el estado.
          buttonText = accion;
          icon = estado === "revision" ? "draft" : "visibility";
        
          // Habilitar el botón específicamente cuando el estado es 'revision'.
          // El botón estará deshabilitado únicamente si el formulario no está finalizado y el estado no es 'revision'.
          isDisabled = estado !== "revision" && formularios?.estado === "finalizada";
        
          break;

      default:
        break;
    }
    if (isButtonEnabled)
    {
      return (
        <button onClick={() => handleNavigation(path, { state: { extraData: "Sectorial", seccion: "etapa2" } })}
          className={`btn-secundario-s text-decoration-none ${isDisabled ? 'disabled' : ''}`} id="btn"
          disabled={isDisabled}>
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    } else
    {
      return (
        <button className="btn-secundario-s disabled" id="btn" disabled>
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    }
  };


  // AQUI DECIR A LA FUNCION QUE RECONOZCA SI EL BOTON ESTA EN ESTADO FINALIZADO  

  const renderButtonForFormularioSectorial = (formulario) =>
  {
    const buttonText = formulario.accion;
    const path = `/home/formulario_sectorial/${formulario.id}/paso_1`;

    // Determinar si el botón debe estar deshabilitado
    const isButtonDisabled = formulario.estado === "pendiente";

    // Elegir el icono basado en el estado del formulario
    let icon;
    if (formulario.estado === "finalizada")
    {
      icon = 'visibility';  // Icono de visibilidad para formularios finalizados
    } else if (formulario.estado === "pendiente")
    {
      icon = 'edit';  // Icono de edición para formularios pendientes
    } else
    {
      icon = 'draft';  // Icono de borrador para otros estados
    }

    return (
      <button
        onClick={() => handleNavigation(path)}
        className={`btn-secundario-s text-decoration-none ${isButtonDisabled ? 'disabled' : ''}`}
        id={`btn-formulario-${formulario.id}`}
        disabled={isButtonDisabled}
      >
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    );
  };

  const renderSingleFormularioSectorial = (formulario) =>
  {
    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
        <div className="align-self-center">{formulario.nombre}</div>
        {renderButtonForFormularioSectorial(formulario)}
      </div>
    );
  };


  const renderUsuariosNotificados = () =>
  {
    if (usuarios_notificados && usuarios_notificados.length === 1)
    {
      const usuario = usuarios_notificados[ 0 ];
      return (
        <div className="usuario-notificado d-flex justify-content-between py-2 my-1 border-top border-bottom">
          <span>{usuario.nombre}</span>
          {renderBadge(usuario)}
        </div>
      );
    } else if (usuariosNotificadosDetalles.length > 0)
    {
      return usuariosNotificadosDetalles.map((usuario, index) => (
        <div key={index} className="usuario-notificado d-flex justify-content-between py-2 my-1 border-top border-bottom">
          <span>{usuario.nombre}</span>
          {usuario.estado === "revision" && userSubdere ? (
            <button
              className="btn-secundario-s"
              onClick={() => navigate(`/home/editar_competencia/${idCompetencia}`)}
            >
              <span className="material-symbols-outlined me-2">person_add</span>
              <u>{usuario.accion}</u>
            </button>
          ) : (
            renderBadge(usuario)
          )}
        </div>
      ));
    }
    return null;
  };


  const renderFormularioSectorial = () =>
  {
    if (!userSubdere && !userGore)
    {
      return null; // No renderizar nada si el usuario no es SUBDERE ni GORE
    }
    // Verifica si el array formulario_sectorial tiene un solo elemento
    if (etapa.formulario_sectorial && etapa.formulario_sectorial.length === 1)
    {
      const formulario = etapa.formulario_sectorial[ 0 ];
      return renderSingleFormularioSectorial(formulario);
    }
    // Verifica si el array detalle_formularios_sectoriales tiene elementos
    else if (etapa.formulario_sectorial.detalle_formularios_sectoriales && etapa.formulario_sectorial.detalle_formularios_sectoriales.length > 0)
    {
      const info = etapa.formulario_sectorial.formularios_sectoriales[ 0 ];

      return (
        <div className='w-100 boder border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0" onClick={toggleCollapse}>
            <span>{info.nombre}</span>
            <div className="d-flex align-items-center">
              {renderBadgeForEstado(info.estado)}
              <span className="material-symbols-outlined text-black">
                {isCollapsed ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </button>
          <div className={`collapse ${isCollapsed ? 'show' : ''}`}>
            <div className="card card-body border-0">
              <table className="table table-striped">
                <tbody>
                  {etapa.formulario_sectorial.detalle_formularios_sectoriales.map((formulario, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="align-self-center">{formulario.nombre}</span>
                        {formulario.estado ?
                          renderButtonForFormularioSectorial(formulario)
                          : formulario.accion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else
    {
      return <div>No hay formularios sectoriales para mostrar.</div>;
    }
  };

  const renderFormularioSectorialParaUsuarioSectorial = () =>
  {
    // Verificación para asegurar que el usuario no es SUBDERE y es un usuario sectorial
    if (userSubdere || !usuarioSector)
    {
      return null; // No renderizar nada si el usuario es SUBDERE o no tiene sector asignado
    }

    let formulariosFiltrados = [];

    // Verifica si etapa.formulario_sectorial es un arreglo directamente
    if (Array.isArray(etapa.formulario_sectorial) && etapa.formulario_sectorial.length > 0)
    {
      // Trata etapa.formulario_sectorial como un arreglo de formularios
      formulariosFiltrados = etapa.formulario_sectorial.filter(formulario => formulario.sector_id === usuarioSector);
    } else if (etapa.formulario_sectorial?.detalle_formularios_sectoriales)
    {
      // Accede a detalle_formularios_sectoriales si la estructura es un objeto con esta propiedad
      formulariosFiltrados = etapa.formulario_sectorial.detalle_formularios_sectoriales.filter(formulario => formulario.sector_id === usuarioSector);
    }

    if (formulariosFiltrados.length > 0)
    {
      return formulariosFiltrados.map((formulario, index) => (
        <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
          <div className="align-self-center">{formulario.nombre}</div>
          {renderButtonForFormularioSectorial(formulario)}
        </div>
      ));
    } else
    {
      return <div>No hay formularios sectoriales asignados a tu sector.</div>;
    }
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {renderUsuariosNotificados()}
        {oficio_inicio_sectorial && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
            <div className="align-self-center">{oficio_inicio_sectorial.nombre}</div>
            {renderButtonForSubetapa(oficio_inicio_sectorial)}
          </div>
        )}
        {/* Llamada a las funciones de renderizado de formularios sectoriales */}
        {userSubdere || userGore ? renderFormularioSectorial() : renderFormularioSectorialParaUsuarioSectorial()}
        {estadoObservaciones && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{estadoObservaciones.nombre}</div>
            {renderButtonForSubetapa(estadoObservaciones)}
          </div>
        )}
        {estadoObservacion && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
            <div className="align-self-center">{estadoObservacion.nombre}</div>
            {renderButtonForSubetapa(estadoObservacion)}
          </div>
        )}
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