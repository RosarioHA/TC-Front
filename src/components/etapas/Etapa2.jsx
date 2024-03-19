import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa2 = ({ etapa }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userGore = userData?.perfil?.includes('GORE');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const usuarioSector = userData?.sector;

  console.log("etapa en etapa2", etapa)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const etapaNum = 2;
  const {
    nombre_etapa,
    estado,
    oficio_inicio_sectorial,
    observaciones_sectorial,
    fecha_ultima_modificacion,
    usuarios_notificados
  } = etapa;

  const usuariosNotificadosDetalles = usuarios_notificados?.detalle_usuarios_notificados || [];

  const renderBadge = (usuario) => {
    if (usuario.estado === "finalizada" && usuario.accion === "Finalizada") {
      return <span className="badge-status-finish">{usuario.accion}</span>;
    }
    // Aquí puedes añadir más lógica para otros estados o acciones
  };

  const renderBadgeForEstado = (estado) => {
    switch (estado) {
      case "finalizada":
        return <span className="badge-status-finish">Finalizada</span>;
      case "revision":
        return <span className="badge-status-review">En Revisión</span>;
      case "pendiente":
        return <span className="badge-status-pending">Pendiente</span>;
      default:
        return null;
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre, id: subetapaId } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";

    const isSubirOficio = nombre.includes("Subir oficio");

    // Determina si el botón debe estar habilitado para usuarios con perfil SUBDERE y estado pendiente
    const isButtonEnabledForSubdere = isSubirOficio && userSubdere && estado !== "pendiente";
  
    // Determina si el botón debe estar habilitado para todos los usuarios cuando la acción es "Ver oficio" y el estado es "finalizada"
    const isButtonEnabledForAll = accion === "Ver oficio" && estado === "finalizada";
  
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
          path = estado === "finalizada" ? "/home/ver_minuta" : `/home/estado_competencia/${etapa.id}/subir_oficio/${etapaNum}/${subetapaId}`;
          break;
      case nombre.includes("Observación del formulario sectorial"):
        path = estado === "finalizada" ? "/home/ver_observaciones" : "/home/ingresar_observaciones";
        break;

      // Puedes agregar más casos según sea necesario
      default:
        break;
    }

    if (isButtonEnabledForAll || isButtonEnabledForSubdere) {
      return (
        <button onClick={() => handleNavigation(path ,{ state: { extraData: "Sectorial" } })} className="btn-secundario-s text-decoration-none" id="btn">
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    } else {
      // Para otros casos, desactiva el botón si no se cumplen las condiciones
      return (
        <button className="btn-secundario-s disabled" id="btn">
          <span className="material-symbols-outlined me-1">{icon}</span>
          <u>{buttonText}</u>
        </button>
      );
    }
  };

    
  // AQUI DECIR A LA FUNCION QUE RECONOZCA SI EL BOTON ESTA EN ESTADO FINALIZADO  

  const renderButtonForFormularioSectorial = (formulario) => {
    const buttonText = formulario.accion;
    const path = `/home/formulario_sectorial/${formulario.id}/paso_1`;
    //const isButtonDisabled = (userSubdere || userGore) || formulario.estado === "pendiente";
    const isButtonDisabled = formulario.estado === "pendiente";
    console.log("formulario.estado en Etapa2", formulario.estado)

    let icon = 'edit';
    if (formulario.estado !== "pendiente") {
      icon = 'draft'; 
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
  
  const renderSingleFormularioSectorial = (formulario) => {
    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
        <div className="align-self-center">{formulario.nombre}</div>
        {renderButtonForFormularioSectorial(formulario)}
      </div>
    );
  };

  const renderUsuariosNotificados = () => {
    if (usuarios_notificados && usuarios_notificados.length === 1) {
      const usuario = usuarios_notificados[0];
      return (
        <div className="usuario-notificado d-flex justify-content-between py-2 my-1 border-top border-bottom">
          <span>{usuario.nombre}</span>
          {renderBadge(usuario)}
        </div>
      );
    } else if (usuariosNotificadosDetalles.length > 0) {
      return usuariosNotificadosDetalles.map((usuario, index) => (
        <div key={index} className="usuario-notificado d-flex justify-content-between py-2 my-1 border-top border-bottom">
          <span>{usuario.nombre}</span>
          {renderBadge(usuario)}
        </div>
      ));
    }
    return null;
  };

  const renderFormularioSectorial = () => {
    if (!userSubdere && !userGore) {
      return null; // No renderizar nada si el usuario no es SUBDERE ni GORE
    }
    // Verifica si el array formulario_sectorial tiene un solo elemento
    if (etapa.formulario_sectorial && etapa.formulario_sectorial.length === 1) {
      const formulario = etapa.formulario_sectorial[0];
      console.log("formulario", formulario)
      return renderSingleFormularioSectorial(formulario);
    }
    // Verifica si el array detalle_formularios_sectoriales tiene elementos
    else if (etapa.formulario_sectorial.detalle_formularios_sectoriales && etapa.formulario_sectorial.detalle_formularios_sectoriales.length > 0) {
      const info = etapa.formulario_sectorial.formularios_sectoriales[0];
      return (
        <div className='w-100 boder border-bottom'>
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
                        {formulario.estado === "pendiente" 
                          ? renderButtonForFormularioSectorial(formulario)
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
    } else {
      return <div>No hay formularios sectoriales para mostrar.</div>;
    }
  };
  
  const renderFormularioSectorialParaUsuarioSectorial = () => {
    // Verificación para asegurar que el usuario no es SUBDERE y es un usuario sectorial
    if (userSubdere || !usuarioSector) {
      return null; // No renderizar nada si el usuario es SUBDERE o no tiene sector asignado
    }
  
    let formulariosFiltrados = [];
  
    // Verifica si etapa.formulario_sectorial es un arreglo directamente
    if (Array.isArray(etapa.formulario_sectorial) && etapa.formulario_sectorial.length > 0) {
      // Trata etapa.formulario_sectorial como un arreglo de formularios
      formulariosFiltrados = etapa.formulario_sectorial.filter(formulario => formulario.sector_id === usuarioSector);
    } else if (etapa.formulario_sectorial?.detalle_formularios_sectoriales) {
      // Accede a detalle_formularios_sectoriales si la estructura es un objeto con esta propiedad
      formulariosFiltrados = etapa.formulario_sectorial.detalle_formularios_sectoriales.filter(formulario => formulario.sector_id === usuarioSector);
    }
  
    if (formulariosFiltrados.length > 0) {
      return formulariosFiltrados.map((formulario, index) => (
        <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
          <div className="align-self-center">{formulario.nombre}</div>
          {renderButtonForFormularioSectorial(formulario)}
        </div>
      ));
    } else {
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
        {console.log("observaciones sectorial en Etapa2",observaciones_sectorial)}
        {observaciones_sectorial.length > 0 && (
          observaciones_sectorial.map((observacion, index) => (
            <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
              <div className="align-self-center">{observacion.nombre}</div>
              {renderButtonForSubetapa(observacion)}
            </div>
          ))
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