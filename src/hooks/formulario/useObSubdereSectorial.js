import { useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useObservacionesSubdere = (id) => {
  const [observaciones, setObservaciones] = useState({});
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [errorObservaciones, setErrorObservaciones] = useState(null);

  const fetchObservaciones = useCallback(async () => {
    if (!id) {
      setObservaciones({});
      setLoadingObservaciones(false);
      return;
    }

    setLoadingObservaciones(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/observaciones-subdere-sectorial/`);
      setObservaciones(response.data.observaciones_sectoriales);
    } catch (err) {
      setErrorObservaciones(err);
    } finally {
      setLoadingObservaciones(false);
    }
  }, [id]);

 const updateObservacion = useCallback(async (observacionData) => {
  if (!id || !observacionData || typeof observacionData !== 'object' || Object.keys(observacionData).length === 0) {
    return;
  }

  try {
    const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/observaciones-subdere-sectorial/`, {
      observaciones_sectoriales: observacionData
    });
    setObservaciones(response.data.observaciones_sectoriales);
  } catch (error) {
    setErrorObservaciones(error);
  }
}, [id]);

  return { observaciones, loadingObservaciones, errorObservaciones, updateObservacion, fetchObservaciones };
};