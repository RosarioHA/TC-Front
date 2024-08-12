import { useCallback, useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";

export const useFormSectorial = (id) => {
  const [dataFormSectorial, setDataFormSectorial] = useState(null);
  const [loadingFormSectorial, setLoadingFormSectorial] = useState(false);
  const [errorFormSectorial, setErrorFormSectorial] = useState(null);

  const fetchFormSectorial = useCallback(async () => {
    if (!id) {
      setDataFormSectorial(null);
      setLoadingFormSectorial(false);
      return;
    }

    setLoadingFormSectorial(true);
    try {
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
    let isActive = true;

    const fetch = async () => {
      try {
        if (isActive) {
          await fetchFormSectorial();
        }
      } catch (error) {
        if (isActive) {
          setErrorFormSectorial(error);
        }
      }
    };

    fetch();

    return () => {
      isActive = false;
    };
  }, [fetchFormSectorial]);

  return { dataFormSectorial, loadingFormSectorial, errorFormSectorial };
};
