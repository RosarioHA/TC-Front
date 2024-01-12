import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

const useRecargaDirecta = (id, stepNumber) => {
  const [dataDirecta, setDataDirecta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataDirectly = async () => {
      setIsLoading(true);
      try {
        const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
        setDataDirecta(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener datos directamente:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && stepNumber) {
      fetchDataDirectly();
    }
  }, [id, stepNumber]);

  return { dataDirecta, isLoading, error };
};

export default useRecargaDirecta;
