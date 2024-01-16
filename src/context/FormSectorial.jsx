import { createContext, useState , useCallback} from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const initialId = localStorage.getItem('formId') || null;
  const initialStepNumber = localStorage.getItem('stepNumber') || null;

  const [id, setId] = useState(initialId);
  const [stepNumber, setStepNumber] = useState(initialStepNumber);

  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber);
  const { patchStep, loading, error } = useUpdateForm();
  const [ refreshSubpasoDos, setRefreshSubpasoDos ] = useState(false);



  const updateFormId = (newId) => {
    setId(newId);
    localStorage.setItem('formId', newId);
  };

  const updateStepNumber = (newStepNumber) => {
    setStepNumber(newStepNumber);
    localStorage.setItem('stepNumber', newStepNumber);
  };

  console.log("ID en FormularioProvider:", id);

  const handleUpdatePaso = async (id, stepNumber, datosPaso, archivos = {}) => {
    try {
      if (!datosPaso || typeof datosPaso !== 'object' || Object.keys(datosPaso).length === 0) {
        throw new Error("datosPaso es inválido");
      }
  
      // Llama a patchStep con los datos estructurados correctamente
      await patchStep(id, stepNumber, datosPaso, archivos);
  
      // Si llega a este punto, asumimos que el guardado fue exitoso
      recargarDatos();
      return true; // Indica éxito
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      // Considera actualizar el estado del contexto para reflejar el error
      return false; // Indica fracaso
    }
  };
    // Función para recargar los datos actualizados
    const recargarDatos = useCallback(async () => {
      try {
        // Aquí puedes llamar a las funciones de tus hooks para recargar los datos
        // Por ejemplo, si tus hooks `useFormSectorial` y `usePasoForm` recargan los datos automáticamente
        // cuando cambian `id` y `stepNumber`, simplemente puedes llamar a `setId(id)` y `setStepNumber(stepNumber)`
        setId(id);
        setStepNumber(stepNumber);
      } catch (error) {
        console.error("Error al recargar datos:", error);
      }
    }, [id, stepNumber]);

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial || loading,                           
    error: errorFormSectorial || error,      
    updateFormId,
    pasoData: dataPaso,
    recargarDatos, 
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
    refreshSubpasoDos, 
    setRefreshSubpasoDos
  };


  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};