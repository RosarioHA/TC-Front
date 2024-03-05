import { createContext, useCallback, useState } from "react";
import { useFormularioGore } from "../hooks/fomularioGore/useFormularioGore";
import { useGorePasos } from "../hooks/fomularioGore/useFormGorePaso";


export const FormGOREContext = createContext(); 

export  const FormGoreProvider = ({ children}) => {
  const [ id, setId] = useState(null); 
  const [ StepNumber, setStepNumber] = useState(null); 

  const { dataFormGore, loadingFormGore, errorFormGore}  = useFormularioGore(id); 
  const { dataPasoGore , loadingPasoGore, errorPasoGore } = useGorePasos(id, StepNumber); 

  const updateFormId = useCallback((newId) => {
    setId(newId);
  },[]);


  const updateStepNumber = useCallback((newStepNumber) => {
    setStepNumber(newStepNumber);
  }, []);


  const value = {
    dataFormGore,
    loadingFormGore,
    errorFormGore,
    dataPasoGore,
    loadingPasoGore,
    errorPasoGore,
    updateFormId,
    updateStepNumber,
  }

  return (
    <FormGOREContext.Provider value={value}>
      {children}
    </FormGOREContext.Provider>
  )

}