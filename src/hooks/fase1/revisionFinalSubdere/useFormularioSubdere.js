import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";

export const useFormularioSubdere = (id) => {
  const [dataFormSubdere, setDataFormSubdere] = useState(null);
  const [loadingFormSubdere, setLoadingFormSubdere] = useState(false);
  const [errorFormSubdere, setErrorFormSubdere] = useState(null);

  const fetchFormSubdere = useCallback(async () => {
    if (!id) {
      setDataFormSubdere(null);
      setLoadingFormSubdere(false);
      return;
    }
    setLoadingFormSubdere(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${id}/`);
      // Asegurarse de que la respuesta contiene los datos esperados
      if (response && response.data) {
        setDataFormSubdere(response.data);
      } else {
        // Si la respuesta no tiene el formato esperado, manejar como error
        throw new Error("Respuesta no válida del servidor");
      }
    } catch (err) {
      console.error("Error fetching form data :", err);
      // Verifica si el error tiene una estructura específica que esperas (p.ej., errores HTTP)
      if (err.response) {
        // Maneja errores específicos de la API, si es necesario
        setErrorFormSubdere(new Error(`Error ${err.response.status}: ${err.response.statusText}`));
      } else {
        // Manejo general de errores
        setErrorFormSubdere(err);
      }
    } finally {
      setLoadingFormSubdere(false);
    }
  }, [id]);

  useEffect(() => {
    let isActive = true;
    const fetch = async () => {
      if (isActive) {
        await fetchFormSubdere();
      }
    };
    fetch();

    return () => {
      isActive = false;
    };
  }, [fetchFormSubdere]);

  return { dataFormSubdere, loadingFormSubdere, errorFormSubdere };
};
