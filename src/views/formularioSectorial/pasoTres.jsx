import { useContext, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import CustomTextarea from "../../components/forms/custom_textarea";
import { Subpaso_Tres } from "../../components/formSectorial/paso3/p3.1";
import { FormularioContext } from "../../context/FormSectorial";
import { MonoStepers } from "../../components/stepers/MonoStepers";

//rosario: solo copia las secciones marcadas con GET en el clon del paso 3//
//GET//
const PasoTres = () => {
  const {
    handleUpdatePaso,
    updateStepNumber,
    data,
    pasoData
  } = useContext(FormularioContext);
  const stepNumber = 3;

  //PATCH
  const [formData, setFormData] = useState({
    universo_cobertura: '',
    descripcion_cobertura: '',
  });


  //GET
  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  //PATCH
  useEffect(() => {
    if (pasoData?.paso3) {
      setFormData({
        universo_cobertura: pasoData.paso3.universo_cobertura || '',
        descripcion_cobertura: pasoData.paso3.descripcion_cobertura || '',
      });
    }
  }, [pasoData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateBackend = useCallback(debounce(async (updatedData) => {
    try {
      await handleUpdatePaso(data.id, stepNumber, updatedData);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  }, 2000), [data.id, stepNumber]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    updateBackend({
      universo_cobertura: formData.universo_cobertura,
      descripcion_cobertura: formData.descripcion_cobertura,
    });
  };

  const handleSave = () => {
    handleUpdatePaso(data.id, stepNumber, formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    handleSave(); 
  };

  useEffect(() => {
    return () => {
      updateBackend.cancel();
    };
  }, [updateBackend]);

 //GET 
  if (!pasoData || !pasoData.paso3) return <div>No hay datos disponibles para el Paso 3</div>;

  const { cobertura_anual, paso3 } = pasoData;

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
                  value={formData.universo_cobertura}
                  onChange={handleChange}
                  maxLength={800}
                  onBlur={handleSave}
                  onSubmit={handleSubmit}
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
                  maxLength={800}
                  value={formData.descripcion_cobertura}
                  onChange={handleChange}
                  onBlur={handleSave}
                  onSubmit={handleSubmit}
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
                <Subpaso_Tres esquemaDatos={cobertura_anual} />
              </div>
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

export default PasoTres;