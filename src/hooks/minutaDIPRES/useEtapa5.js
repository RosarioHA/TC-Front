import { useCallback, useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEtapa5 = (idEtapa) => {
  const [etapaCinco, setEtapaCinco] = useState(null);
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [errorPatch, setErrorPatch] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(false);

  useEffect(() => {
    const fetchEtapa = async () => {
      if (!idEtapa) {
        setLoadingPatch(false);
        return;
      }
      try {
        const response = await apiTransferenciaCompentencia.get(`etapa5/${idEtapa}/`);
        setEtapaCinco(response.data);
      } catch (error) {
        errorPatch(error);
      } finally {
        setLoadingPatch(false);
      }
    };

    fetchEtapa();
  }, [idEtapa]);

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
        aprobada: true,
      };
      await apiTransferenciaCompentencia.patch(`/etapa5/${idEtapa}/`, data);
    } catch (error) {
      console.error("Error al actualizar el comentario de la minuta:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false);
    }
  }, []);

  return { patchArchivoMinuta,etapaCinco, patchComentarioMinuta, archivoSubido, loadingPatch, errorPatch };
};