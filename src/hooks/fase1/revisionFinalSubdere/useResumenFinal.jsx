import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const useResumenFinal = (id) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumen = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(
        `/revision-final-competencia/${id}/resumen/`
      );
      setResumen(response.data);
      setError(null);
    } catch (error) {
      setError(
        'No se pudo cargar el resumen del formulario. Por favor, intente nuevamente.'
      );
      setResumen(null); 
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchResumen();
    }
  }, [fetchResumen, id]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(
        `/revision-final-competencia/${id}/resumen/`,
        {
          competencia_fase1_finalizada: true,
          imprimir_formulario_final: true
        }

      );
      setResumen((prevState) => ({
        ...prevState,
        competencia_fase1_finalizada: true,
        imprimir_formulario_final: true
      }));
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };


  const subirArchivo = async (file, fieldName) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      await apiTransferenciaCompentencia.patch(`/revision-final-competencia/${id}/resumen/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchResumen();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const guardarDescripcion = async (fieldName, value) => {
    try {
      await apiTransferenciaCompentencia.patch(`revision-final-competencia/${id}/resumen/`, {
        [fieldName]: value
      });
      fetchResumen();
    } catch (error) {
      console.error(`Error al guardar la descripción del archivo:`, error);
    }
  };

  const eliminarArchivo = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`revision-final-competencia/${id}/resumen/`, {
        antecedente_adicional_revision_subdere: true
      });
      fetchResumen();  // Recargar el resumen para reflejar la eliminación
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };


  return { resumen, loading, error, fetchResumen, actualizarFormularioEnviado, subirArchivo,guardarDescripcion ,eliminarArchivo };
};
