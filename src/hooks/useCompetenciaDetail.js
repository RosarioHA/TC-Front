import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../services/transferenciaCompetencia';

export const useCompetenciaDetails = (competenciaId) => {
  const [competenciaDetails, setCompetenciaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompetenciaDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiTransferenciaCompentencia.get(`/competencias/${competenciaId}/`);
      const { data } = response;
      console.log('Competencia Details:', data);
      setCompetenciaDetails(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [competenciaId]);

  useEffect(() => {
    fetchCompetenciaDetails();
  }, [fetchCompetenciaDetails]);

  return { competenciaDetails, loading, error };
};