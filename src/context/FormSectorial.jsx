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
    if (!archivos || !(archivos instanceof FormData) || !archivos.has(fieldName)) {
      throw new Error("No hay archivos para subir");
    }

    // Llama a una función específica para subir archivos
    const response = await patchStep(id, stepNumber, archivos);

    // Verifica la respuesta para asegurar que la subida fue exitosa
    if (response.ok) {
      return true; // Indica éxito
    } else {
      throw new Error("La subida del archivo falló");
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
  };

  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};
