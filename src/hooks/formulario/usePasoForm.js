import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const usePasoForm = (id, stepNumber) =>
{
  const [ dataPaso, setDataPaso ] = useState(null);
  const [ loadingPaso, setLoadingPaso ] = useState(true);
  const [ errorPaso, setErrorPaso ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        setLoadingPaso(true);
        const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
        const pasoKey = `paso${stepNumber}`;
        setDataPaso(response.data[pasoKey]);
      } catch (err)
      {
        setErrorPaso(err);
      } finally
      {
        setLoadingPaso(false);
      }
    };

    if (id && stepNumber)
    {
      fetchData();
    }
  }, [ id, stepNumber ]);

  return { dataPaso, loadingPaso, errorPaso };
};