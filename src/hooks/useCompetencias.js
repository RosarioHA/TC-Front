import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../services/transferenciaCompetencia';

const useCompetencias = () => {
  const [competencias, setCompetencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetencias = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get('/competencias/');
        console.log('Response from API:', response);
        const competenciasData = response.data.results || [];
        console.log('Competencias Data:', competenciasData);
        setCompetencias(competenciasData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencias();
  }, []);

  return { competencias, loading, error };
};

export { useCompetencias };