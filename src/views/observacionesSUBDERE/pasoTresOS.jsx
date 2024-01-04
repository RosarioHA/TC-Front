import { useContext, useEffect, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_TresOS } from "../../components/obsSUBDERE/paso3/p3.1OS";
import { FormularioContext } from "../../context/FormSectorial";
import { MonoStepers } from "../../components/stepers/MonoStepers";

const PasoTresOS = () => {
  const [ observacionSubdere, setObservacionSubdere ] = useState('');
  const {
    updateStepNumber,
    data,
    pasoData
  } = useContext(FormularioContext);
  const stepNumber = 3;

  useEffect(() => {
    console.log("pasoData:", pasoData);
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber, pasoData]);

  if (!pasoData || !pasoData.paso3) {
    console.log("No hay datos disponibles para el Paso 3", pasoData);
    return <div>No hay datos disponibles para el Paso 3</div>;
  }

  const { cobertura_anual, paso3 } = pasoData;

  const handleObservacionChange = (event) => {
    const observacion = event.target.value;
    setObservacionSubdere(observacion);
  };

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso3.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3">{paso3.nombre_paso}</h3>
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
                  readOnly={true}
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
                  name="descripcion_cobertura" 
                  readOnly={true}
                />
                <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                  <i className="material-symbols-rounded me-2">info</i>
                  <h6 className="mt-0">
                    La descripción de la cobertura efectiva debe responder preguntas
                    tales como: ¿Cuál es? ¿Cómo se selecciona?.
                  </h6>
                </div>
              </div>
              <div className="container-fluid me-5 pe-5">
                <Subpaso_TresOS esquemaDatos={cobertura_anual} />
              </div>
            </div>
          </div>

          <div className="col-11">
            <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            maxLength={500}
            rows={10}
            readOnly={false}
            value={observacionSubdere}
            onChange={handleObservacionChange}/>
            <div className="d-flex mb-3 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="mt-1">Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo </h6>
            </div>
          </div>

          {/* Botones navegación */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso3.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PasoTresOS;