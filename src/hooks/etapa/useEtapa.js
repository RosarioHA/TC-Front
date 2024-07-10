import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useEtapa = ( competenciaId,stepNumber) => {
  const [etapa, setEtapa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateResponse, setUpdateResponse] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchEtapa = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get(`etapa${stepNumber}/${competenciaId}/`);
        setEtapa(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapa();
  }, [competenciaId,stepNumber]);

  const updateEtapa = async (stepNumber, data) => {
    setLoading(true);
    setUpdateError(null);
    try {
      const response = await apiTransferenciaCompentencia.patch(`etapa${stepNumber}/${competenciaId}/`, data);
      setUpdateResponse(response.data);
      // Actualiza el etapa con la nueva data
      setEtapa(response.data);
    } catch (error) {
      setUpdateError(error);
    } finally {
      setLoading(false);
    }
  };

  return { etapa, loading, error, updateEtapa, updateResponse, updateError };
};
