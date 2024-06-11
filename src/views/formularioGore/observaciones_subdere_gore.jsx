import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import CustomTextarea from "../../components/forms/custom_textarea";
import { useEtapa5 } from "../../hooks/minutaDIPRES/useEtapa5";
import { SuccessOSminutaDIPRES } from "../../components/success/OSminutaDipres";

const ObservacionesSubdereGore = () => {
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { patchComentarioMinuta, loadingPatch } = useEtapa5();
  const [observacionMinutaDipres, setObservacionMinutaDipres] = useState("");
  const [observacionEnviada, setObservacionEnviada] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [competenciasCollapsed, setCompetenciasCollapsed] = useState(false);
  const [regionesCollapsed, setRegionesCollapsed] = useState(false);
  const [sectoresCollapsed, setSectoresCollapsed] = useState(false);
  const navigate = useNavigate();
  const observacionesEnviadas = competenciaDetails?.etapa5?.observacion_minuta_gore_enviada;
  const idEtapa = competenciaDetails?.etapa5?.id

  useEffect(() => {
    // Verificar si las observaciones ya han sido enviadas
    if (competenciaDetails?.etapa5?.observacion_minuta_gore_enviada) {
      // Establecer las observaciones existentes como estado inicial
      setObservacionMinutaDipres(competenciaDetails?.etapa5?.comentario_minuta_etapa5);
    }
  }, [competenciaDetails]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleGuardarObservacion = () => {
    setObservacionEnviada(true);
  };

  const handleCerrarEtapa = async () => {
    await patchComentarioMinuta(idEtapa, observacionMinutaDipres);
    setIsSubmitSuccessful(true);
  }

  const handleVerFormulario = (formularioId) => {
    navigate(`/home/formulario_gore/${formularioId}/paso_1`);
  };

  const toggleCompetenciasCollapse = () => {
    setCompetenciasCollapsed(!competenciasCollapsed);
  };
  const toggleRegionesCollapse = () => {
    setRegionesCollapsed(!regionesCollapsed);
  };
  const toggleSectoresCollapse = () => {
    setSectoresCollapsed(!sectoresCollapsed);
  };

  const renderCompetenciasAgrupadas = () => {
    const competenciasAgrupadas = competenciaDetails?.competencias_agrupadas;
    const numCompetenciasAgrupadas = competenciasAgrupadas ? competenciasAgrupadas.length : 0;
    if (competenciasAgrupadas && competenciasAgrupadas.length === 0) {
      return (
        <div className="">
          <span className="text-sans-h1 mb-1">{competenciaDetails?.nombre}</span>
        </div>
      );
    } else if (competenciasAgrupadas?.length > 0) {
    return(
      <div>
        <button 
        type="button" 
        onClick={toggleCompetenciasCollapse}
        className="btn d-flex justify-content-between w-100 px-0"
        >
          <span className="text-sans-h1 mb-1">{competenciaDetails?.nombre}</span>
          <div className="d-flex align-items-center">
            <span className="badge-info-expandibles">
              <p className="my-0">{numCompetenciasAgrupadas} competencias</p>
            </span>
            <span className="material-symbols-outlined text-black ms-2">
              {competenciasCollapsed ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </button>
        <div className={`collapse ${competenciasCollapsed ? 'show' : ''}`}>
          <table className="table table-striped">
            <tbody>
              {competenciasAgrupadas.map((competencia, index) => (
                <tr key={index}>
                  <td className="d-flex justify-content-between">
                    <span className="text-sans-h5 mb-1">{competencia.nombre}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    return null;
  };

  const renderRegiones = () => {
    const regiones = competenciaDetails?.regiones;
    const numRegiones = regiones ? regiones.length : 0;

    if (regiones && numRegiones > 0) {
      if (numRegiones === 1) {
        return (
          <div className="">
            <span className="text-sans-h3-greyc mb-1">{regiones[0].region}</span>
          </div>
        );
      } else {
        return (
          <div>
            <button
              type="button"
              onClick={toggleRegionesCollapse}
              className="btn d-flex justify-content-between w-100 px-0"
            >
              <span className="text-sans-m-semibold-greyc mb-1">Regiones</span>
              <div className="d-flex align-items-center">
                <span className="badge-info-expandibles">
                  <p className="my-0">{numRegiones} regiones</p>
                </span>
                <span className="material-symbols-outlined text-black ms-2">
                  {regionesCollapsed ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            <div className={`collapse ${regionesCollapsed ? 'show' : ''}`}>
              <table className="table table-striped">
                <tbody>
                  {regiones.map((region, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="text-sans-h5 mb-1">{region.region}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const renderSectores = () => {
    const sectores = competenciaDetails?.sectores;
    const numSectores = sectores ? sectores.length : 0;

    if (sectores && numSectores > 0) {
      if (numSectores === 1) {
        return (
          <div className="">
            <span className="text-sans-h3-greyc mb-1">{sectores[0].nombre}</span>
          </div>
        );
      } else {
        return (
          <div>
            <button
              type="button"
              onClick={toggleSectoresCollapse}
              className="btn d-flex justify-content-between w-100 px-0"
            >
              <span className="text-sans-m-semibold-greyc mb-1">Sectores</span>
              <div className="d-flex align-items-center">
                <span className="badge-info-expandibles">
                  <p className="my-0">{numSectores} sectores</p>
                </span>
                <span className="material-symbols-outlined text-black ms-2">
                  {sectoresCollapsed ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            <div className={`collapse ${sectoresCollapsed ? 'show' : ''}`}>
              <table className="table table-striped">
                <tbody>
                  {sectores.map((sector, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="text-sans-h5 mb-1">{sector.nombre}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return(
    <div className="container col-10 col-xxl-11">
      <div className="py-3 d-flex">
        <div className="align-self-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
        </div>
        <nav className="container mx-5" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${id}`}>Estado de la Competencia: {competenciaDetails?.nombre} </Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
          </ol>
        </nav>
      </div>

      <div className="border-bottom pb-3">
        <h1 className="text-sans-Title ">Observaciones SUBDERE</h1>
        <h2 className="text-sans-h1 mt-2 mb-0">Formularios GORE y Minuta DIPRES</h2>
        <div className="">
          {renderCompetenciasAgrupadas()}
        </div>
        <div className="">
          {renderRegiones()}
        </div>
        <div className="">
          {renderSectores()}
        </div>
      </div>

      {!isSubmitSuccessful ? (
      <>
        {/* FORMULARIOS GORE */}
        <div className="border-bottom pb-3">
          <h2 className="text-sans-25 mt-4 mb-4">Formularios GORE</h2>
          {competenciaDetails?.etapa4?.formularios_gore ? (
            Array.isArray(competenciaDetails.etapa4.formularios_gore) ? (
              competenciaDetails.etapa4.formularios_gore.map((formulario, index) => (
                <tr
                  className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                  key={formulario.id}
                  >
                  <td>{formulario.nombre}</td>
                  <td className="">
                    <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                      {formulario.accion}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
            competenciaDetails.etapa4.formularios_gore.detalle_formularios_gore.map((formulario, index) => (
              <tr
                className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                key={formulario.id}
              >
                <td>{formulario.nombre}</td>
                <td className="">
                  <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                    {formulario.accion}
                  </button>
                </td>
              </tr>
              ))
            )
          ) : (
          <p>No hay formularios disponibles.</p>
          )}
        </div>

        {/* MINUTA DIPRES */}
        <div className="mt-4 border-bottom pb-3">
        <h2 className="text-sans-25 mt-4 mb-4">Minuta DIPRES</h2>
          <SubirArchivo
            readOnly={true}
            archivoDescargaUrl={competenciaDetails?.etapa5?.archivo_minuta_etapa5}
            tituloDocumento="Minuta DIPRES"
          />
        </div>

        <div className="mt-5 mb-5">
          <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            rows={6}
            maxLength={500}
            value={observacionMinutaDipres}
            onChange={(e) => setObservacionMinutaDipres(e.target.value)}
            readOnly={observacionesEnviadas}
            onBlur={handleGuardarObservacion}
            loading={loadingPatch}
          />
        </div>

        {!observacionesEnviadas && (
          <div className="mb-4">
            {!observacionEnviada ? (
              <>
                <h2 className="text-sans-h2">Debes revisar todos los formularios y escribir observaciones para DIPRES antes de terminar la etapa</h2>
                <p className="text-sans-p">Para poder terminar la etapa debes revisar todos los formularios y dejar observaciones donde consideres necesario.</p>
              </>
            ) : (
              <>
                <h2 className="text-sans-h2">Esta todo listo para que termines la etapa</h2>
                <p className="text-sans-p">Ya revisaste todos los formularios. </p>
              </>
            )}
          </div>
        )}

        { !observacionesEnviadas && (
        <div className="d-flex justify-content-end my-5">
          <button className="btn-primario-s" disabled={!observacionEnviada} onClick={handleCerrarEtapa}>
            <p className="mb-0 text-decoration-underline">Cerrar etapa</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
        )}
      </>
      ) : (
        <SuccessOSminutaDIPRES 
        idCompetencia={competenciaDetails?.id}
        mensaje="Dependiendo de la decisión que hayas tomado sobre la siguiente etapa, el usuario correspondiente será notificado para comenzar con la etapa que le corresponda."
        />
      )}

    </div>
  )
};

export default ObservacionesSubdereGore;