import { useState, useEffect } from 'react';
import { apiTransferenciaCompentencia } from '../services/transferenciaCompetencia';

export const useOrigenes = () => {
  const [origenes, setOrigenes] = useState([]);

  useEffect(() => {
    const fetchOrigenes = async () => {
      try {
        const responseOrigenes = await apiTransferenciaCompentencia.get('origenes/');
        setOrigenes(responseOrigenes.data);
      } catch (error) {
        console.error('Error al obtener datos de Orígenes:', error);
      }
    };

    fetchOrigenes();
  }, []);

  return {origenes};
};
