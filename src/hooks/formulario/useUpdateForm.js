import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFormDataPayload = (datosPaso, archivos) => {
    const payload = new FormData();

    // Agregar archivos al FormData
    for (let key of archivos.keys()) {
      const file = archivos.get(key);
      if (Array.isArray(file)) {
        // Para campos múltiples (si es necesario)
        file.forEach((fileItem) => {
          if (fileItem instanceof File) {
            payload.append(key, fileItem);
          }
        });
      } else if (file instanceof File) {
        payload.append(key, file);
      }
    }

    // Agregar datos al FormData
    for (const key in datosPaso) {
      if (Object.prototype.hasOwnProperty.call(datosPaso, key)) {
        const value = datosPaso[key];
        if (typeof value === 'object' && !(value instanceof File)) {
          payload.append(key, JSON.stringify(value)); // Para objetos JSON
        } else {
          payload.append(key, value);
        }
      }
    }

    return payload;
  };

  const patchStep = async (id, stepNumber, payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, payload);

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err; // Lanza una excepción para que el componente pueda manejar el error
    }
  };

  return { patchStep, loading, error, createFormDataPayload };
};
