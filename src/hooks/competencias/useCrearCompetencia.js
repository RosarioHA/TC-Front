import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useCrearCompetencia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCompetencia = async (competenciaData, file) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    

    // Agregar campos simples y arrays al formData
    Object.entries(competenciaData).forEach(([key, value]) => {
      if (key !== 'competencias_agrupadas') {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Agregar el archivo si está presente
    if (file) {
      formData.append('oficio_origen', file);
    }

    try {
      const response = await apiTransferenciaCompentencia.post('competencias/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
  };

  return { createCompetencia, isLoading, error };
};
