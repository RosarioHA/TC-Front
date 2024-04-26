import { useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useDescargarDocumento = (competenciaId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const descargarDocumento = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${competenciaId}/descargar-documento/`, {
        responseType: 'blob', // Importante para manejar la descarga de archivos
      });
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `competencia_${competenciaId}_document.pdf`); // O el nombre que prefieras
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [competenciaId]);

  return { descargarDocumento, loading, error };
};
