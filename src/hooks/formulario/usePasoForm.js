import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const usePasoForm = (id, stepNumber) =>
{
  const [ dataPaso, setDataPaso ] = useState(null);
  const [ loadingPaso, setLoadingPaso ] = useState(true);
  const [ errorPaso, setErrorPaso ] = useState(null);

  useEffect(() =>
    {
      const fetchData = async () => {
        try {
          const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
          setDataPaso(response.data);  // Aquí cambia a response.data
        } catch (err) {
          setErrorPaso(err);
        } finally {
          setLoadingPaso(false);
        }
      };

    if (id && stepNumber) {
      fetchData();
    }
  }, [id, stepNumber]);

  console.log('data paso', dataPaso)

  return { dataPaso, loadingPaso, errorPaso };
};