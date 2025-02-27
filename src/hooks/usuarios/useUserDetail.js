import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';
import { useRegion } from '../useRegion'
import { useSector } from "../useSector";

export const useUserDetails = (userId) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dataRegiones } = useRegion();
  const { dataSector } = useSector();

  const [regionOptions, setRegionOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiTransferenciaCompentencia.get(`/users/${userId}/`);
        const { data } = response;

        // Obtiene el nombre y el ID de la región correspondiente
        const regionData = dataRegiones.find((region) => region.id === data.region);
        const regionName = regionData ? regionData.region : null;
        const regionId = regionData ? regionData.id : null;  // Almacena el ID de la región


        // Agrega el nombre y el ID de la región y el sector al objeto de detalles del usuario
        setUserDetails({
          ...data,
          region: regionName,
          regionId: regionId,  // Agrega el ID de la región
        });

        setRegionOptions(dataRegiones.map((region) => ({ label: region.region, value: region.id })));
        setSectorOptions(dataSector.map((sector) => ({ label: sector.nombre, value: sector.id })));
        
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dataRegiones, dataSector]);

  return { userDetails, regionOptions, sectorOptions, loading, error };
};
