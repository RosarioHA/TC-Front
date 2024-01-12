import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useCrearCompetencia = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const createCompetencia = async (competenciaData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.post('competencias/', competenciaData);
      return response.data;
    } catch (error) {
      if (error.response) {
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        setError("Error de red o servidor no disponible");
      } else {
        setError("Error al realizar la solicitud");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  return { createCompetencia, isLoading, error }
}; 
