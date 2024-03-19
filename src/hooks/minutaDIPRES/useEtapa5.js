import { useCallback, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useEtapa5 = () => {
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [errorPatch, setErrorPatch] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(false);


  const patchArchivoMinuta = useCallback(async (competenciaId, file) => {
    setLoadingPatch(true);
    try {
      const formData = new FormData();
      formData.append('archivo_minuta_etapa5', file);
      // Realizar la solicitud PATCH para subir el archivo
      const response = await apiTransferenciaCompentencia.patch(`/etapa5/${competenciaId}/`, formData);

      // Puedes manejar la respuesta aquí según tus necesidades
      console.log("Archivo subido:", response.data);
      setArchivoSubido(true);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setErrorPatch(error);
    } finally {
      setLoadingPatch(false); 
    }
  }, []);

  return { patchArchivoMinuta, archivoSubido, loadingPatch, errorPatch };
};