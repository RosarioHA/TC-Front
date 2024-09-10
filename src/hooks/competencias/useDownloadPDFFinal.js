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
    setError(null);  // Reiniciar el error
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Error en la generación del documento. Intente nuevamente.')), 600000) // 5 minutos
      );
  
      const verifyPromise = apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/verificar-documento/`);
  
      const verifyResponse = await Promise.race([verifyPromise, timeoutPromise]);
  
      const exists = verifyResponse?.data?.exists;
  
      if (exists) {
        setTimeout(() => {
          setPendiente(exists);  // Si el documento existe, pendiente es falso.
          setDisponible(exists);
        }, 30000);  // Un retardo de 30 segundos
      } else {
        setPendiente(false);
        setDisponible(false);
      }
    } catch (error) {
      setError(error.message);  // Aquí se establece el mensaje de error
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
