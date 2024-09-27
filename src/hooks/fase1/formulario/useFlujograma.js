import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';
import { usePasoForm } from './usePasoForm';

export const useFlujograma = (id, stepNumber) =>
{
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const { refetchTrigger } = usePasoForm(id, stepNumber); // Obtén refetchTrigger desde usePasoForm

    const uploadDocumento = async (idFormulario, file, flujogramaCompetenciaId = null) =>
    {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('documento', file);
        if (flujogramaCompetenciaId)
        {
            formData.append('flujograma_competencia_id', flujogramaCompetenciaId);
        }

        try
        {
            await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${idFormulario}/update-flujograma-competencia/`, formData);
            refetchTrigger();
        } catch (err)
        {
            setError(err);
            console.error('Error al subir el documento:', err);
            throw err;
        } finally
        {
            setIsLoading(false);
        }
    };

    return { uploadDocumento, isLoading, error };
};
