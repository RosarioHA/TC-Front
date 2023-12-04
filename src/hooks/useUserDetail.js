import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../services/transferenciaCompetencia';

export const useUserDetails = (userId) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiTransferenciaCompentencia.get(`/users/${userId}/`);
      const { data } = response;
      console.log('User Details:', data);
      setUserDetails(data); // Corregido para reflejar la estructura de la respuesta de la API
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return { userDetails, loading, error };
};
