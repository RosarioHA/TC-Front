import { useContext, useState, useEffect, useCallback } from 'react';
import CustomTextarea from "../../forms/custom_textarea";
import { debounce } from 'lodash';
import CustomInput from "../../forms/custom_input";
import { DocumentsAditionals } from '../../commons/documents';
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_uno = ({ pasoData, id }) => {
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [formData, setFormData] = useState({
    paso1: {
      forma_juridica_organismo: pasoData?.paso1?.forma_juridica_organismo || '',
      mision_institucional: pasoData?.paso1?.mision_institucional || '',
      // otros campos si los hay
    }
  });
  // eslint-disable-next-line no-unused-vars
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    setFormData({
      formaJuridica: pasoData?.forma_juridica_organismo || '',
      formMision: pasoData?.mision_institucional || '',
      // actualiza otros campos si los hay
    });
  }, [pasoData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateBackend = useCallback(debounce(async (updatedData) => {
    try {
      await handleUpdatePaso(id, 1, updatedData);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  }, 2000), [id, handleUpdatePaso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    updateBackend({ ...formData, [name]: value });
  };


  const handleSave = async () => {
    try {
      // Asegúrate de que los datos estén estructurados como el backend espera
      await handleUpdatePaso(id, 1, formData.paso1);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const handleFilesChange = (newFiles) => {
    setSelectedFiles(newFiles);
  };

  if (!pasoData) {
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
            value={formData.formaJuridica}
            onChange={(e) => handleChange(e)}
            onBlur={handleSave}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-0">Corresponde a su naturaleza jurídica: centralizado o descentralizado, concentrado o desconcentrado.</h6>
          </div>
        </div>
        <div className="container-fluid pb-3">
          <DocumentsAditionals onFilesChanged={handleFilesChange} />
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
            name="formMision"
            value={formData.formMision}
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
