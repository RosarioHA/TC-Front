import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useResumenFinal = (id) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumen = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(
        `/revision-final-competencia/${id}/resumen/`
      );
      setResumen(response.data);
      setError(null);
    } catch (error) {
      setError(
        'No se pudo cargar el resumen del formulario. Por favor, intente nuevamente.'
      );
      setResumen(null); 
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchResumen();
    }
  }, [fetchResumen, id]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(
        `/revision-final-competencia/${id}/resumen/`,
        {
          formulario_final_enviado: true,
          imprimir_formulario_final: true
        }

      );
      setResumen((prevState) => ({
        ...prevState,
        formulario_final_enviado: true,
        imprimir_formulario_final: true
      }));
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };


  return { resumen, loading, error, fetchResumen, actualizarFormularioEnviado };
};
