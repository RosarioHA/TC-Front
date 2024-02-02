import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFiltroUsuarios = (sectorIds, regionIds) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Definir fetchData dentro de useCallback para evitar recreaciones innecesarias
  const fetchData = useCallback(async () => {
    setCargando(true);
    try {
      let url = 'users/get-users-by-sector-region/';
      const params = new URLSearchParams();
      
      // Solo agregar parámetros si existen y no están vacíos
      if (sectorIds && sectorIds.length) {
        params.append('sector_id', sectorIds.join(','));
      }
      if (regionIds && regionIds.length) {
        params.append('region_id', regionIds.join(','));
      }

      if (!params.toString()) {
        // Si no hay parámetros válidos, evitar la llamada a la API
        setUsuarios([]);
        setError(null);
        setCargando(false);
        return;
      }

      url += `?${params.toString()}`;

      const respuesta = await apiTransferenciaCompentencia.get(url);
      setUsuarios(respuesta.data);
      setError(null); // Asegurarse de limpiar errores previos si la llamada es exitosa
    } catch (error) {
      setError(error);
      setUsuarios([]); // Limpiar usuarios en caso de error
    } finally {
      setCargando(false);
    }
  }, [sectorIds, regionIds]); // Dependencias de useCallback

  // useEffect que observa cambios en sectorIds y regionIds
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependencias de useEffect

  return { usuarios, cargando, error };
};
