import { createContext, useCallback, useState } from "react";
import { useFormularioSubdere } from "../hooks/revisionFinalSubdere/useFormularioSubdere";
import { useSubderePasos } from "../hooks/revisionFinalSubdere/useFormRevFinalPaso";
import { usePatchSubderePaso } from "../hooks/revisionFinalSubdere/useFormRevFinalUpdate";


export const FormSubdereContext = createContext();

export const FormSubdereProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [stepNumber, setStepNumber] = useState(null);
  const [permisoPaso2, setPermisoPaso2] = useState(false);


  const { dataFormSubdere, loadingFormSubdere, errorFormSubdere } = useFormularioSubdere(id);
  const { dataPasoSubdere, loadingPasoSubdere, errorPasoSubdere, refetchTriggerSubdere } = useSubderePasos(id, stepNumber);
  const { patchData, isLoading, error, response } = usePatchSubderePaso();

  const updateFormId = useCallback((newId) => {
    setId(newId);
  }, []);

  // Utiliza la versión corregida de stepNumber aquí también
  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);

  const updatePasoSubdere = useCallback(async (formData) => {
    try {
      await patchData(id, stepNumber, formData);
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
        return true;
      } else {
        throw new Error("La subida del archivo falló.");
      }
    } catch (error) {
      throw new Error(`La subida del archivo falló: ${error.message}`);
    }
  };

  

  const value = {
    dataFormSubdere,
    loadingFormSubdere,
    errorFormSubdere,
    dataPasoSubdere,
    loadingPasoSubdere,
    errorPasoSubdere,
    updateFormId,
    updateStepNumber, 
    patchLoading: isLoading,
    patchError: error,
    patchResponse: response,
    updatePasoSubdere,
    handleUploadFiles,
    refetchTriggerSubdere,
    permisoPaso2, // Añade el estado al valor del contexto
    setPermisoPaso2, // Añade la función para actualizar el estado
  };

  return (
    <FormSubdereContext.Provider value={value}>
      {children}
    </FormSubdereContext.Provider>
  );
};
