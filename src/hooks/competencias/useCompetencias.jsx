import { useCallback, useEffect, useState } from "react"
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";
export const useCompetencia = (id) =>
{
  const [ dataCompetencia, setDataCompetencia ] = useState([]);
  const [ dataListCompetencia, setDataListCompetencia ] = useState([]);
  const [ competenciaDetails, setCompetenciaDetails ] = useState([]);
  const [ loadingCompetencia, setLoadingComptencia ] = useState(true);
  const [ errorCompetencia, setErrorCompetencia ] = useState(null);
  const [ paginationCompetencia, setPaginationCompeencia ] = useState({ count: 0, next: null, previous: null });
  const [ currentPage, setCurrentPage ] = useState(1);


  const fetchCompetencias = useCallback(async () =>
  {
    setLoadingComptencia(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/competencias/lista-home/?page=${currentPage}`);
      const { data, count, next, previous } = response
      setDataCompetencia(data.results);
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


  const fetchListaCompentencias = useCallback(async () =>
  {
    try
    {
      const response = await apiTransferenciaCompentencia.get('competencias/');
      setDataListCompetencia(response.data);
    } catch (err)
    {
      console.error(err);
    }
  }, []);


  const updatePage = (newPage) =>
  {
    setCurrentPage(newPage);
  }


  const fetchCompetenciaDetails = useCallback(async (id) =>
  {
    setLoadingComptencia(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`competencias/${id}/`);
      setCompetenciaDetails(response.data);
    } catch (err)
    {
      setErrorCompetencia(err);
    } finally
    {
      setLoadingComptencia(false);
    }
  }, []);

  useEffect(() =>
  {
    if (id)
    {
      fetchCompetenciaDetails(id);
    } else
    {
      fetchCompetencias();
      fetchListaCompentencias();
    }
  }, [ id, fetchCompetencias, fetchListaCompentencias, fetchCompetenciaDetails ]);

  return {
    dataCompetencia,
    dataListCompetencia,
    competenciaDetails,
    loadingCompetencia,
    errorCompetencia,
    paginationCompetencia,
    updatePage
  };

}