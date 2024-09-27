import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";


export const useSubderePasos = (id, stepNumber) => {
  const [ dataPasoSubdere , setDataPasoSubdere]= useState(null);
  const [ loadingPasoSubdere, setLoadingPasoSubdere] = useState(true); 
  const [ errorPasoSubdere, setErrorPasoSubdere] = useState(null); 

  const fetchData = useCallback( async ()=>{
    try{
      setLoadingPasoSubdere(true); 
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${id}/paso-${stepNumber}/`);
      setDataPasoSubdere(response.data);
    } catch(err){
      setErrorPasoSubdere(err.response ? err.response.daa : err.message); 
    } finally {
      setLoadingPasoSubdere(false);
    }
  }, [id, stepNumber]);

  useEffect(()=>{
    if (id != null && stepNumber != null){
      fetchData();
    }else {
      setDataPasoSubdere(null);
      setLoadingPasoSubdere(false);
      setErrorPasoSubdere(null); 
    }
  }, [id, stepNumber, fetchData]);

  return { dataPasoSubdere, loadingPasoSubdere, errorPasoSubdere, refetchTriggerSubdere: fetchData}; 

}