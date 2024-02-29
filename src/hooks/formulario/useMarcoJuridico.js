import { useState } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';
import { usePasoForm } from './usePasoForm';

export const useUploadMarcoJuridico = (id, stepNumber) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refetchTrigger } = usePasoForm(id, stepNumber); // Obtén refetchTrigger desde usePasoForm

  const uploadDocumento = async (idFormulario, { marcoJuridicoId, documento }) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('documento', documento);

    if (marcoJuridicoId) {
      formData.append('marco_juridico_id', marcoJuridicoId);
    }

    try {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${idFormulario}/update-marco-juridico/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Documento subido con éxito:');
            
      // Llama a refetchTrigger para actualizar los datos después de cargar el archivo exitosamente 
      refetchTrigger();
      } catch (err) {
        setError(err);
        console.error('Error al subir el documento:', err);
        throw err; 
      } finally {
        setIsLoading(false);
      }
    };

    //esta funcion es incorrecta y necesita apuntar a un endpoint real en el backend.
    const downloadDocumento = async (documentoId) => {
      try {
          const response = await apiTransferenciaCompentencia.get(`/documento/${documentoId}/download/`, { 
              responseType: 'blob',
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `documento_${documentoId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          console.error('Error al descargar el archivo:', error);
      }
  };

  return { uploadDocumento, downloadDocumento, isLoading, error };
};

