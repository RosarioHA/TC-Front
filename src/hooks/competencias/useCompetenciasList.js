import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

const useCompetenciasList = () =>
{
  const [ competencias, setCompetencias ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() =>
  {
    const fetchCompetencias = async () =>
    {
      try
      {
        const response = await apiTransferenciaCompentencia.get('/competencias/');
        console.log('Complete API Response:', response);

        // Ajustamos el código para manejar diferentes estructuras de respuesta
        const competenciasData = response.data.data || response.data.results || response.data || [];

        console.log('Competencias Data:', competenciasData);
        setCompetencias(competenciasData);
      } catch (error)
      {
        console.error('Error fetching competencias:', error);
        setError(error);
      } finally
      {
        setLoading(false);
      }
    };

    fetchCompetencias();
  }, []);

  return { competencias, loading, error };
};

export { useCompetenciasList };