import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useGenerarDocumento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const generarDocumento = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.post(`/competencias/${id}/generate-document/`);
      setData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error al generar el documento');
    } finally {
      setLoading(false);
    }
  };

  const eliminarDocumento = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.delete(`/competencias/${id}/eliminar-documento/`);
      setData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error al eliminar el documento');
    } finally {
      setLoading(false);
    }
  };

  

  return { generarDocumento, eliminarDocumento, loading, error, data };
};