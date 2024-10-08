import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const useResumenFormulario = (id) => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumen = useCallback(async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/resumen/`);
      setResumen(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/resumen/`, { formulario_enviado: true });
      fetchResumen();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const subirArchivo = async (file, fieldName) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/resumen/`, formData, {
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
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/resumen/`, {
        [fieldName]: value
      });
      fetchResumen();
    } catch (error) {
      console.error(`Error al guardar la descripción del archivo:`, error);
    }
  };

  const eliminarArchivo = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/resumen/`, {
        delete_antecedente_adicional_sectorial: true
      });
      fetchResumen();  // Recargar el resumen para reflejar la eliminación
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };

  return { resumen, loading, error, fetchResumen, actualizarFormularioEnviado, subirArchivo, guardarDescripcion ,eliminarArchivo};
};
