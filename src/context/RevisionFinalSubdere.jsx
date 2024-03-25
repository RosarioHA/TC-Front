import { createContext, useCallback, useState } from "react";
import { useFormularioRevFinalSubdere } from "../hooks/revisionFinalSubdere/useFormularioRevFinalSubdere";
import { useRevFinalSubderePasos } from "../hooks/revisionFinalSubdere/useFormRevFinalPaso";
import { usePatchRevFinalSubderePaso } from "../hooks/revisionFinalSubdere/useFormRevFinalUpdate";


export const FormRevFinalSubdereContext = createContext();

export const FormRevFinalSubdereProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);


  const { dataFormRevFinalSubdere, loadingFormRevFinalSubdere, errorFormRevFinalSubdere } = useFormularioRevFinalSubdere(id);
  const { dataPasoRevFinalSubdere, loadingPasoRevFinalSubdere, errorPasoRevFinalSubdere, refetchTriggerSubdere } = useRevFinalSubderePasos(id, stepNumber);
  const { patchData, isLoading, error, response } = usePatchRevFinalSubderePaso();

  const updateFormId = useCallback((newId) => {
    setId(newId);
  }, []);

  // Utiliza la versión corregida de stepNumber aquí también
  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);

  const updatePasoRevFinalSubdere = useCallback(async (formData) => {
    try {
      await patchData(id, stepNumber, formData);
      // Después de actualizar, podrías querer refrescar los datos relevantes
      refetchTriggerSubdere();
    } catch (error) {
      console.error('Error updating data', error);
    }
  }, [id, stepNumber, patchData, refetchTriggerSubdere]);

  const handleUploadFiles = async (id, stepNumber, archivo, fieldName) => {
    try {
      const formData = new FormData();
      // Asegúrate de usar la clave correcta según lo espera el backend.
      formData.append(`paso${stepNumber}.${fieldName}`, archivo);
  
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
    dataFormRevFinalSubdere,
    loadingFormRevFinalSubdere,
    errorFormRevFinalSubdere,
    dataPasoRevFinalSubdere,
    loadingPasoRevFinalSubdere,
    errorPasoRevFinalSubdere,
    updateFormId,
    updateStepNumber, 
    patchLoading: isLoading,
    patchError: error,
    patchResponse: response,
    updatePasoRevFinalSubdere,
    handleUploadFiles,
    refetchTriggerSubdere
  };

  return (
    <FormRevFinalSubdereContext.Provider value={value}>
      {children}
    </FormRevFinalSubdereContext.Provider>
  );
};
