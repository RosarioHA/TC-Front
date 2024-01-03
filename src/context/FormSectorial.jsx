import { createContext, useState } from 'react';
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
      // Aquí puedes actualizar el estado del contexto si es necesario
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      // Considera actualizar el estado del contexto para reflejar el error
    }
  };

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial || loading, 
    error: errorFormSectorial || error,      
    updateFormId,
    pasoData: dataPaso,
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
  };


  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};