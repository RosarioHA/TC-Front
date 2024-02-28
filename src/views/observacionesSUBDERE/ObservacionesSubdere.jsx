import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";

const ObservacionesSubdere = () => {
  const { updateFormId, data, loading } = useContext(FormularioContext);
  const [proximaEtapaDipres, setProximaEtapaDipres] = useState(null);
  const { observaciones, fetchObservaciones } = useObservacionesSubdere(data ? data.id : null);

  console.log("observaciones en vista OS, proveniente de hook useObservacionesSubdere", observaciones)
  console.log("'data', proveniente de FormularioContext", data)
 
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleRadioButtonChange = (value) => {
    setProximaEtapaDipres(value === 'A');
  };

  const handleCerrarEtapa = async () => {
    try {
      // Aquí actualizar valor de proximo paso en backend
      navigate( `/home/success_cierre_observaciones/${data.id}/`);

    } catch (error) {
      console.error("Error al enviar observaciones:", error);
    }
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
        <h2 className="text-sans-h2">{data.competencia_nombre}</h2>
      </div>
      <hr/>

      <div>
        TABLA
      </div>
      <hr/>

      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <p className="text-sans-p">Plazo para completar formulario:</p><p className="text-sans-p-bold ms-2">{data.plazo_dias} días corridos</p>
        </div>
        <div className="d-flex pe-4">
          <p className="text-sans-p">Tiempo utilizado:</p><p className="text-sans-p-bold ms-2">{data.calcular_tiempo_transcurrido.dias} días {data.calcular_tiempo_transcurrido.horas} horas {data.calcular_tiempo_transcurrido.horas} minutos</p>
        </div>
      </div>
      <div className="d-flex mb-4">
        <p className="text-sans-p">Fecha última modificación:</p><p className="text-sans-p-bold ms-2">{data.fecha_ultima_modificacion}</p>
      </div>

      {/* condicionalidad: si ya se han enviado todas las OS, se muestra el primer div; si no, el segundo */}
      {observaciones. observacion_enviada ? (
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
                checked={proximaEtapaDipres === true}
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
                checked={proximaEtapaDipres === false}
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
        disabled={proximaEtapaDipres === null}
        onClick={handleCerrarEtapa}
        >
          Cerrar etapa
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      </div>

    </div>
  )
}

export default ObservacionesSubdere;