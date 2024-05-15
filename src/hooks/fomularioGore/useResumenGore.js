import { useEffect, useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useResumenGore = (id) => {
  const [ resumen, setResumen ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  const fetchResumen = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-gore/${id}/resumen/`);
      setResumen(response.data);
      setError(null); // Limpiar errores previos si la solicitud es exitosa
    } catch (error) {
      setError('No se pudo cargar el resumen del formulario. Por favor, intente nuevamente.');
      setResumen(null); 
    } finally {
      setLoading(false);
    }
  }, [ id ]);

  useEffect(() => {
    if (id) { // Asegurarse de que el id es válido antes de intentar cargar los datos
      fetchResumen();
    }
  }, [ fetchResumen, id ]);

  const actualizarFormularioEnviado = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/resumen/`, { formulario_enviado: true });
      // Actualizar el estado local directamente para reflejar el cambio, evitando una nueva carga
      setResumen((prevState) => ({
        ...prevState,
        formulario_enviado: true,
      }));
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      // Considerar manejar este error de manera más visible para el usuario, por ejemplo, actualizando el estado `error`
    }
  };

  const subirArchivo = async (file, fieldName) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/resumen/`, formData, {
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
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/resumen/`, {
        [fieldName]: value
      });
      fetchResumen();
    } catch (error) {
      console.error(`Error al guardar la descripción del archivo:`, error);
    }
  };

  const eliminarArchivo = async () => {
    try {
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/resumen/`, {
        antecedente_adicional_gore: true
      });
      fetchResumen();  // Recargar el resumen para reflejar la eliminación
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };


  return { resumen, loading, error, fetchResumen, actualizarFormularioEnviado ,subirArchivo, guardarDescripcion, eliminarArchivo };
};
