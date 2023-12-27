import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () => {
  const [isUpdatingPaso, setIsUpdatingPaso] = useState(false);
  const [updatePasoError, setUpdatePasoError] = useState(null);

  const updatePaso = useCallback(async (id, stepNumber, datosPaso, archivos = {}) => {
    console.log('updatePaso llamado con:', { id, stepNumber, datosPaso, archivos });
    if (!id || !stepNumber) {
      console.error("Faltan el ID o el número de paso para actualizar.");
      return;
    }

    setIsUpdatingPaso(true);
    setUpdatePasoError(null);

    try {
      const formData = new FormData();

      // Agregar datos del paso
      Object.entries(datosPaso).forEach(([key, value]) => {
        formData.append(`paso${stepNumber}[${key}]`, value);
      });

      // Agregar archivos
      Object.entries(archivos).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, formData, config);
      console.log("Respuesta de la API:", response);

      // Aquí puedes manejar la respuesta de éxito
    } catch (error) {
      console.error("Error en handleUpdatePaso:", error);
      setUpdatePasoError(error.response ? error.response.data : error);
      console.error("Error en updatePaso:", error);
    } finally {
      setIsUpdatingPaso(false);
    }
  }, []);

  return { updatePaso, isUpdatingPaso, updatePasoError };
};
