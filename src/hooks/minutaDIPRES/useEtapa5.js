import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEtapa5 = () => {
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [errorPatch, setErrorPatch] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(false);

  const patchArchivoMinuta = useCallback(async (idEtapa, file) => {
    setLoadingPatch(true);
    try {
      const formData = new FormData();
      formData.append('archivo_minuta_etapa5', file);
      // Realizar la solicitud PATCH para subir el archivo
      await apiTransferenciaCompentencia.patch(`/etapa5/${idEtapa}/`, formData);
      setArchivoSubido(true);
      await apiTransferenciaCompentencia.patch(`/etapa5/${idEtapa}/`, {minuta_etapa5_enviada:true});

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
        comentario_minuta_etapa5: comentarios,
        observacion_minuta_gore_enviada: true,
      };
      await apiTransferenciaCompentencia.patch(`/etapa5/${idEtapa}/`, data);
    } catch (error) {
      console.error("Error al actualizar el comentario de la minuta:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false);
    }
  }, []);

  return { patchArchivoMinuta, patchComentarioMinuta, archivoSubido, loadingPatch, errorPatch };
};