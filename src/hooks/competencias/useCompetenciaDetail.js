import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useCompetenciaDetails = (competenciaId) => {
  const [competenciaDetails, setCompetenciaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetenciaDetails = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get(`competencias/${competenciaId}`);
        setCompetenciaDetails(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetenciaDetails();
  }, [competenciaId]);

  return { competenciaDetails, loading, error };
};