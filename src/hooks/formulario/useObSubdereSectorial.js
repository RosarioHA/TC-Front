import { useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useObservacionesSubdere = (id) =>
{
  const [ observaciones, setObservaciones ] = useState({});
  const [ loadingObservaciones, setLoadingObservaciones ] = useState(false);
  const [ errorObservaciones, setErrorObservaciones ] = useState(null);
  const [ saved, setSaved ] = useState(false);

  const fetchObservaciones = useCallback(async () => {
    if (!id) {
      setObservaciones({});
      return setLoadingObservaciones(false);
    }
  
    setLoadingObservaciones(true);
    try {
      const { data } = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/observaciones-subdere-sectorial/`);
      setObservaciones(data.observaciones_sectoriales);
    } catch (err) {
      setErrorObservaciones(err);
    } finally {
      setLoadingObservaciones(false);
    }
  }, [id]);

  const updateObservacion = useCallback(async (observacionData) =>
  {
    if (!id || !observacionData || typeof observacionData !== 'object' || Object.keys(observacionData).length === 0)
    {
      return;
    }

    try
    {
      setLoadingObservaciones(true);
      const response = await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/observaciones-subdere-sectorial/`, {
        observaciones_sectoriales: observacionData
      });
      setObservaciones(response.data.observaciones_sectoriales);
      setSaved(true);
    } catch (error)
    {
      setErrorObservaciones(error);
    } finally
    {
      setLoadingObservaciones(false);
    }
  }, [ id ]);

  const subirArchivo = async (file) =>
  {
    const formData = new FormData();
    formData.append('antecedente_adicional_subdere', file);

    try
    {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchObservaciones(); // Recarga las observaciones para reflejar cualquier cambio
    } catch (error)
    {
      console.error('Error al subir el archivo:', error);
    }
  };


  const guardarDescripcion = async (fieldName, value) =>
  {
    try
    {
      const payload = {
        observaciones_sectoriales: {
          id: observaciones.id, // Asegúrate de que `observaciones.id` esté disponible y correcto
          [ fieldName ]: value
        }
      };
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/observaciones-subdere-sectorial/`, payload);
      fetchObservaciones();
    } catch (error)
    {
      console.error(`Error al guardar la descripción del archivo:`, error);
    }
  };

  const eliminarArchivo = async () =>
  {
    const payload = {
      id: id,
      antecedente_adicional_subdere: null // Envía null para eliminar el archivo
    };
    try
    {
      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/`, payload);
      fetchObservaciones(); // Recarga las observaciones para reflejar la eliminación
    } catch (error)
    {
      console.error('Error al eliminar el archivo:', error);
    }
  };


  return {
    observaciones,
    subirArchivo,
    guardarDescripcion,
    eliminarArchivo,
    loadingObservaciones,
    saved,
    errorObservaciones,
    updateObservacion,
    fetchObservaciones
  };
};
