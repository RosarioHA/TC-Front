import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

// Hook personalizado para el endpoint /competencias-post-cid/{id}/
export const useCompetenciasPostCid = (id) => {
  const [competenciaPostCid, setCompetencia] = useState(null); // Almacenar la data del GET
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Almacenar errores del GET
  const [updateResponse, setUpdateResponse] = useState(null); // Almacenar la respuesta del PATCH
  const [updateError, setUpdateError] = useState(null); // Almacenar errores del PATCH

  // Efecto para realizar la solicitud GET al cargar el componente
  useEffect(() => {
    const fetchCompetencia = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiTransferenciaCompentencia.get(`/competencias-post-cid/${id}/`);
        setCompetencia(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencia();
  }, [id]);

  // Función para realizar el PATCH y actualizar la información
  const updateCompetencia = async (data) => {
    setLoading(true);
    setUpdateError(null);
    try {
      const response = await apiTransferenciaCompentencia.patch(`/competencias-post-cid/${id}/`, data);
      setUpdateResponse(response.data); // Guardar la respuesta del PATCH
      setCompetencia(response.data); // Actualizar el estado con los datos modificados
    } catch (error) {
      setUpdateError(error);
    } finally {
      setLoading(false);
    }
  };

  // Devolver el estado y las funciones del hook
  return { 
    competenciaPostCid, 
    loading, 
    error, 
    updateCompetencia, 
    updateResponse, 
    updateError 
  };
};