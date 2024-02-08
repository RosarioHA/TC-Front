import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useCompetencia = (id) =>
{
  // Estados y funciones para 'lista-home'
  const [ dataCompetencia, setDataCompetencia ] = useState([]);
  const [ paginationListaHome, setPaginationListaHome ] = useState({ count: 0, next: null, previous: null });
  const [ currentPageListaHome, setCurrentPageListaHome ] = useState(1);

  // Estados y funciones para 'competencias'
  const [ dataListCompetencia, setDataListCompetencia ] = useState([]);
  const [ paginationCompetencia, setPaginationCompetencia ] = useState({ count: 0, next: null, previous: null });
  const [ currentPageCompetencia, setCurrentPageCompetencia ] = useState(1);

  // Otros estados
  const [ competenciaDetails, setCompetenciaDetails ] = useState([]);
  const [ loadingCompetencia, setLoadingComptencia ] = useState(true);
  const [ errorCompetencia, setErrorCompetencia ] = useState(null);

  // Estados para filtros y búsqueda
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ filterRegion, setFilterRegion ] = useState(null);
  const [ filterSector, setFilterSector ] = useState(null);


  const fetchCompetencias = useCallback(async () =>
  {
    setLoadingComptencia(true);
    try
    {
      // Realizar la solicitud con la URL modificada
      const response = await apiTransferenciaCompentencia.get(`/competencias/lista-home/?page=${currentPageListaHome}`);
      const { data } = response;
      setDataCompetencia(data.results);
      setPaginationListaHome({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err)
    {
      console.error(err);
      setErrorCompetencia(err);
    } finally
    {
      setLoadingComptencia(false);
    }
  }, [ currentPageListaHome]);


  // Funciones para actualizar los filtros y búsqueda
  const updateSearchTerm = (term) =>
  {
    setSearchTerm(term);
  };

  const updateFilterRegion = (regionId) =>
  {
    setFilterRegion(regionId);
  };

  const updateFilterSector = (sectorId) =>
  {
    setFilterSector(sectorId);
  };




  const fetchListaCompentencias = useCallback(async () =>
  {
    try
    {
      // Construir la URL con parámetros de búsqueda y filtros
      let url = `/competencias/?page=${currentPageCompetencia}`;
      if (searchTerm)
      {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (filterRegion)
      {
        url += `&region_id=${filterRegion}`;
      }
      if (filterSector)
      {
        url += `&sector_id=${filterSector}`;
      }
      const response = await apiTransferenciaCompentencia.get(url);
      setDataListCompetencia(response.data.results);
      setPaginationCompetencia({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error(err);
      setErrorCompetencia(err);
    }
  }, [currentPageCompetencia, filterRegion, filterSector, searchTerm]);


  const updateUrl = (url) => {
    setCurrentPageCompetencia(url);
  };

  const fetchCompetenciaDetails = useCallback(async (id) =>
  {
    setLoadingComptencia(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/competencias/${id}/`);
      setCompetenciaDetails(response.data);
    } catch (err)
    {
      setErrorCompetencia(err);
    } finally
    {
      setLoadingComptencia(false);
    }
  }, []);

  useEffect(() => {
    fetchListaCompentencias();
  }, [searchTerm, fetchListaCompentencias]);

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
    paginationListaHome,
    paginationCompetencia,
    updateSearchTerm,
    updateFilterRegion,
    updateFilterSector,
    updateUrl,
    currentPageCompetencia,
    setCurrentPageCompetencia,
    setCurrentPageListaHome ,
    currentPageListaHome
  };
};
