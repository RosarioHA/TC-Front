import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";


export const useRevFinalSubderePasos = (id, stepNumber) => {
  const [ dataPasoRevFinalSubdere , setDataPasoRevFinalSubdere]= useState(null);
  const [ loadingPasoRevFinalSubdere, setLoadingPasoRevFinalSubdere] = useState(true); 
  const [ errorPasoRevFinalSubdere, setErrorPasoRevFinalSubdere] = useState(null); 

  const fetchData = useCallback( async ()=>{
    try{
      setLoadingPasoRevFinalSubdere(true); 
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${id}/paso-${stepNumber}/`);
      setDataPasoRevFinalSubdere(response.data);
    } catch(err){
      setErrorPasoRevFinalSubdere(err.response ? err.response.daa : err.message); 
    } finally {
      setLoadingPasoRevFinalSubdere(false);
    }
  }, [id, stepNumber]);

  useEffect(()=>{
    if (id != null && stepNumber != null){
      fetchData();
    }else {
      setDataPasoRevFinalSubdere(null);
      setLoadingPasoRevFinalSubdere(false);
      setErrorPasoRevFinalSubdere(null); 
    }
  }, [id, stepNumber, fetchData]);

  return {dataPasoRevFinalSubdere, loadingPasoRevFinalSubdere, errorPasoRevFinalSubdere, refetchTriggerGore: fetchData}; 

}