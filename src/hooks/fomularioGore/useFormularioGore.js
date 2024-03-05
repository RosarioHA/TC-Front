import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFormularioGore = (id) => {
  const [dataFormGore, setDataFormGore] = useState(null);
  const [loadingFormGore, setLoadingFormGore] = useState(false);
  const [errorFormGore, setErrorFormGore] = useState(null);

  const fetchFormGore = useCallback(async () => {
    if (!id) {
      setDataFormGore(null);
      setLoadingFormGore(false);
      return;
    }
    setLoadingFormGore(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-gore/${id}/`);
      // Asegurarse de que la respuesta contiene los datos esperados
      if (response && response.data) {
        setDataFormGore(response.data);
      } else {
        // Si la respuesta no tiene el formato esperado, manejar como error
        throw new Error("Respuesta no válida del servidor");
      }
    } catch (err) {
      console.error("Error fetching form data :", err);
      // Verifica si el error tiene una estructura específica que esperas (p.ej., errores HTTP)
      if (err.response) {
        // Maneja errores específicos de la API, si es necesario
        setErrorFormGore(new Error(`Error ${err.response.status}: ${err.response.statusText}`));
      } else {
        // Manejo general de errores
        setErrorFormGore(err);
      }
    } finally {
      setLoadingFormGore(false);
    }
  }, [id]);

  useEffect(() => {
    let isActive = true;
    const fetch = async () => {
      if (isActive) {
        await fetchFormGore();
      }
    };
    fetch();

    return () => {
      isActive = false;
    };
  }, [fetchFormGore]);

  return { dataFormGore, loadingFormGore, errorFormGore };
};
