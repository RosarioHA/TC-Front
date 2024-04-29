import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useOrganigramaRegional = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const patchStepOrganigrama = async (id, stepNumber, payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Reiniciar el estado de éxito
  
    try {
      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, payload);
  
      setLoading(false);
      setSuccess(true); // Actualizar el estado de éxito
      return response.data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response ? err.response.data : err.message;
      setError(errMsg);
      throw new Error(errMsg);
    }

  }
  return { patchStepOrganigrama , loading, error, createFormDataPayload , success};
};
