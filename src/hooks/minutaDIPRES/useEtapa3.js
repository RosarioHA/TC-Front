import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEtapa3 = () => {
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [errorPatch, setErrorPatch] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(false);

  const patchCompetenciaOmitida = useCallback(async (etapaId, omitidaValue) => {
    setLoadingPatch(true);
    try {
      const data = {
        omitida: omitidaValue,
      };
      await apiTransferenciaCompentencia.patch(`/etapa3/${etapaId}/`, data);
    } catch (error) {
      console.error("Error en el PATCH:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false);
    }
  }, []);

  const patchArchivoMinuta = useCallback(async (etapaId, file) => {
    setLoadingPatch(true);
    try {
      const formData = new FormData();
      formData.append('archivo_minuta_etapa3', file);
      await apiTransferenciaCompentencia.patch(`/etapa3/${etapaId}/`, formData);
      setArchivoSubido(true);
      await apiTransferenciaCompentencia.patch(`/etapa3/${etapaId}/`, { minuta_etapa3_enviada: true });

    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false); 
    }
  }, []);

  const patchComentarioMinuta = useCallback(async (idEtapa, comentarios) => {
    setLoadingPatch(true);
    try {
      const data = {
        comentario_minuta_sectorial: comentarios,
        observacion_minuta_sectorial_enviada: true,
      };
      await apiTransferenciaCompentencia.patch(`/etapa3/${idEtapa}/`, data);
    } catch (error) {
      console.error("Error al actualizar el comentario de la minuta:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false);
    }
  }, []);

  return { patchCompetenciaOmitida, patchArchivoMinuta, patchComentarioMinuta, archivoSubido, loadingPatch, errorPatch };
};