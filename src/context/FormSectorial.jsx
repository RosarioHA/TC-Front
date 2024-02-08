import { createContext, useState, useCallback } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);

  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber);
  const { patchStep, loading, error } = useUpdateForm();

  const updateFormId = useCallback((newId) => {
    setId(newId);
  }, []);

  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);


  const handleUpdatePaso = async (id, stepNumber, formData) => {
    try {
      if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
        throw new Error("Datos del paso son inválidos");
      }

      await patchStep(id, stepNumber, formData);
      // La función recargarDatos ha sido eliminada, suponiendo que patchStep ya maneja la actualización necesaria.
      return true; // Indica éxito
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      return false; // Indica fracaso
    }
  };

  const handleUploadFiles = async (id, stepNumber, archivos, fieldName) => {
    try {
      console.log(`ID: ${id}, StepNumber: ${stepNumber}, FieldName: ${fieldName}`);
      console.log(`Archivos es FormData: ${archivos instanceof FormData}`);
  
      // Asegúrate de que el campo del formulario coincida con el formato esperado por el backend
      const formData = new FormData();
      formData.append(`paso${stepNumber}.${fieldName}`, archivos.get(fieldName)); // Utiliza el nombre del campo esperado por el backend
  
      const response = await patchStep(id, stepNumber, formData);
      console.log('Respuesta del servidor:', response);
  
      if (response) {
        console.log("Archivo subido con éxito.");
        return true; // Indica éxito
      } else {
        console.error("La subida del archivo falló. Respuesta del servidor:", response);
        throw new Error("La subida del archivo falló.");
      }
    } catch (error) {
      console.error("Error durante la subida de archivos:", error);
      // Mejor manejo de errores basado en el error o la respuesta del servidor
      const errorMessage = error.response ? error.response.data.message : error.message;
      throw new Error(`La subida del archivo falló: ${errorMessage}`);
    }
  };
  
  const handleUploadFilesOrganigramaregional = async (file, regionId, id, stepNumber) => {
    console.log('file', file)
    try {
        if (typeof id === 'undefined' || typeof stepNumber === 'undefined') {
            console.error("El ID o el stepNumber no están definidos.");
            return false;
        }

        // Construye el nombre del campo en función del ID de la región
        const fieldName = `organigramaregional${regionId}`;

        const formData = new FormData();
        formData.append(fieldName, file);

        console.log(`Subiendo archivo para: ${fieldName} con ID: ${id} y StepNumber: ${stepNumber}`);
        console.log('formData:', formData); // Agregado para verificar formData

        const response = await patchStep(id, stepNumber, formData);

        if (response && response.success) {
            console.log("Archivo subido con éxito para:", fieldName);
            return true;
        } else {
            console.error("La subida del archivo falló para:", fieldName, ". Respuesta del servidor:", response);
            return false;
        }
    } catch (error) {
        console.error("Error durante la subida de archivos:", error);
        return false;
    }
};

  

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial || loading,
    error: errorFormSectorial || error,
    updateFormId,
    pasoData: dataPaso,
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
    handleUploadFiles,
    handleUploadFilesOrganigramaregional,
  };

  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};
