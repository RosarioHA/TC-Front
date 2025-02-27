import { useState, } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useCrearCompetenciaAgrupada = () =>
{
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const createCompetenciaAgrupada = async (competenciasAgrupadas) =>
  {
    setIsLoading(true);
    setError(null);
    try
    {
      const response = await apiTransferenciaCompentencia.post('competencias-agrupadas/', competenciasAgrupadas, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error)
    {
      if (error.response)
      {
        setError(`Error del servidor: ${error.response.status} - ${error.response.data.detail}`);
      } else if (error.request)
      {
        setError("Error de red o servidor no disponible");
      } else
      {
        setError("Error al realizar la solicitud");
      }
      throw error;
    } finally
    {
      setIsLoading(false);
    }
  };


  return { createCompetenciaAgrupada, isLoading, error };
};
