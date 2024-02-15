import { useState } from "react"; 
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFlujograma = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFlujogramaCompetencia = async (idFormulario, flujogramaCompetenciaId, file) => {
    const formData = new FormData();
    formData.append('documento', file);
    if (flujogramaCompetenciaId) {
      formData.append('flujograma_competencia_id', flujogramaCompetenciaId);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      setIsLoading(true);
      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${idFormulario}/update-flujograma-competencia/`, formData, config);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err);
      throw err; 
    }
  };

  return { uploadFlujogramaCompetencia, isLoading, error };
}