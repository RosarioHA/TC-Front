import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia.js";



export const useRegion = () =>
{
  const [ dataRegiones, setDataRegiones ] = useState([]);
  const [ loadingRegiones, setLoadingRegiones ] = useState(true);
  const [ errorRegiones, setErrorRegiones ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const response = await apiTransferenciaCompentencia.get('region/v1/');
        setDataRegiones(response.data);
        setLoadingRegiones(false);
      } catch (error)
      {
        setErrorRegiones(error);
        setLoadingRegiones(false);
      }
    }
    fetchData();
  }, []);
  return { dataRegiones, loadingRegiones, errorRegiones };
}