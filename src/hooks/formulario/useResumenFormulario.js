import { useEffect, useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useResumenFormulario = (id) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/resumen/`);
        console.log('Respuesta desde la base de datos:', response.data);
        setResumen(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [id]);

  return { resumen, loading, error };
};