import { useState } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";

export const useEditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, userData) => {
    console.log('URL:', `/users/${userId}/`);
    console.log('Data:', userData);
    setIsLoading(true);
    setError(null);

    try {
      // Asegúrate de que userData contenga todas las claves necesarias
      const formattedData = {
        // Asegúrate de incluir todas las claves necesarias aquí
        nombre_completo: userData.nombre_completo,
        rut: userData.rut,
        email: userData.email,
        perfil: userData.perfil,
        sector: userData.sector,
        region: userData.region,
        is_active: userData.is_active,
        // ... otras claves según sea necesario
      };

      const response = await apiTransferenciaCompentencia.patch(`users/${userId}/`, formattedData);
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
