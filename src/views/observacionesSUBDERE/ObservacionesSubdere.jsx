import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";

const ObservacionesSubdere = () => {
  const { updateFormId, data, loading } = useContext(FormularioContext);
  const [ etapaOmitida, setEtapaOmitida] = useState(null);
  const { observaciones, fetchObservaciones } = useObservacionesSubdere(data ? data.id : null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  console.log("competencia details en OS", competenciaDetails) //obtiene info correcta de Competencia
  console.log("data en OS", data) //data formulario sectorial, se le entrega id incorrecto (id de la competencia en lugar del id de cada form sectorial)
  console.log("observaciones en OS", observaciones) //al depender de data, vamos a asumir que tambien esta mal

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleRadioButtonChange = (value) => {
    setEtapaOmitida(value === 'A');
  };

  const handleVerFormulario = (formularioId) => {
    navigate(`/home/formulario_sectorial/${formularioId}/paso_1`);
  };

  useEffect(() => {
    if (id) {
      updateFormId(id);
    }
  }, [id, updateFormId]);

  useEffect(() => {
    const obtenerObservaciones = async () => {
      try {
        await fetchObservaciones();
      } catch (error) {
        console.error("Error al obtener observaciones en ResumenOS:", error);
      }
    };
    obtenerObservaciones();
  }, [data, fetchObservaciones]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!data) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="container col-11">
      <div className="py-3 d-flex">
        <div  className="align-self-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
        </div>
        <nav className="container mx-5" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${data.id}`}>Estado de la Competencia: {data.competencia_nombre} </Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
          </ol>
        </nav>
      </div>
      <div>
        <h1 className="text-sans-Title">Observaciones SUBDERE</h1>
        <h2 className="text-sans-h1">Formularios sectoriales</h2>
        <h2 className="text-sans-h2">{competenciaDetails.nombre}</h2>
      </div>
      <hr/>

      <div>
      {competenciaDetails?.etapa2?.formulario_sectorial ? (
        competenciaDetails.etapa2.formulario_sectorial.map((formulario, index) => (
          <tr 
            className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`} 
            key={formulario.id}
          >
            <td>{formulario.nombre}</td>
            <td className="">
              <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                {observaciones.observacion_enviada ? 'Ver Formulario' : 'Ver observaciones'}
              </button>
            </td>
          </tr>
        ))
      ) : (
        <p>No hay formularios disponibles.</p>
      )}
      </div>
      <hr/>

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

      {observaciones.observacion_enviada ? (
        <div>
          <h3 className="text-sans-h2">Esta todo listo para que termines la etapa</h3>
          <p className="text-sans-p mt-3 mb-5">Ya revisaste todos los formularios. </p> 
          <p className="text-sans-p mb-2">Debes definir cual es el próximo paso en el procedo de análisis de la competencia:</p>
          <div>
            <div className="form-check">
              <input
                type="radio"
                id="opcionA"
                name="proximaEtapa"
                className="form-check-input"
                value="A"
                onChange={() => handleRadioButtonChange('A')}
                checked={etapaOmitida === true}
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
                checked={etapaOmitida === false}
              />
              <label htmlFor="opcionB" className="text-sans-p">
                GORE debe entregar sus antecedentes para que luego DIPRES se pronuncie respecto a la información.
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-sans-h2">Debes revisar todos los formularios antes de terminar la etapa</h3>
          <p className="text-sans-p mt-3">Para poder terminar la etapa debes revisar todos los formularios y dejar observaciones donde consideres necesario.</p>
        </div>
      )}
      
      <div className="d-flex justify-content-end my-5 me-3">
        <button 
        className="btn-primario-s"
        disabled={etapaOmitida === null}
        >
          Cerrar etapa
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      </div>

    </div>
  )
}

export default ObservacionesSubdere;