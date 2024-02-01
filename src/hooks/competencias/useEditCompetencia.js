import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useEditCompetencia = (competenciaId) => {
  const [competencia, setCompetencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetencia = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get(`/competencias/${competenciaId}/`);
        setCompetencia(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (competenciaId) {
      fetchCompetencia();
    }

    // Cleanup function if needed
  }, [competenciaId]);

  const updateCompetencia = async (competenciaData) => {
    try {
      setLoading(true);
      const response = await apiTransferenciaCompentencia.patch(`/competencias/${competenciaId}/`, competenciaData);
      setCompetencia(response.data);
      return response.data; // Puedes devolver datos adicionales si es necesario
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { competencia, loading, error, updateCompetencia };
};
