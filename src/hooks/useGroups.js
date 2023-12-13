import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia.js";

export const useGroups= () =>
{
  const [ dataGroups, setDataGroups ] = useState([]);
  const [ loadingGroups, setLoadingGroups ] = useState(true);
  const [ errorGroups, setErrorGroups ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const response = await apiTransferenciaCompentencia.get('groups/');
        setDataGroups(response.data);
        setLoadingGroups(false);
      } catch (error)
      {
        setErrorGroups(error);
        setLoadingGroups(false);
      }
    }
    fetchData();
  }, []);
  return { dataGroups, loadingGroups, errorGroups };
}