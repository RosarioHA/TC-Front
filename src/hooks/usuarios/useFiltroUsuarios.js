import { useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";


export const useFiltroUsuarios = (sectorId, regionId) =>
{
  const [ usuarios, setUsuarios ] = useState([]);
  const [ cargando, setCargando ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        let url = 'users/get-users-by-sector-region/';
        if (regionId || sectorId)
        {
          const params = new URLSearchParams();
          if (sectorId) params.append('sector_id', sectorId);
          if (regionId) params.append('region_id', regionId);
          url += `?${params.toString()}`;
        }
        const respuesta = await apiTransferenciaCompentencia.get(url);
        setUsuarios(respuesta.data);
      } catch (error)
      {
        setError(error);
      } finally
      {
        setCargando(false);
      }
    };

    fetchData();
  }, [ sectorId, regionId ]);

  return { usuarios, cargando, error };
};