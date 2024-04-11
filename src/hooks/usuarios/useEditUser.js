import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formattedData = {
        ...userData,
        password: userData.password,
        nombre_completo: userData.nombre_completo,
        rut: userData.rut,
        email: userData.email,
        perfil: userData.perfil,
        sector: userData.sector,
        region: userData.region,
        // sector: userData.sector ? userData.sector.id : null,
        // region: userData.region ? userData.region.id : null,
        is_active: userData.is_active,
      };
      
      const response = await apiTransferenciaCompentencia.put(`users/${userId}/`, formattedData);
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
