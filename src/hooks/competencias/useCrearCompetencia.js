import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useCrearCompetencia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCompetencia = async (competenciaData, file) => {
    setIsLoading(true);
    setError(null);

    // Crear un objeto FormData
    const formData = new FormData();

    // Agregar campos simples al formData
    Object.keys(competenciaData).forEach(key => {
      if (!Array.isArray(competenciaData[key])) {
        formData.append(key, competenciaData[key]);
      }
    });

    // Agregar elementos de los arrays (sectores, regiones y usuarios) al formData
    ['sectores', 'regiones', 'usuarios_subdere', 'usuarios_dipres', 'usuarios_sectoriales', 'usuarios_gore'].forEach(arrayKey => {
      competenciaData[arrayKey]?.forEach(item => {
        formData.append(arrayKey, item);
      });
    });

    // Agregar el archivo si está presente
    if (file) {
      formData.append('oficio_origen', file);
    }

    try {
      const response = await apiTransferenciaCompentencia.post('competencias/', formData);
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

  return { createCompetencia, isLoading, error };
};
