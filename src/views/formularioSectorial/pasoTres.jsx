import { useContext, useEffect, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_Tres } from "../../components/formSectorial/paso3/p3.1";
import { FormularioContext } from "../../context/FormSectorial";

const PasoTres = () =>
{
  const {
    updatePaso,
    updateStepNumber,
    pasoData } = useContext(FormularioContext);

  const stepNumber = 3;


  const [ formData, setFormData ] = useState({});


  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);


  // Manejador para el evento onBlur
  const handleBlur = (name, value) =>
  {
    // Actualizar el estado local con los nuevos datos
    const updatedData = { ...formData, [ name ]: value };
    setFormData(updatedData);

    // Enviar datos actualizados al servidor
    updatePaso(updatedData);
  };

  // Manejador para cambios en los inputs
  const handleChange = (event) =>
  {
    setFormData({ ...formData, [ event.target.name ]: event.target.value });
  };


  return (
    <div className="container ">
      <div className="d-flex">
        <h3 className="mt-3">Cobertura de la Competencia</h3>
        <Avance />
      </div>
      <div className="container-fluid me-5 pe-5 text-sans-h6-primary">
        <h6 className=" me-5 pe-5">Este apartado tiene por objetivo conocer y cuantificar la
          cobertura de la competencia considerando sus diferentes unidades de medición.
          Se debe comparar el universo de cobertura con la cobertura efectivamente abordada en el ejercicio de la competencia.<br />
          <br />
          Aquellas competencias que estén orientadas a una población objetivo, se debe identificar la población potencial,
          así como los mecanismos para cuantificarla y seleccionar a los beneficiarios/as finales. Las competencias que tengan
          otras unidades de medida deben realizar la misma tarea.<br />
          <br />
          Si la competencia está asociada a un programa que cuente con evaluación ex ante, se debe considerar la información más actualizada.</h6>
      </div>
      <div className="container-fluid me-5 pe-5">
        <div className="pe-5 me-5 mt-4">

          <div className="my-4 me-4">
            <CustomTextarea
              label="Descripción de universo de cobertura (Obligatorio)"
              placeholder="Describe el universo de cobertura"
              name="universo_cobertura"
              maxLength={800}
              value={formData.universo_cobertura || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('universo_cobertura', formData.universo_cobertura)}
            />
            <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="mt-0">La descripción del universo de cobertura debe responder preguntas tales como: ¿Cuál es el universo? ¿Cómo se identifica?.</h6>
            </div>
          </div>
          <div className="my-4 me-4">
            <CustomTextarea
              label="Descripción de cobertura efectivamente abordada (Obligatorio)"
              placeholder="Describe la cobertura efectivamente abordada"
              id=''
              maxLength={800}
            />
            <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="mt-0">La descripción de la cobertura efectiva debe responder preguntas tales como: ¿Cuál es? ¿Cómo se selecciona?.</h6>
            </div>

          </div>
          <div className="container-fluid me-5 pe-5">
            <Subpaso_Tres  esquemaDatos={pasoData.cobertura_anual}/>
          </div>

        </div>

      </div>


      {/*Botones navegacion  */}
      <div className="container me-5 pe-5">
        <ButtonsNavigate step="3" id="paso3" />
      </div>
    </div>
  )
}
export default PasoTres; 