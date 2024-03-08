import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useResumenFormulario = (id) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumen = useCallback(async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/resumen/`);
      setResumen(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen, id]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/resumen/`, { formulario_enviado: true });
      // Recargar el resumen después de la actualización
      fetchResumen();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return { resumen, loading, error, actualizarFormularioEnviado };
};