import { useContext, useEffect, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_Tres } from "../../components/formSectorial/paso3/p3.1";
import { FormularioContext } from "../../context/FormSectorial";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoTres = () =>
{
  const { handleUpdatePaso, updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const stepNumber = 3;
  const id = data.id;
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const observacionesEnviadas = observaciones?.observacion_enviada
  const formSectorialEnviado = data?.formulario_enviado

  const [ observacionPaso3, setObservacionPaso3 ] = useState("");
  const [ formData, setFormData ] = useState({
    universo_cobertura: "",
    descripcion_cobertura: ""
  });

  const [ inputStatus, setInputStatus ] = useState({
    universo_cobertura: { loading: false, saved: false },
    descripcion_cobertura: { loading: false, saved: false },
  });

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso3)
    {
      setObservacionPaso3(observaciones.observacion_paso3);
    }
    // Establecer datos del formulario basados en pasoData si están disponibles
    if (pasoData && pasoData.paso3)
    {
      setFormData({
        universo_cobertura: pasoData.paso3.universo_cobertura || "",
        descripcion_cobertura: pasoData.paso3.descripcion_cobertura || ""
      });
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones, pasoData ]);


  useEffect(() =>
  {
    if (pasoData && pasoData.paso3)
    {
      setFormData({
        universo_cobertura: pasoData.paso3.universo_cobertura || "",
        descripcion_cobertura: pasoData.paso3.descripcion_cobertura || "",
      });
    }
  }, [ pasoData ]);

  // if (!pasoData || !pasoData.paso3) {
  //   return <div>Cargando...</div>;
  // }

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

  const handleSave = async (inputName) =>
  {
    // Iniciar la carga
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { ...prevStatus[ inputName ], loading: true }
    }));

    // Preparar datos para enviar
    const datosParaEnviar = { paso3: { [ inputName ]: formData[ inputName ] } };

    try
    {
      await handleUpdatePaso(id, stepNumber, datosParaEnviar);

      // Actualizar estado basado en la operación de guardado
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: true }
      }));
    } catch (error)
    {
      console.error('Error saving data for', inputName, ':', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: false }
      }));
    }
  };



  if (!pasoData || !pasoData.paso3)
  {
    return <> <div className="d-flex align-items-center flex-column my-5 px-5 ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando paso 3</div>
      <span className="placeholder col-6 bg-primary"></span>
    </div></>;
  }


  const { cobertura_anual, paso3, solo_lectura } = pasoData;


  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        id: observaciones?.id,  // Asumiendo que 'observaciones' es un estado que contiene el 'id' sectorial
        observacion_paso3: observacionPaso3
      };

      await updateObservacion(observacionData);
    }
  };
  
  const avance = pasoData?.paso3?.avance;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso3?.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3?.nombre_paso}</h3>
            <Avance avance={avance} id={id} />
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
              <div className="container me-5 pe-5 border-bottom pb-2">
                <Subpaso_Tres esquemaDatos={cobertura_anual} id={id} stepNumber={stepNumber} solo_lectura={solo_lectura} />
              </div>
            </div>
          </div>

          {formSectorialEnviado && userSubdere && (
            <div className="mt-5 my-4">
              {!observacionPaso3.trim() && observacionesEnviadas ? (
                <p>No se han dejado observaciones en este paso.</p>
              ) : (
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
              )}
            </div>
          )}

          {/* Botones navegación */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso3?.numero_paso} id={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PasoTres;