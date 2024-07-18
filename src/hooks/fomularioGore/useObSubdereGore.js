import { useState, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useObservacionesGORE = (id) =>
{
  const [ observaciones, setObservaciones ] = useState({});
  const [ archivoObs, setArchivoObs ] = useState()
  const [ loadingObservaciones, setLoadingObservaciones ] = useState(false);
  const [ errorObservaciones, setErrorObservaciones ] = useState(null);
  const [ saved, setSaved ] = useState(false);

  const fetchObservaciones = useCallback(async () =>
  {
    if (!id)
    {
      setObservaciones({});
      setArchivoObs();
      setLoadingObservaciones(false);
      return;
    }

    setLoadingObservaciones(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/formulario-gore/${id}/observaciones-subdere-gore/`);
      setObservaciones(response.data.observaciones_gore);
      setArchivoObs(response.data.antecedente_adicional_subdere)
    } catch (err)
    {
      setErrorObservaciones(err);
    } finally
    {
      setLoadingObservaciones(false);
    }
  }, [ id ]);

  const updateObservacion = useCallback(async (observacionData) =>
  {
    if (!id || !observacionData || typeof observacionData !== 'object' || Object.keys(observacionData).length === 0)
    {
      return;
    }

    try
    {
      setLoadingObservaciones(true);
      const response = await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/observaciones-subdere-gore/`, {
        observaciones_gore: observacionData
      });
      setObservaciones(response.data.observaciones_gore);
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
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/observaciones-subdere-gore/`, formData, {
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
        observaciones_gore: {
          id: observaciones.id, // Asegúrate de que `observaciones.id` esté disponible y correcto
          [ fieldName ]: value
        }
      };
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/observaciones-subdere-gore/`, payload);
      fetchObservaciones();
    } catch (error)
    {
      console.error(`Error al guardar la descripción del archivo:`, error);
    }
  };

  const eliminarArchivo = async () =>
  {
    const payload = {
      antecedente_adicional_subdere: null
    };
    try
    {
      await apiTransferenciaCompentencia.patch(`/formulario-gore/${id}/observaciones-subdere-gore/`, payload);
      fetchObservaciones(); // Recarga las observaciones para reflejar la eliminación
    } catch (error)
    {
      console.error('Error al eliminar el archivo:', error);
    }
  };



  return { observaciones,archivoObs,  subirArchivo, guardarDescripcion, eliminarArchivo, loadingObservaciones, saved, errorObservaciones, updateObservacion, fetchObservaciones };
};