import { createContext, useState } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm';
import { useUpdateForm } from '../hooks/formulario/useUpdateForm';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) =>
{
  const [ id, setId ] = useState(null);
  const [ stepNumber, setStepNumber ] = useState(null);


  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber);
  const { updatePaso, isUpdatingPaso, updatePasoError } = useUpdateForm();

  const updateFormId = setId;
  const updateStepNumber = setStepNumber;

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

  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};