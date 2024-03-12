import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const usePatchCompetencia = () => {
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [errorPatch, setErrorPatch] = useState(null);

  const patchCompetenciaOmitida = useCallback(async (competenciaId, omitidaValue) => {
    setLoadingPatch(true);
    try {
      // Construir el objeto de datos a enviar en el PATCH
      const data = {
        omitida: omitidaValue,
      };

      // Realizar la solicitud PATCH
      const response = await apiTransferenciaCompentencia.patch(`/etapa3/${competenciaId}/`, data);

      // Puedes manejar la respuesta aquí según tus necesidades
      console.log("PATCH response:", response.data);
    } catch (error) {
      console.error("Error en el PATCH:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false);
    }
  }, []);

  return { patchCompetenciaOmitida, loadingPatch, errorPatch };
};