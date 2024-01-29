import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "../tables/Counter";
import { useAuth } from '../../context/AuthContext';

export const Etapa2 = ({ etapa }) =>
{
  const {
    nombre_etapa,
    estado,
    oficio_inicio_sectorial,
    observaciones_sectorial,
    fecha_ultima_modificacion
  } = etapa;
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const [ isCollapsed, setIsCollapsed ] = useState(false);

  const toggleCollapse = () =>
  {
    setIsCollapsed(!isCollapsed);
  };

  const { detalle_formularios_sectoriales, formularios_sectoriales } = etapa.formulario_sectorial;

  const usuariosNotificadosDetalles = etapa.usuarios_notificados.detalle_usuarios_notificados;


  const renderBadge = (usuario) =>
  {
    if (usuario.estado === "finalizada" && usuario.accion === "Finalizada")
    {
      return <span className="badge-status-finish ">{usuario.accion}</span>;
    }
    // Aquí puedes añadir más lógica para otros estados o acciones
  };

  const renderBadgeForEstado = (estado) =>
  {
    switch (estado)
    {
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



  const etapaNum = 2;

  const handleNavigation = (path) =>
  {
    console.log("Navegando a:", path);
    navigate(path);
  };

  if (!etapa || etapa.nombre_etapa === undefined)
  {
    return <div>Data is loading or not available</div>;
  }

  const renderButtonForSubetapa = (subetapa) =>
  {
    const { estado, accion, nombre, id: subetapaId } = subetapa;
    let buttonText = accion;
    let icon = estado === "finalizada" ? "visibility" : "draft";
    let path = "/";

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

    const isDisabled = estado === "pendiente";

    return isDisabled ? (
      <button className={`btn-secundario-s ${estado === "pendiente" ? "disabled" : ""}`} id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    ) : (
      <button onClick={() => handleNavigation(path)} className="btn-secundario-s text-decoration-none" id="btn">
        <span className="material-symbols-outlined me-1">{icon}</span>
        <u>{buttonText}</u>
      </button>
    );
  };
  // Función para mostrar un botón para un formulario sectorial
  const renderButtonForFormularioSectorial = (formulario) => {
    const buttonText = formulario.accion;
    const path = `/home/formulario_sectorial/${formulario.id}/paso_1`;
  
    // Deshabilita el botón si el usuario es SUBDERE
    const isButtonDisabled = userSubdere || formulario.estado !== "pendiente";
  
    return (
      <button 
        onClick={() => handleNavigation(path)} 
        className={`btn-secundario-s text-decoration-none ${isButtonDisabled ? 'disabled' : ''}`} 
        id="btn"
        disabled={isButtonDisabled}
      >
        <span className="material-symbols-outlined me-1">edit</span>
        <u>{buttonText}</u>
      </button>
    );
  };

  const renderSubetapas = (subetapas) =>
  {
    return subetapas.map((subetapa, index) => (
      <div key={index} className="d-flex justify-content-between text-sans-p border-top border-bottom my-3 py-1">
        <div className="align-self-center">{subetapa.nombre}</div>
        {renderButtonForSubetapa(subetapa)}
      </div>
    ));
  };

  const renderFormularioSectorial = () =>
  {
    if (Array.isArray(detalle_formularios_sectoriales) && detalle_formularios_sectoriales.length > 0)
    {
      if (detalle_formularios_sectoriales.length === 1)
      {
        // Si solo hay un formulario, muestra directamente su nombre y botón
        return renderSingleFormularioSectorial(detalle_formularios_sectoriales[ 0 ]);
      } else
      {
        // Si hay más de un formulario, muestra un collapse con la información de 'formularios_sectoriales'
        const info = formularios_sectoriales[ 0 ];
        return (
          <div className='w-100'>
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
                    {detalle_formularios_sectoriales.map((formulario, index) => (
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
      }
    }
  }
  // Función para mostrar un único formulario sectorial
  const renderSingleFormularioSectorial = (formulario) =>
  {
    return (
      <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
        <div className="align-self-center">{formulario.nombre}</div>
        {renderButtonForFormularioSectorial(formulario)}
      </div>
    );
  };

  return (
    <div className="my-3">
      <div className="d-flex justify-content-between my-2 text-sans-p">
        Para completar {nombre_etapa} con éxito deben cumplirse estas condiciones:
      </div>
      <div>
        {usuariosNotificadosDetalles && usuariosNotificadosDetalles.length > 0 && (
          <div>
            {usuariosNotificadosDetalles.map((usuario, index) => (
              <div key={index} className="usuario-notificado d-flex justify-content-between py-2 my-1 border-top border-bottom">
                <span>{usuario.nombre}</span>
                {renderBadge(usuario)}
              </div>
            ))}
          </div>
        )}
        {oficio_inicio_sectorial && (
          <div className="d-flex justify-content-between text-sans-p border-top border-bottom my-2 py-1">
            <div className="align-self-center">{oficio_inicio_sectorial.nombre}</div>
            {renderButtonForSubetapa(oficio_inicio_sectorial)}
          </div>
        )}
        {renderFormularioSectorial()}
        {observaciones_sectorial.length > 0 && renderSubetapas(observaciones_sectorial)}
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
