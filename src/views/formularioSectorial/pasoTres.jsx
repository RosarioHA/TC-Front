import { useContext, useEffect, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_Tres } from "../../components/formSectorial/paso3/p3.1";
import { FormularioContext } from "../../context/FormSectorial";
import { MonoStepers } from "../../components/stepers/MonoStepers";

const PasoTres = () =>
{
  const {
    handleUpdatePaso,
    updateStepNumber,
    data,
    pasoData,
    id } = useContext(FormularioContext);

  // Inicializa el estado local con los datos de paso3 si están disponibles
  const initialFormData = {
    universo_cobertura: pasoData?.paso3?.[ 0 ]?.universo_cobertura || '',
    cobertura_efectivamente_abordada: pasoData?.paso3?.[ 0 ]?.cobertura_efectivamente_abordada || ''
  };
  console.log('initialFormData:', initialFormData);

  const [ formData, setFormData ] = useState(initialFormData);


  useEffect(() =>
  {
    updateStepNumber(3);
  }, [ updateStepNumber ]);

  useEffect(() => {
    setFormData({
      universo_cobertura: pasoData?.paso3?.[0]?.universo_cobertura || '',
      cobertura_efectivamente_abordada: pasoData?.paso3?.[0]?.cobertura_efectivamente_abordada || ''
    });
  }, [pasoData]);


  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleBlur = async (name, value) =>
  {
    // Actualizar el estado local con los nuevos datos
    const updatedData = { ...formData, [ name ]: value };
    setFormData(updatedData);

    // Enviar datos actualizados al servidor
    try {
      await handleUpdatePaso(id, 3, { ...formData, [name]: value });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const { cobertura_anual, paso3 } = pasoData;

  // Asegúrate de que paso1 tenga elementos y accede al primer elemento
  const paso3Data = paso3 && paso3.length > 0 ? paso3[ 0 ] : null;
  if (!paso3Data) return <div>No hay datos disponibles para el Paso 3</div>;

  console.log(formData)

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso3Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container ">
          <div className="d-flex">
            <h3 className="mt-3">{paso3Data.nombre_paso}</h3>
            <Avance avance={paso3Data.avance} />
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
                  value={formData.universo_cobertura}
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
                  name="cobertura_efectivamente_abordada"
                  maxLength={800}
                  value={formData.cobertura_efectivamente_abordada}
                  onChange={handleChange}
                  onBlur={() => handleBlur('cobertura_efectivamente_abordada', formData.cobertura_efectivamente_abordada)}
                />
                <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                  <i className="material-symbols-rounded me-2">info</i>
                  <h6 className="mt-0">La descripción de la cobertura efectiva debe responder preguntas tales como: ¿Cuál es? ¿Cómo se selecciona?.</h6>
                </div>

              </div>
              <div className="container-fluid me-5 pe-5">
                <Subpaso_Tres esquemaDatos={cobertura_anual} />
              </div>

            </div>

          </div>


          {/*Botones navegacion  */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso3Data.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  )
}
export default PasoTres; 