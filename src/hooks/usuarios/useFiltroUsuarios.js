import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFiltroUsuarios = (sectorIds, regionIds) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'users/get-users-by-sector-region/';
        const params = new URLSearchParams();
        
        // Si sectorIds es un array y no está vacío, se unen los IDs con comas
        if (sectorIds && sectorIds.length) {
          params.append('sector_id', sectorIds.join(','));
        }

        // Si regionIds es un array y no está vacío, se unen los IDs con comas
        if (regionIds && regionIds.length) {
          params.append('region_id', regionIds.join(','));
        }

        // Construir la URL con los parámetros adecuados
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const respuesta = await apiTransferenciaCompentencia.get(url);
        setUsuarios(respuesta.data);
      } catch (error) {
        setError(error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [sectorIds, regionIds]); // Asegúrate de pasar los arrays como dependencias

  return { usuarios, cargando, error };
};
