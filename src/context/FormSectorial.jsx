import { createContext, useState, useCallback } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) =>
{
  const initialId = localStorage.getItem('formId') || null;
  const initialStepNumber = localStorage.getItem('stepNumber') || null;

  const [ id, setId ] = useState(initialId);
  const [ stepNumber, setStepNumber ] = useState(initialStepNumber);

  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber);
  const { patchStep, loading, error,createFormDataPayload } = useUpdateForm();


  const updateFormId = (newId) =>
  {
    setId(newId);
    localStorage.setItem('formId', newId);
  };

  const updateStepNumber = (newStepNumber) =>
  {
    setStepNumber(newStepNumber);
    localStorage.setItem('stepNumber', newStepNumber);
  };


  const handleUpdatePaso = async (id, stepNumber, formData) =>
  {
    try
    {
      if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0)
      {
        throw new Error("Datos del paso son inválidos");
      }

      await patchStep(id, stepNumber, formData);
      recargarDatos();
      return true; // Indica éxito
    } catch (error)
    {
      console.error("Error al guardar los datos:", error);
      return false; // Indica fracaso
    }
  }

  const handleUploadFiles = async (id, stepNumber, archivos, fieldName) => {
    console.log("FormData en handleUploadFiles:", archivos);
  
    if (!archivos || !(archivos instanceof FormData) || !archivos.has(fieldName)) {
      throw new Error("No hay archivos para subir");
    }
      // Llama a una función específica para subir archivos
      console.log("FormData antes de la subida:", archivos);
      const response = await patchStep(id, stepNumber, archivos);

      // Verifica la respuesta para asegurar que la subida fue exitosa
      if (response.ok)
      {

        recargarDatos();
        return true; // Indica éxito
      } else
      {
        // Si la subida no fue exitosa, maneja este caso adecuadamente
        throw new Error("La subida del archivo falló");
      }

  };
  // Función para recargar los datos actualizados
  const recargarDatos = useCallback(async () =>
  {
    try
    {
      setId(id);
      setStepNumber(stepNumber);
    } catch (error)
    {
      console.error("Error al recargar datos:", error);
    }
  }, [ id, stepNumber ]);

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial || loading,
    error: errorFormSectorial || error,
    updateFormId,
    pasoData: dataPaso,
    recargarDatos,
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
    handleUploadFiles,
    createFormDataPayload
  };


  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};