import { useCallback, useState } from "react"
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";


export const useUpdateForm = () => {
  const [ isUpdatingPaso , setIsUpdatePaso ] = useState(false); 
  const [ updatePasoError, SetUpdatePasoError] = useState(null); 

  const updatePaso = useCallback(async ( id, stepNumber, datosPaso) => {
    setIsUpdatePaso(true);
    SetUpdatePasoError(null); 

    try {
      const pasoKey = `paso${stepNumber}`;
      const requestBody = {[pasoKey]: datoPaso }; 
      
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, requestBody);
    }catch(error) {
      SetUpdatePasoError(error);

    } finally{
      setIsUpdatePaso(false);
    }
    },[]);

    return { updatePaso, isUpdatingPaso, updatePasoError}
  } 
