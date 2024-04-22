import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFiltroUsuarios = (sectorSeleccionado, regionSeleccionada) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setCargando(true);
    const params = new URLSearchParams();

    // Asegurar que las variables no sean null antes de intentar usar .length
    const sectors = sectorSeleccionado || [];
    const regions = regionSeleccionada || [];

    if (sectors.length > 0) {
      params.append('sector_id', sectors.join(','));
    }
    if (regions.length > 0) {
      params.append('region_id', regions.join(','));
    }

    try {
      const url = `users/get-users-by-sector-region/?${params.toString()}`;
      const respuesta = await apiTransferenciaCompentencia.get(url);
      console.log("Respuesta API:", respuesta.data);  // Log para depuración

      let filteredUsers = respuesta.data || [];

      // Filtrar para retornar solo SUBDERE y DIPRES si no hay sectores o regiones seleccionados
      if (!sectors.length && !regions.length) {
        filteredUsers = filteredUsers.filter(user => user.perfil === 'SUBDERE' || user.perfil === 'DIPRES');
      }

      setUsuarios(filteredUsers);
      setError(null);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError('No se pudieron cargar los usuarios');
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }, [sectorSeleccionado, regionSeleccionada]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { usuarios, cargando, error };
};