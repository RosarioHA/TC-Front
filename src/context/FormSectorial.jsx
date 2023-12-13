import { createContext, useState } from 'react';
import { useFormSectorial } from '../hooks/formulario/useFormulario';
import { usePasoForm } from '../hooks/formulario/usePasoForm'; 

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const [id, setId] = useState(1);
  const [stepNumber, setStepNumber] = useState(1); 
  const { dataFormSectorial, loadingFormSectorial, errorFormSectorial } = useFormSectorial(id);
  const { dataPaso, loadingPaso, errorPaso } = usePasoForm(id, stepNumber); 

  const value = {
    data: dataFormSectorial,
    loading: loadingFormSectorial,
    error: errorFormSectorial,
    updateFormId: setId,
    pasoData: dataPaso,
    loadingPaso,
    errorPaso,
    updateStepNumber: setStepNumber, 
  };


  
  return (
    <FormularioContext.Provider value={value}>
      {children}
    </FormularioContext.Provider>
  );
};