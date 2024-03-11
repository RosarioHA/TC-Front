import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';
export const useFlujograma = (id) =>
{
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const uploadDocumento = async (file) => {
    setIsLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('documento', file);
  
    try {
      const response = await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/update-flujograma-competencia/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Respuesta del servidor:', response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadDocumento, isLoading, error };
};