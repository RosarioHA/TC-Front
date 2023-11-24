import { useCallback, useEffect, useState } from "react"
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";



export const useCompetencia = () =>
{
  const [ dataConpentencia, setDataCompetencia ] = useState([]);
  const [ loadingCompetencia, setLoadingComptencia ] = useState(true);
  const [ errorCompetencia, setErrorCompetencia ] = useState(null);
  const [ paginationCompetencia, setPaginationCompeencia ] = useState({ count: 0, next: null, previous: null });
  const [ currentPage, setCurrentPage ] = useState(1);


  const fetchCompetencias = useCallback(async () =>
  {
    setLoadingComptencia(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/competencias/?page=${currentPage}`);
      const { data, count, next, previous } = response
      setDataCompetencia(data);
      setPaginationCompeencia({ count, next, previous });
    } catch (err)
    {
      console.error(err)
      setErrorCompetencia(err);
    } finally
    {
      setLoadingComptencia(false);
    }
  }, [ currentPage ]);

  useEffect(() =>
  {
    fetchCompetencias();
  }, [ fetchCompetencias ]);

  const updatePage = (newPage) =>
  {
    setCurrentPage(newPage);
  }

  console.log(dataConpentencia)
  return { dataConpentencia, loadingCompetencia, errorCompetencia, paginationCompetencia, updatePage };

}