import { createContext, useState, useCallback } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';
import { useOrganigramaRegional } from '../hooks/formulario/useOrganigramaRegional';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);

  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial} = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso, refetchTrigger } = usePasoForm(id, stepNumber);
  const { patchStep, loading, error } = useUpdateForm();
  const {patchStepOrganigrama} = useOrganigramaRegional(); 

  console.log("dataFormSectorial en context FormSectorial", dataFormSectorial)

  const updateFormId = useCallback((newId) => {
    setId(newId);
  }, []);

  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);

  const  handleUpdatePaso = useCallback(async ( id, stepNumber,formData) => {
    try {
      await patchStep(id, stepNumber, formData);
      refetchTrigger(); 
    } catch (error) {
      console.error('Error updating data', error);
    }
  }, [patchStep, refetchTrigger]);

  const handleUploadFiles = async (id, stepNumber, archivos, fieldName) => {
    try {

      const formData = new FormData();
      formData.append(`paso${stepNumber}.${fieldName}`, archivos.get(fieldName)); 
      const response = await patchStepOrganigrama(id, stepNumber, formData);
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
