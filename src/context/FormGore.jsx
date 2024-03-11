import { createContext, useCallback, useState } from "react";
import { useFormularioGore } from "../hooks/fomularioGore/useFormularioGore";
import { useGorePasos } from "../hooks/fomularioGore/useFormGorePaso";
import { usePatchGorePaso } from "../hooks/fomularioGore/useFormGoreUpdate";

export const FormGOREContext = createContext();

export const FormGoreProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);


  const { dataFormGore, loadingFormGore, errorFormGore } = useFormularioGore(id);
  const { dataPasoGore, loadingPasoGore, errorPasoGore ,refetchTriggerGore } = useGorePasos(id, stepNumber);
  const { patchData, isLoading, error, response } = usePatchGorePaso();

  const updateFormId = useCallback((newId) => {
    setId(newId);
  }, []);

  // Utiliza la versión corregida de stepNumber aquí también
  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);

  const updatePasoGore = useCallback(async (formData) => {
    try {
      await patchData(id, stepNumber, formData);
      // Después de actualizar, podrías querer refrescar los datos relevantes
      refetchTriggerGore(); // Asume que esta función refresca los datos de los pasos
    } catch (error) {
      console.error('Error updating data', error);
    }
  }, [id, stepNumber, patchData, refetchTriggerGore]);

  const handleUploadFiles = async (id, stepNumber, archivo, fieldName) => {
    try {
      const formData = new FormData();
      // Asegúrate de usar la clave correcta según lo espera el backend.
      formData.append(`paso${stepNumber}_gore.${fieldName}`, archivo);
  
      const response = await patchData(id, stepNumber, {}, archivo); 
      if (response) {
        console.log("Archivo subido con éxito.");
        return true;
      } else {
        throw new Error("La subida del archivo falló.");
      }
    } catch (error) {
      throw new Error(`La subida del archivo falló: ${error.message}`);
    }
  };

  

  const value = {
    dataFormGore,
    loadingFormGore,
    errorFormGore,
    dataPasoGore,
    loadingPasoGore,
    errorPasoGore,
    updateFormId,
    updateStepNumber, 
    patchLoading: isLoading,
    patchError: error,
    patchResponse: response,
    updatePasoGore,
    handleUploadFiles,
    refetchTriggerGore
  };

  return (
    <FormGOREContext.Provider value={value}>
      {children}
    </FormGOREContext.Provider>
  );
};
