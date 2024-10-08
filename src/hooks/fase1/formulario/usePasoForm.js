import { useState, useEffect, useCallback } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";

export const usePasoForm = (id, stepNumber,) => {
  const [dataPaso, setDataPaso] = useState(null);
  const [loadingPaso, setLoadingPaso] = useState(true);
  const [errorPaso, setErrorPaso] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoadingPaso(true);
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataPaso(response.data);
    } catch (err) {
      setErrorPaso(err.response ? err.response.data : err.message);
    } finally {
      setLoadingPaso(false);
    }
  }, [id, stepNumber]); 
  
  useEffect(() => {
    if (id != null && stepNumber != null) {
      fetchData();
    } else {
      setDataPaso(null);
      setLoadingPaso(false);
      setErrorPaso(null);
    }
  }, [id, stepNumber, fetchData]);

  return { dataPaso, loadingPaso, errorPaso, refetchTrigger: fetchData };
};
