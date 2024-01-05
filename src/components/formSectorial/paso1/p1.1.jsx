import { useContext, useState, useEffect} from 'react';
import CustomTextarea from "../../forms/custom_textarea";
import CustomInput from "../../forms/custom_input";
//import { DocumentsAditionals } from '../../commons/documents';
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_uno = ({ pasoData, id , stepNumber}) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [ formData, setFormData ] = useState({
    paso1: pasoData.paso1 || {
      forma_juridica_organismo: '',
      mision_institucional: '',
    }
  });

  useEffect(() =>
  {
    if (pasoData && pasoData.paso1)
    {
      setFormData({ paso1: pasoData.paso1 });
    }
  }, [ pasoData ]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      paso1: {
        ...prevFormData.paso1,
        [name]: value,
      }
    }));
  };
  
  const handleSave = async () => {
    try {
      // Crear una copia de formData.paso1 para manipular
      const updatedData = { ...formData.paso1 };
  
      // Eliminar campos vacíos del objeto updatedData
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] === '') {
          delete updatedData[key];
        }
      });
  
      // Asegúrate de que la estructura de la carga útil coincida con lo que espera el servidor
      const payload = {
        id: id, // Asumiendo que 'id' es necesario
        paso1: updatedData,
        // Incluye aquí otros campos como 'marcojuridico', 'organigramaregional', etc., si son necesarios
      };
  
      const response = await handleUpdatePaso(id, stepNumber, payload);
    
    
    // Actualiza el estado local con los datos actualizados
    if (response && response.paso1) {
      setFormData({ paso1: response.paso1 });
    }

  
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };
  

  if (!pasoData)
  {
    return <div>Cargando datos...</div>;
  }

  return (
    <>
      <div className="pe-5 me-5 mt-4">
        <span className="my-4 text-sans-h4">1.1 Ficha de descripción organizacional</span>
        <div className="my-4">
          <CustomInput
            label="Denominación del organismo"
            placeholder="Escriba la denominación del organismo"
            id={pasoData?.denominacion_organismo}
            value={pasoData?.denominacion_organismo}
            disabled={true}
            readOnly={false}
            name="denominacion_organismo"
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Forma jurídica del organismo (Obligatorio)"
            placeholder="Debes llenar este campo para poder enviar el formulario."
            name="forma_juridica_organismo"
            value={pasoData?.forma_juridica_organismo}
            onChange={handleChange}
            onBlur={handleSave}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-0">Corresponde a su naturaleza jurídica: centralizado o descentralizado, concentrado o desconcentrado.</h6>
          </div>
        </div>
        <div className="container-fluid pb-3">
          {/*<DocumentsAditionals onFilesChanged="" />*/}
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Descripción archivo(s) de marco jurídico (Opcional)"
            placeholder="Descripción del marco jurídico"
            name="formMision"
            value={formData.formMision}
            onChange={handleChange}
            onBlur={handleSave}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Misión Institucional (Obligatorio)"
            placeholder="Misión que defina el propósito de ser del organismo"
            name="mision_institucional"
            value={pasoData?.mision_institucional}
            onChange={handleChange}
            onBlur={handleSave}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Información adicional (Opcional)"
            placeholder="Escribe información adicional de ser necesario"
            id={pasoData.informacion_adicional_marco_juridico}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Llenar en caso de existir información que no sea posible clasificar en alguna de las categorías anteriores y que responda a particularidades propias del organismos.</h6>
          </div>
        </div>
      </div>
    </>
  );
};