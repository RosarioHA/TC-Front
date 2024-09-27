import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";


export const useGorePasos = (id, stepNumber) => {
  const [ dataPasoGore , setDataPasoGore]= useState(null);
  const [ loadingPasoGore, setLoadingPasoGore] = useState(true); 
  const [ errorPasoGore, setErrorPasoGore] = useState(null); 

  const fecthData = useCallback( async ()=>{
    try{
      setLoadingPasoGore(true); 
      const response = await apiTransferenciaCompentencia.get(`/formulario-gore/${id}/paso-${stepNumber}/`);
      setDataPasoGore(response.data);
    } catch(err){
      setErrorPasoGore(err.response ? err.response.daa : err.message); 
    } finally {
      setLoadingPasoGore(false);
    }
  }, [id, stepNumber]);

  useEffect(()=>{
    if (id != null && stepNumber != null){
      fecthData();
    }else {
      setDataPasoGore(null);
      setLoadingPasoGore(false);
      setErrorPasoGore(null); 
    }
  }, [id, stepNumber, fecthData]);

  return {dataPasoGore, loadingPasoGore, errorPasoGore, refetchTriggerGore: fecthData}; 

}