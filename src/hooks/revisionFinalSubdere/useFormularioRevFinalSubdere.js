import { useCallback, useEffect, useState } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFormularioRevFinalSubdere = (id) => {
  const [dataFormRevFinalSubdere, setDataFormRevFinalSubdere] = useState(null);
  const [loadingFormRevFinalSubdere, setLoadingFormRevFinalSubdere] = useState(false);
  const [errorFormRevFinalSubdere, setErrorFormRevFinalSubdere] = useState(null);

  const fetchFormRevFinalSubdere = useCallback(async () => {
    if (!id) {
      setDataFormRevFinalSubdere(null);
      setLoadingFormRevFinalSubdere(false);
      return;
    }
    setLoadingFormRevFinalSubdere(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/revision-final-competencia/${id}/`);
      // Asegurarse de que la respuesta contiene los datos esperados
      if (response && response.data) {
        setDataFormRevFinalSubdere(response.data);
      } else {
        // Si la respuesta no tiene el formato esperado, manejar como error
        throw new Error("Respuesta no válida del servidor");
      }
    } catch (err) {
      console.error("Error fetching form data :", err);
      // Verifica si el error tiene una estructura específica que esperas (p.ej., errores HTTP)
      if (err.response) {
        // Maneja errores específicos de la API, si es necesario
        setErrorFormRevFinalSubdere(new Error(`Error ${err.response.status}: ${err.response.statusText}`));
      } else {
        // Manejo general de errores
        setErrorFormRevFinalSubdere(err);
      }
    } finally {
      setLoadingFormRevFinalSubdere(false);
    }
  }, [id]);

  useEffect(() => {
    let isActive = true;
    const fetch = async () => {
      if (isActive) {
        await fetchFormRevFinalSubdere();
      }
    };
    fetch();

    return () => {
      isActive = false;
    };
  }, [fetchFormRevFinalSubdere]);

  return { dataFormRevFinalSubdere, loadingFormRevFinalSubdere, errorFormRevFinalSubdere };
};
