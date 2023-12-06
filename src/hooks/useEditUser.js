import { useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useEditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, userData) => {
    console.log('Data before formatting:', userData);
    setIsLoading(true);
    setError(null);

    try {
      const formattedData = {
        nombre_completo: userData.nombre_completo,
        rut: userData.rut,
        email: userData.email,
        perfil: userData.perfil,
        sector: userData.sector,
        region: userData.region,
        is_active: userData.is_active,
      };

      console.log('Data after formatting:', formattedData);

      const response = await apiTransferenciaCompentencia.patch(`users/update_profile/`, formattedData);
      return response.data;
    } catch (error) {
      setError(error);
      console.error("Error en la funcion editUser:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { editUser, isLoading, error };
};