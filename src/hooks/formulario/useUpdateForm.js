import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patchStep = async (id, stepNumber, datosPaso, archivos = {}) => {
    setLoading(true);
    setError(null);

    if (!datosPaso || typeof datosPaso !== 'object') {
      setError(new Error("Datos inválidos"));
      setLoading(false);
      throw new Error("Datos inválidos");
    }

    try {
      let payload;

      // Si se están enviando archivos, usa FormData.
      if (archivos.file) {
        payload = new FormData();
        payload.append('file', archivos.file);
        // Añade los demás datos como JSON
        payload.append('datos', JSON.stringify(datosPaso));
      } else {
        // Si no hay archivos, envía los datos directamente como JSON.
        payload = datosPaso;
      }

      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, payload);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  };

  return { patchStep, loading, error };
};