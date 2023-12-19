import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useUpdateForm = () =>
{
  const [ isUpdatingPaso, setIsUpdatingPaso ] = useState(false);
  const [ updatePasoError, setUpdatePasoError ] = useState(null);

  const updatePaso = useCallback(async (id, stepNumber, datosPaso, archivos = {}) =>
  {
    setIsUpdatingPaso(true);
    setUpdatePasoError(null);

    try
    {
      const pasoKey = `paso${stepNumber}`;
      const formData = new FormData();

      // Agregar datos normales de forma individual
      for (const [ key, value ] of Object.entries(datosPaso))
      {
        formData.append(`${pasoKey}[${key}]`, value);
      }

      // Agregar archivos
      for (const [ key, file ] of Object.entries(archivos))
      {
        formData.append(key, file);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      await apiTransferenciaCompentencia.patch(`/formulario-sectorial/${id}/paso-${stepNumber}/`,
        formData,
        config
      );
    } catch (error)
    {
      setUpdatePasoError(error);
    } finally
    {
      setIsUpdatingPaso(false);
    }
  }, []);

  return { updatePaso, isUpdatingPaso, updatePasoError };
};