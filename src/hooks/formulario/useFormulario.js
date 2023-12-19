import { useCallback, useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";

export const useFormSectorial = (id) => {
  const [dataFormSectorial, setDataFormSectorial] = useState(null);
  const [loadingFormSectorial, setLoadingFormSectorial] = useState(true);
  const [errorFormSectorial, setErrorFormSectorial] = useState(null);

  const fetchFormSectorial = useCallback(async () => {
    // Si no hay un ID, simplemente salimos de la función sin hacer nada.
    // Esto previene que se establezca un error cuando el ID aún no esté disponible.
    if (!id) {
      setLoadingFormSectorial(false);
      return;
    }

    try {
      setLoadingFormSectorial(true);
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/`);
      setDataFormSectorial(response.data);
    } catch (err) {
      console.error("Error fetching form data:", err);
      setErrorFormSectorial(err);
    } finally {
      setLoadingFormSectorial(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFormSectorial();
  }, [fetchFormSectorial]);

  return { dataFormSectorial, loadingFormSectorial, errorFormSectorial };
};
