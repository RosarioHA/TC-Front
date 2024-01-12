import { useCallback, useEffect, useState } from "react"
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useCompetencia = (id) => {
  const [ dataCompetencia, setDataCompetencia ] = useState([]);
  const [ dataListCompetencia, setDataListCompetencia ] = useState([]);
  const [ competenciaDetails, setCompetenciaDetails ] = useState([]);
  const [ loadingCompetencia, setLoadingComptencia ] = useState(true);
  const [ errorCompetencia, setErrorCompetencia ] = useState(null);
  const [ paginationCompetencia, setPaginationCompetencia ] = useState({ count: 0, next: null, previous: null });
  const [ currentPage, setCurrentPage ] = useState(1);

  const fetchCompetencias = useCallback(async () => {
    setLoadingComptencia(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/competencias/lista-home/?page=${currentPage}`);
      const { data } = response
      
      setDataCompetencia(data.results);
      setPaginationCompetencia({ 
        count: data.count, 
        next: data.next, 
        previous: data.previous, 
      });
    } catch (err) {
      console.error(err)
      setErrorCompetencia(err);
    } finally {
      setLoadingComptencia(false);
    }
  }, [ currentPage ]);

  const fetchListaCompentencias = useCallback(async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/competencias/?page=${currentPage}`);
      setDataListCompetencia(response.data);
      setPaginationCompetencia({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error(err);
      setErrorCompetencia(err);
    }
  }, [currentPage]);

  const updatePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchCompetenciaDetails = useCallback(async (id) => {
    setLoadingComptencia(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`competencias/${id}/`);
      setCompetenciaDetails(response.data);
    } catch (err) {
      setErrorCompetencia(err);
    } finally {
      setLoadingComptencia(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCompetenciaDetails(id);
    } else {
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