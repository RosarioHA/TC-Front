import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';


export const Etapa4 = ({ etapa, id }) =>
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

  const { userData } = useAuth();
  const userRegionId = userData.region;
  const userProfile = userData.perfil;
  const navigate = useNavigate();
  const etapaNum = 4;


  const [ isUsuariosGoreCollapsed, setIsUsuariosGoreCollapsed ] = useState(false);
  const [ isFormulariosGoreCollapsed, setIsFormulariosGoreCollapsed ] = useState(false);

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
    // Si el usuario ha sido notificado y el estado es "finalizada"
    if (usuario.estado === "finalizada")
    {
      // Muestra un badge indicando que está finalizado
      return <span className="badge-status-finish">{usuario.accion}</span>;
    }
    // Si el usuario aún no ha sido notificado y el estado es "revisión"
    else if (usuario.estado === "revision")
    {
      // Muestra un botón para asignar usuario, con el texto de la acción
      return (
        <Link className="btn-secundario-s text-decoration-none" to={`/home/editar_competencia/${id}`}>
          <span className="material-symbols-outlined me-1">folder</span>
          <u>{usuario.accion}</u>
        </Link>
      );
    }
  };

  const renderUsuariosGore = () =>
  {
    let usuariosParaRenderizar = usuarios_gore?.detalle_usuarios_gore_notificados || usuarios_gore || [];


    const todosFinalizados = usuariosParaRenderizar.every(usuario => usuario.estado === 'finalizada');
    // Ajuste para mostrar el badge según el estado resumido de los usuarios
    const badgeClass = todosFinalizados ? 'badge-status-finish' : 'badge-status-pending';
    const accionResumenTexto = todosFinalizados ? 'Finalizada' : 'En Revisión';
    if (usuariosParaRenderizar.length === 1)
    {
      // Manejo especial para un único usuario GORE
      const usuario = usuariosParaRenderizar[ 0 ];
      return (
        <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
          <div className="align-self-center">{usuario.nombre}</div>
          {renderBadgeOrButtonForUsuario(usuario)}
        </div>
      );
    } else if (usuariosParaRenderizar.length > 1)
    {
      return (
        <div className='w-100 border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0 my-1" onClick={toggleUsuariosGoreCollapse}>
            <span>Usuarios GORE Notificados </span>
            <div className="d-flex align-items-center">
              <span className={badgeClass}>{accionResumenTexto}</span>
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

  const renderButtonForSubetapa = (subetapa) => {
    const { estado, accion, nombre } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";
    
    // Este fragmento maneja los casos específicos y asigna el path correcto
    if (nombre.startsWith("Notificar a") && estado === "finalizada") {
      if (etapa.estado === 'Aún no puede comenzar') {
        return <span className="badge-status-pending">{accion}</span>;
      } else {
        return <span className="badge-status-finish">{accion}</span>;
      }
    }
  
    if (nombre.includes("Subir oficio y su fecha para habilitar formulario GORE")) {
      if (estado === "finalizada") {
        // Cuando la subetapa está finalizada, se configura el botón para abrir el PDF en una nueva pestaña
        return (
          <button onClick={() => window.open(oficio_origen, '_blank')} className="btn-secundario-s text-decoration-none" id="btn">
            <span className="material-symbols-outlined me-1">{icon}</span>
            <u>{buttonText}</u>
          </button>
        );
      } else {
        // Aquí manejas los casos en los que la subetapa no está finalizada, ajusta según necesites
        path = `/home/estado_competencia/${etapa.id}/subir_oficio_gore/${etapaNum}/`;
      }
    }
    const isDisabled = estado === "pendiente" || estado === "revision";
  
    // Función para manejar el evento de clic y realizar la navegación
    const handleButtonClick = () => {
      navigate(path, { state: { extraData: "GORE", seccion:'etapa4' } });
    };
  
    // Renderizar un botón o un enlace basado en si la acción está deshabilitada o no
    return isDisabled ? (
      <button onClick={handleButtonClick} className='btn-secundario-s' id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      // Usar un <button> en lugar de <Link> para consistencia y llamar a navigate directamente
      <button onClick={handleButtonClick} className="btn-secundario-s text-decoration-none" id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    );
  };
  

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
        // Solo deshabilitar si no es el perfil correcto o está en un estado no permitido
        isButtonDisabled = userProfile !== "GORE"; // Ajusta según la lógica de tu aplicación
        break;
      // Agrega más casos según otros estados posibles
      default:
        buttonText = "Ver Detalles";
        path = `${basePath}/paso_1`;
        icon = 'visibility';
        isButtonDisabled = false;
        break;
    }
    console.log(path)
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


  const renderFormulariosGore = () =>
  {
    // Verifica si formularios_gore es un array directamente, indicando solo un formulario.
    if (Array.isArray(formularios_gore) && formularios_gore.length === 1)
    {
      return renderSingleFormularioGore(formularios_gore[ 0 ]);
    }

    // En caso de que formularios_gore contenga las propiedades para múltiples formularios
    const { detalle_formularios_gore = [] } = formularios_gore || {};
    // Aquí podrías manejar el caso de múltiples formularios como antes
    const formulariosParaRenderizar = userProfile === 'GORE'
      ? detalle_formularios_gore.filter(formulario => formulario.region_id === userRegionId)
      : detalle_formularios_gore;


    const formularioCompleto = formularios_gore.formularios_gore_completos[ 0 ];
    console.log(formularioCompleto)

    if (formulariosParaRenderizar.length === 1)
    {
      return renderSingleFormularioGore(formulariosParaRenderizar[ 0 ]);
    } if (formulariosParaRenderizar.length > 1 && userProfile !== 'GORE')
    {
      return (
        <div className='w-100 border-bottom border-top'>
          <button type="button" className="btn d-flex justify-content-between w-100 px-0 my-1" onClick={toggleFormulariosGoreCollapse}>
            <span>{formularioCompleto.nombre}</span>
            <div className="d-flex align-items-center">
              <span className={`${formularioCompleto.estado === "revision" ? "badge-status-review" : "badge-status-finish"}`}>
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