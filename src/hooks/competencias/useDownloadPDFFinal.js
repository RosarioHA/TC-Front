import { useCallback, useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useDescargarDocumento = (competenciaId) => {
  const [loading, setLoading] = useState(false);
  const [disponible, setDisponible] = useState(false);
  const [pendiente, setPendiente] = useState(false); 
  const [error, setError] = useState(null);

  const verificarDocumento = useCallback(async () => {
    if (disponible) return;
    setLoading(true);
    try {
      const verifyResponse = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/verificar-documento/`);
      const exists = verifyResponse.data.exists;
      setPendiente(exists);  // Si el documento existe, pendiente es falso.
      setDisponible(exists);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [competenciaId, disponible]);

  const verificarPDF = useCallback(async () => {
    setLoading(true);
    try {
      const verifyResponse = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/verificar-documento/`);
      const exists = verifyResponse.data.exists;
  
      // Aquí verificamos si 'exists' es verdadero y aplicamos setTimeout
      if (exists) {
        setTimeout(() => {
          setPendiente(exists);  // Si el documento existe, pendiente es falso.
          setDisponible(exists);
        }, 5000);  // Por ejemplo, un retardo de 2 segundos
      } else {
        setPendiente(exists);
        setDisponible(exists);
      }
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



  return { descargarDocumento, verificarDocumento, verificarPDF, disponible, pendiente, loading, error };
};
