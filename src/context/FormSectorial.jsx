import { createContext, useState } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) =>
{
  const [ id, setId ] = useState(null);
  const [ stepNumber, setStepNumber ] = useState(null);

  // Hooks personalizados que usan el id y stepNumber
  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber);
  const { updatePaso, isUpdatingPaso, updatePasoError } = useUpdateForm();

  // Función para actualizar el ID del formulario en el contexto
  const updateFormId = setId;
  // Función para actualizar el número de paso en el contexto
  const updateStepNumber = setStepNumber;

  // El valor que se pasará a los consumidores del contexto
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
    updatePaso,
    isUpdatingPaso,
    updatePasoError
  };

  console.log("ID en el contexto:", id);



  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};