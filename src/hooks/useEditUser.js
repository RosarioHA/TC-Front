import { useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useEditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiTransferenciaCompentencia.patch(`users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { editUser, isLoading, error };
};
