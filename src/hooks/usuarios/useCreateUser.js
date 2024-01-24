import { useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useCreateUser = () =>
{
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const createUser = async (userData) =>
  {
    setIsLoading(true);
    setError(null);

    try
    {
      const response = await apiTransferenciaCompentencia.post('users/', userData);
      return response.data;
    } catch (error) {
      let errorMsg = 'Ocurrió un error al crear el usuario';     
      // Verifica si el error tiene una respuesta y extrae la información relevante
      if (error.response && error.response.data) {
        errorMsg = error.response.data.errors || errorMsg;
      }
    
      setError({ message: errorMsg || {} });
      throw { message: errorMsg || {} };
    } finally
    {
      setIsLoading(false);
    }
  };

  console.log('Error hook:', error )

  return { createUser, isLoading, error };
};