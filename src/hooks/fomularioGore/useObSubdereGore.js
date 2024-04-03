import { useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useObservacionesGORE = (id) => {
  const [observaciones, setObservaciones] = useState({});
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [errorObservaciones, setErrorObservaciones] = useState(null);
  const [saved, setSaved] = useState(false);

  const fetchObservaciones = useCallback(async () => {
    if (!id) {
      setObservaciones({});
      setLoadingObservaciones(false);
      return;
    }

    setLoadingObservaciones(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-gore/${id}/observaciones-subdere-gore/`);
      setObservaciones(response.data.observaciones_gore);
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
    setLoadingObservaciones(true);
    const response = await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/observaciones-subdere-gore/`, {
      observaciones_gore: observacionData
    });
    setObservaciones(response.data.observaciones_gore);
    setSaved(true);
  } catch (error) {
    setErrorObservaciones(error);
  } finally {
    setLoadingObservaciones(false);
  }
}, [id]);

  return { observaciones, loadingObservaciones, saved, errorObservaciones, updateObservacion, fetchObservaciones };
};