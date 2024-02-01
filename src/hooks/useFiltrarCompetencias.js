import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia.js";

export const useFiltroCompetencias = (regionId, sectorId) => {
  const [dataFiltroCompetencias, setDataFiltroCompetencias] = useState([]);
  const [loadingFiltroCompetencias, setLoadingFiltroCompetencias] = useState(true);
  const [errorFiltroCompetencias, setErrorFiltroCompetencias] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'competencias/filtrar-por-criterio/';
        if (regionId || sectorId) {
          const params = new URLSearchParams();
          if (regionId) params.append('region_id', regionId);
          if (sectorId) params.append('sector_id', sectorId);
          url += `?${params.toString()}`;
        }

        const response = await apiTransferenciaCompentencia.get(url);
        setDataFiltroCompetencias(response.data);
      } catch (error) {
        setErrorFiltroCompetencias(error);
      } finally {
        setLoadingFiltroCompetencias(false);
      }
    };

    fetchData();
  }, [regionId, sectorId]); // Dependencias: regionId y sectorId
  
  return { dataFiltroCompetencias, loadingFiltroCompetencias, errorFiltroCompetencias };

};
