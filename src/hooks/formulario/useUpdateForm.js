import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () => {
  const [isUpdatingPaso, setIsUpdatingPaso] = useState(false);
  const [updatePasoError, setUpdatePasoError] = useState(null);

  const updatePaso = useCallback(async (id, stepNumber, datosPaso) => {
    setIsUpdatingPaso(true);
    setUpdatePasoError(null);

    try {
      const pasoKey = `paso${stepNumber}`;
      const requestBody = { [pasoKey]: datosPaso };

      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`, requestBody);
    } catch (error) {
      setUpdatePasoError(error);
    } finally {
      setIsUpdatingPaso(false);
    }
  }, []);

  return { updatePaso, isUpdatingPaso, updatePasoError };
};