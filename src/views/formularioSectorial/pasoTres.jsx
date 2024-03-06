import { useContext, useEffect, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_Tres } from "../../components/formSectorial/paso3/p3.1";
import { FormularioContext } from "../../context/FormSectorial";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoTres = () => {
  const {
    handleUpdatePaso,
    updateStepNumber,
    pasoData,
    data
  } = useContext(FormularioContext);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');

  const formularioEnviado = data.formulario_enviado
  const observacionesEnviadas = data.observacion_enviada
  const stepNumber = 3;
  const id= data.id;

  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [observacionPaso3, setObservacionPaso3] = useState("");

  // Estado inicial basado en los datos existentes
  const [formData, setFormData] = useState({
    universo_cobertura: pasoData.paso3?.universo_cobertura || "",
    descripcion_cobertura: pasoData.paso3?.descripcion_cobertura || ""
  });

  const [inputStatus, setInputStatus] = useState({
    universo_cobertura: { loading: false, saved: false },
    descripcion_cobertura: { loading: false, saved: false },
  });

  // Efecto para actualizar el número de paso actual
  useEffect(() => {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0) {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso3) {
      setObservacionPaso3(observaciones.observacion_paso3);
    }
  }, [updateStepNumber, stepNumber, observaciones, fetchObservaciones]);

  const handleChange = (inputName, e) =>
  {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
        [ inputName ]: value,
    }));
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { loading: false, saved: false }
    }));
  };

  // Manejador de guardado

  const handleSave = async (inputName) => {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [inputName]: { ...prevStatus[inputName], loading: true }
    }));
  
    // Preparar la estructura de datos esperada por el backend
    const datosParaEnviar = {
      paso3: {
        ...pasoData.paso3,
        ...formData 
      }
    };
  
    // Llamada a la función de actualización del contexto con los datos estructurados
    const success = await handleUpdatePaso(id, stepNumber, datosParaEnviar);
    if (success) {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: true }
      }));
    } else {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: false }
      }));
    }
  };
  // Si no hay datos para el paso 3, mostrar un mensaje
  if (!pasoData.paso3) return <div>No hay datos disponibles para el Paso 3</div>;

  const { cobertura_anual, paso3, solo_lectura } = pasoData;

  const handleGuardarObservacion = async () => {
    const observacionData = {
      observacion_paso3: observacionPaso3,
    };
    await updateObservacion(observacionData);
  };

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso3.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3.nombre_paso}</h3>
            <Avance avance={paso3.avance} />
          </div>
          <div className="container-fluid me-5 pe-5 text-sans-h6-primary">
            <h6 className="me-5 pe-5">
              Este apartado tiene por objetivo conocer y cuantificar la cobertura
              de la competencia considerando sus diferentes unidades de medición.
              Se debe comparar el universo de cobertura con la cobertura efectivamente
              abordada en el ejercicio de la competencia.
              <br />
              <br />
              Aquellas competencias que estén orientadas a una población objetivo,
              se debe identificar la población potencial, así como los mecanismos para
              cuantificarla y seleccionar a los beneficiarios/as finales. Las competencias
              que tengan otras unidades de medida deben realizar la misma tarea.
              <br />
              <br />
              Si la competencia está asociada a un programa que cuente con evaluación
              ex ante, se debe considerar la información más actualizada.
            </h6>
          </div>
          <div className="container-fluid me-5 pe-5">
            <div className="pe-5 me-5 mt-4">
              <div className="my-4 me-4">
                <CustomTextarea
                  label="Descripción de universo de cobertura (Obligatorio)"
                  placeholder="Describe el universo de cobertura"
                  name="universo_cobertura"
                  id="universo_cobertura"
                  value={paso3?.universo_cobertura}
                  onChange={(e) => handleChange('universo_cobertura', e)}
                  onBlur={() => handleSave('universo_cobertura')}
                  loading={inputStatus.universo_cobertura.loading}
                  saved={inputStatus.universo_cobertura.saved}
                  maxLength={800}
                  readOnly={solo_lectura}
                />
                <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                  <i className="material-symbols-rounded me-2">info</i>
                  <h6 className="mt-0">
                    La descripción del universo de cobertura debe responder preguntas
                    tales como: ¿Cuál es el universo? ¿Cómo se identifica?.
                  </h6>
                </div>
              </div>
              <div className="my-4 me-4">
                <CustomTextarea
                  label="Descripción de cobertura efectivamente abordada (Obligatorio)"
                  placeholder="Describe la cobertura efectivamente abordada"
                  id="descripcion_cobertura"
                  name="descripcion_coberturaa"
                  value={paso3?.descripcion_cobertura}
                  onChange={(e) => handleChange('descripcion_cobertura', e)}
                  onBlur={() => handleSave('descripcion_cobertura')}
                  loading={inputStatus.descripcion_cobertura.loading}
                  saved={inputStatus.descripcion_cobertura.saved}
                  maxLength={800}
                  readOnly={solo_lectura}
                />
                <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                  <i className="material-symbols-rounded me-2">info</i>
                  <h6 className="mt-0">
                    La descripción de la cobertura efectiva debe responder preguntas
                    tales como: ¿Cuál es? ¿Cómo se selecciona?.
                  </h6>
                </div>
              </div>
              <div className="container-fluid me-5 pe-5 border-bottom pb-2">
                <Subpaso_Tres esquemaDatos={cobertura_anual} id={id} stepNumber={stepNumber} solo_lectura={solo_lectura}/>
              </div>
            </div>
          </div>

          {userSubdere && formularioEnviado && (
            <div className="mt-5 my-4">
            <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            rows={5}
            maxLength={500}
            value={observacionPaso3}
            onChange={(e) => setObservacionPaso3(e.target.value)}
            readOnly={observacionesEnviadas}
            onBlur={handleGuardarObservacion}
            loading={loadingObservaciones}
            saved={saved}
            />
          </div>
          )}

          {/* Botones navegación */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso3.numero_paso} id={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PasoTres;