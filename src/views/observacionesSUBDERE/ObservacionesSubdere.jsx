import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useEtapa3 } from "../../hooks/minutaDIPRES/useEtapa3";

const ObservacionesSubdere = () => {
  const [ etapaOmitida, setEtapaOmitida ] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { patchCompetenciaOmitida } = useEtapa3();

  const formulariosNoEnviados = competenciaDetails?.etapa2?.estado === 'Aún no puede comenzar';
  const observacionesEnviadas = competenciaDetails?.etapa2?.observaciones_completas;
  const etapaFinalizada = competenciaDetails?.etapa2?.estado === 'Finalizada';

  useEffect(() => {
    // Obtener etapaOmitida desde competenciaDetails y establecerla en el estado
    if (competenciaDetails && competenciaDetails.etapa3 && competenciaDetails.etapa3.omitida !== undefined) {
      setEtapaOmitida(competenciaDetails.etapa3.omitida);
    }
  }, [ competenciaDetails ]); // Este efecto se ejecuta cada vez que competenciaDetails cambia

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleRadioButtonChange = (value) => {
    setEtapaOmitida(value === 'B');
  };

  const handleVerFormulario = (formularioId) => {
    navigate(`/home/formulario_sectorial/${formularioId}/paso_1`);
  };

  const handleCerrarEtapa = async () => {
    try {
      await patchCompetenciaOmitida(competenciaDetails?.etapa3?.id, etapaOmitida);
      navigate(`/home/success_cierre_observaciones/${competenciaDetails?.id}`);
    } catch (error) {
      console.error("Error al cerrar la etapa:", error);
    }
  };

  return (
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
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${competenciaDetails.id}`}>Estado de la Competencia: {competenciaDetails.nombre} </Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
          </ol>
        </nav>
      </div>
      {/* AQUI MODIFICAR ENCABEZADO  */}
      <div>
        <h1 className="text-sans-Title">Observaciones SUBDERE</h1>
        <h2 className="text-sans-h1">Formularios sectoriales</h2>
        <h2 className="text-sans-h2">{competenciaDetails.nombre}</h2>
      </div>
      <hr />

      <div>
        {competenciaDetails?.etapa2?.observaciones_sectorial ? (
          Array.isArray(competenciaDetails.etapa2.observaciones_sectorial) ? (
            competenciaDetails.etapa2.observaciones_sectorial.map((observaciones, index) => (
              <tr
                className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                key={observaciones.id}
              >
                <td>{observaciones.nombre}</td>
                <td className="">
                  <button
                    className={`btn-secundario-s text-decoration-underline ${formulariosNoEnviados ? 'disabled' : ''}`}
                    onClick={() => handleVerFormulario(observaciones.id)}
                    disabled={formulariosNoEnviados}
                  >
                    <p className="mb-0">{observaciones.accion}</p>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            competenciaDetails?.etapa2.observaciones_sectorial?.detalle_observaciones_sectoriales
              .sort((a, b) => b.id - a.id) 
              .map((observaciones, index) => (
                <tr
                  className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                  key={observaciones.id}
                >
                  <td>{observaciones.nombre}</td>
                  <td className="">
                    <button
                      className={`btn-secundario-s text-decoration-underline ${formulariosNoEnviados ? 'disabled' : ''}`}
                      onClick={() => handleVerFormulario(observaciones.id)}
                      disabled={formulariosNoEnviados}
                    >
                      <p className="mb-0">{observaciones.accion}</p>
                    </button>
                  </td>
                </tr>
              ))
          )
        ) : (
          <p>No hay formularios disponibles.</p>
        )}
      </div>
      <hr />

      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <p className="text-sans-p">Plazo para completar formulario:</p><p className="text-sans-p-bold ms-2">{competenciaDetails.plazo_formulario_sectorial} días corridos</p>
        </div>
        <div className="d-flex pe-4">
          <p className="text-sans-p">Tiempo utilizado:</p><p className="text-sans-p-bold ms-2">{competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.dias} días {competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.horas} horas {competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.horas} minutos</p>
        </div>
      </div>
      <div className="d-flex mb-4">
        <p className="text-sans-p">Fecha última modificación:</p><p className="text-sans-p-bold ms-2">{competenciaDetails?.etapa2?.fecha_ultima_modificacion}</p>
      </div>

      {observacionesEnviadas && (
        <div>
          {!etapaFinalizada && (
            <>
              <h3 className="text-sans-h2">Esta todo listo para que termines la etapa</h3>
              <p className="text-sans-p mt-3 mb-5">Ya revisaste todos los formularios. </p>
              <p className="text-sans-p mb-2">Debes definir cual es el próximo paso en el procedo de análisis de la competencia:</p>
            </>
          )}
          <div>
            <div className="form-check">
              <input
                type="radio"
                id="opcionA"
                name="proximaEtapa"
                className="form-check-input"
                value="A"
                onChange={() => handleRadioButtonChange('A')}
                checked={etapaOmitida === false}
                disabled={etapaFinalizada}
              />
              <label htmlFor="opcionA" className="text-sans-p">
                DIPRES debe pronunciarse respecto de la información del sector o sectores asociados a la competencia.
              </label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                id="opcionB"
                name="proximaEtapa"
                className="form-check-input"
                value="B"
                onChange={() => handleRadioButtonChange('B')}
                disabled={etapaFinalizada}
                checked={etapaOmitida === true}
              />
              <label htmlFor="opcionB" className="text-sans-p">
                GORE debe entregar sus antecedentes para que luego DIPRES se pronuncie respecto a la información.
              </label>
            </div>
          </div>
        </div>
      )}

      {!observacionesEnviadas && (
        <>
          <div>
            <h3 className="text-sans-h2">Debes revisar todos los formularios antes de terminar la etapa</h3>
            <p className="text-sans-p mt-3">Para poder terminar la etapa debes revisar todos los formularios y dejar observaciones donde consideres necesario.</p>
          </div>
        </>
      )}

      <div className="d-flex justify-content-end my-5 me-3">
        {!etapaFinalizada && (
          <button
            className="btn-primario-s"
            disabled={etapaOmitida === null}
            onClick={handleCerrarEtapa}
          >
            Cerrar etapa
            <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
          </button>
        )}
      </div>
    </div>
  )
}

export default ObservacionesSubdere;