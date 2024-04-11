import { createContext, useState, useCallback } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);

  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial} = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso,refetchTrigger } = usePasoForm(id, stepNumber);
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
  
      const response = await patchStep(id, stepNumber, formData);
      if (response) {
        refetchTrigger(); // Para refrescar los datos
        // Devuelve un objeto con un indicador de éxito y los datos de la respuesta
        return { success: true, data: response };
      } else {
        console.error("Actualización del paso fallida. Respuesta del servidor:", response);
        return { success: false, data: null };
      }
    } catch (error) {
      console.error("Error durante la actualización del paso:", error);
      return { success: false, data: null };
    }
  };

  const handleUploadFiles = async (id, stepNumber, archivos, fieldName) => {
    try {

      const formData = new FormData();
      formData.append(`paso${stepNumber}.${fieldName}`, archivos.get(fieldName)); 
      const response = await patchStep(id, stepNumber, formData);
      if (response) {
        return true;
      } else {
        console.error("La subida del archivo falló. Respuesta del servidor:", response);
        throw new Error("La subida del archivo falló.");
      }
    } catch (error) {
      console.error("Error durante la subida de archivos:", error);
      const errorMessage = error.response ? error.response.data.message : error.message;
      throw new Error(`La subida del archivo falló: ${errorMessage}`);
    }
  };
  
  const handleUploadFilesOrganigramaregional = async (file, regionId, id, stepNumber) => {
    try {
        if (typeof id === 'undefined' || typeof stepNumber === 'undefined') {
            console.error("El ID o el stepNumber no están definidos.");
            return false;
        }
        const fieldName = `organigramaregional${regionId}`;

        const formData = new FormData();
        formData.append(fieldName, file);
        const response = await patchStep(id, stepNumber, formData);

        if (response && response.success) {
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
    pasoData:dataPaso,
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
    handleUploadFiles,
    handleUploadFilesOrganigramaregional,
    refetchTrigger,
  };

  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};
