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
  const { updatePaso, isUpdatingPaso, updatePasoError } = useUpdateForm();

  const updateFormId = (newId) => {
    setId(newId);
    localStorage.setItem('formId', newId);
  };

  const updateStepNumber = (newStepNumber) => {
    setStepNumber(newStepNumber);
    localStorage.setItem('stepNumber', newStepNumber);
  };

  const handleUpdatePaso = async (id, stepNumber, datosPaso, archivos = {}) => {
    try {
      await updatePaso(id, stepNumber, datosPaso, archivos);
    } catch (error) {
      // Manejar el error aquí
      console.error("Error al guardar los datos:", error);
    }
  };

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial,
    error: errorFormSectorial,
    updateFormId,
    pasoData: dataPaso,
    loadingPaso,
    errorPaso,
    updateStepNumber,
    stepNumber,
    handleUpdatePaso,
    isUpdatingPaso,
    updatePasoError
  };


  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};