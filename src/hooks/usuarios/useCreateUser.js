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
    } catch (error)
    {
      setError(error);
      throw error;
    } finally
    {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
};