import { useState, useCallback, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useDescargarDocumento = (competenciaId) => {
  const [loading, setLoading] = useState(false);
  const [disponible, setDisponible] = useState(false);
  const [error, setError] = useState(null);

  const verificarDocumento = useCallback(async () => {
    setLoading(true);
    try {
      const verifyResponse = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/verificar-documento/`);
      setDisponible(verifyResponse.data.exists);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [competenciaId]);

  const descargarDocumento = useCallback(async () => {
    if (!disponible) {
      setError(new Error("El documento no está disponible para descarga."));
      return;
    }
    try {
      setLoading(true);
      const downloadResponse = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/descargar-documento/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `competencia_${competenciaId}_document.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [competenciaId, disponible]);

  useEffect(() => {
    verificarDocumento();
  }, [verificarDocumento]);

  return { descargarDocumento, verificarDocumento, disponible, loading, error };
};
