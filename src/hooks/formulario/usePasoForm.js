import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const usePasoForm = (id, stepNumber) => {
  const [dataPaso, setDataPaso] = useState(null);
  const [loadingPaso, setLoadingPaso] = useState(true);
  const [errorPaso, setErrorPaso] = useState(null);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPaso(true);
        const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
        setDataPaso(response.data);
      } catch (err) {
        console.error("Error al obtener datos del paso:", err);
        setErrorPaso(err.response ? err.response.data : err.message);
      } finally {
        setLoadingPaso(false);
      }
    };

    // Verifica si id y stepNumber son válidos antes de hacer la llamada a la API
    if (id != null && stepNumber != null) {
      console.log(`Realizando llamada a la API con id: ${id}, stepNumber: ${stepNumber}`);
      fetchData();
    } else {
      console.log("id o stepNumber no están establecidos. id:", id, "stepNumber:", stepNumber);
      setDataPaso(null);
      setLoadingPaso(false);
      setErrorPaso(null);
    }
  }, [id, stepNumber]);

  return { dataPaso, loadingPaso, errorPaso };
};
