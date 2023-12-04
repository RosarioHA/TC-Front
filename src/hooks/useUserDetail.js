import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../services/transferenciaCompetencia';
import { useRegionComuna } from './useRegionComuna';
import { useSector } from "./useSector";

export const useUserDetails = (userId) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dataRegiones } = useRegionComuna();
  const { dataSector} = useSector();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiTransferenciaCompentencia.get(`/users/${userId}/`);
        const { data } = response;

        // Obtiene el nombre de la region correspondiente al ID
        const regionData = dataRegiones.find(region => region.id === data.region);
        const regionName = regionData ? regionData.region : null;
        // Obtiene el nombre del sector correspondiente al ID
        const sectorData = dataSector.find(sector => sector.id === data.sector);
        const sectorName = sectorData ? sectorData.sector : null;

        // Añade el nombre de la región al objeto de detalles del usuario
        setUserDetails({
          ...data,
          region: regionName,
          sector: sectorName,
        });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, dataRegiones, dataSector]);

  return { userDetails, loading, error };
};