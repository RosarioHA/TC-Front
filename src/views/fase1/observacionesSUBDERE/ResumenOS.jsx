import { useState, useContext, useEffect } from "react";
import { FormularioContext } from '../../../context/FormSectorial';
import { useObservacionesSubdere } from "../../../hooks/fase1/formulario/useObSubdereSectorial";
import CustomTextarea from "../../../components/fase1/forms/custom_textarea";
import { SubirArchivo } from "../../../components/fase1/commons/subirArchivo";
import successIcon from '../../../static/icons/success.svg';
import { useNavigate } from "react-router-dom";

const ResumenOS = () => {
  const { data } = useContext(FormularioContext);
  const { observaciones, fetchObservaciones, updateObservacion, subirArchivo, guardarDescripcion, eliminarArchivo } = useObservacionesSubdere(data ? data.id : null);
  const navigate = useNavigate();
  const observacionesEnviadas = observaciones?.observacion_enviada;
  const [inputStatus, setInputStatus] = useState({
    descripcion_documento: { loading: false, saved: false },
  });

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

  const handleFileSelect = async (file) => {
    try {
      await subirArchivo(file);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleDeleteFile = async () => {
    try {
      await eliminarArchivo();
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };

  const handleChange = (fieldName, event) => {
    const { value } = event.target;
    setInputStatus(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], loading: false, saved: false }
    }));
    observaciones[fieldName] = value;
  };

  const handleSave = async (fieldName) => {
    setInputStatus(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], loading: true }
    }));
    try {
      await guardarDescripcion(fieldName, observaciones[fieldName]);
      setInputStatus(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], loading: false, saved: true }
      }));
    } catch (error) {
      console.error(`Error al guardar ${fieldName}:`, error);
      setInputStatus(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], loading: false, saved: false }
      }));
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleClickOSCerrada = () => {
    navigate(`/home/observaciones_subdere/${data.competencia_id}/`);
  };

  const handleEnviarClick = async () => {
    try {
      await updateObservacion({ observacion_enviada: true });
      navigate(`/home/success_observaciones_subdere/${data.id}/`);
    } catch (error) {
      console.error("Error al enviar observaciones:", error);
    }
  };

  const titulosPasos = {
    1: "Descripción de la Institución",
    2: "Arquitectura del Proceso",
    3: "Cobertura de la Competencia",
    4: "Indicadores de Desempeño",
    5: "Costeo de la Competencia",
  };

  return (
    <div className="container col-10 col-xxl-11">
      <p className="text-sans-h1 text-center">Resumen observaciones</p>

      {Object.keys(observaciones).map((pasoKey) => {
        if (!pasoKey.includes('observacion_paso')) {
          return null;
        }

        const pasoNumber = pasoKey.replace('observacion_paso', '');
        const observacion = observaciones[pasoKey];

        if (Array.isArray(observacion) && observacion.length === 0) {
          return null;
        }

        return (
          <div key={pasoKey} className="mb-5">
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex">
                <p className="text-sans-p-semibold">Paso {pasoNumber}:</p>
                <p className="text-sans-p ms-2">{titulosPasos[pasoNumber]}</p>
              </div>
              {observacion && !Array.isArray(observacion) && (
                <>
                  <img className="icono-s" src={successIcon} alt="Éxito" />
                  <p className="text-sans-p-blue me-3">Listo</p>
                </>
              )}
              {observacion != null && (Array.isArray(observacion) ? observacion.length === 0 : observacion.trim() === "") && (
                <p className="text-sans-p me-3">No dejaste observaciones en este paso.</p>
              )}
            </div>
            {observacion && !Array.isArray(observacion) && (
              <CustomTextarea
                label="Observaciones (Opcional)"
                type="text"
                id={`paso${pasoNumber}`}
                name={`paso${pasoNumber}`}
                value={observacion}
                readOnly
                className="form-control"
              />
            )}
          </div>
        );
      })}

      {!observaciones.observacion_enviada && (
        <>
          <h2 className="text-sans-h2">Esta todo listo para que envies las observaciones</h2>
          <p className="text-sans-p">Asegúrate que las observaciones que ingresaste son suficientes, ya que una vez que las envíes, no podrás editarlas.</p>
        </>
      )}
      <div className="my-4">
        <p className="text-sans-h4 mb-1">Antecedentes Adicionales para complementar las observaciones</p>
        <div className="col-11">
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-1">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
          <SubirArchivo
            index="1"
            handleFileSelect={handleFileSelect}
            handleDeleteFile={handleDeleteFile}
            archivoDescargaUrl={data?.antecedente_adicional_subdere}
            tituloDocumento={data?.antecedente_adicional_subdere}
            fieldName="antecedente_adicional_subdere"
            readOnly={observacionesEnviadas}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Descripción del archivo adjunto (Opcional)"
            placeholder="Describe el archivo adjunto"
            name="descripcion_documento"
            value={observaciones?.descripcion_documento}
            onChange={(e) => handleChange('descripcion_documento', e)}
            onBlur={() => handleSave('descripcion_documento')}
            loading={inputStatus.descripcion_documento.loading}
            saved={inputStatus.descripcion_documento.saved}
            readOnly={observacionesEnviadas}
            maxLength={500}
          />
        </div>
        {!observaciones.observacion_enviada ? (
        <p className="text-sans-p">
          Asegúrate que los datos ingresados son correctos, ya que una vez que envíes el formulario, 
          no podrás editarlo a menos que SUBDERE requiera información adicional.</p>
          ):("")}
      </div>

      <div className="d-flex justify-content-between p-2 mb-5 pb-5">
        <button className="d-flex btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="text-decoration-underline mb-0">Atrás</p>
        </button>
        <div>
          {observaciones.observacion_enviada ? (
            <button 
              className="d-flex btn-primario-s text-decoration-underline" 
              onClick={handleClickOSCerrada}
            >
              Volver a Observaciones
            </button>
          ) : (
            <button 
              className="d-flex btn-primario-s text-decoration-underline" 
              onClick={handleEnviarClick}
            >
              Enviar observaciones
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenOS;
