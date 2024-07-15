import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useEtapa = (etapaId, etapaNumber) => {
  const [etapa, setEtapa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateResponse, setUpdateResponse] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchEtapa = async () => {
      if (!etapaId) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiTransferenciaCompentencia.get(`etapa${etapaNumber}/${etapaId}/`);
        setEtapa(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapa();
  }, [etapaId, etapaNumber]);

  const updateEtapa = async (etapaNumber, data) => {
    setLoading(true);
    setUpdateError(null);
    try {
      const response = await apiTransferenciaCompentencia.patch(`etapa${etapaNumber}/${etapaId}/`, data);
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

