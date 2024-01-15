import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEditCompetencia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editCompetencia = async (competenciaId, competenciaData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.patch(`competencias/${competenciaId}/`, competenciaData);
      return response.data;
    } catch (error) {
      setError(error);
      console.error("Error en la función editCompetencia:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { editCompetencia, isLoading, error };
};