import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [hasChanged, setHasChanged] = useState(false);

  const updateHasChanged = (value) => {
    console.log('Nuevo valor de hasChanged en context:', value);
    setHasChanged(value);
  };

  return (
    <FormContext.Provider value={{ hasChanged, updateHasChanged }}>
      {children}
    </FormContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext debe ser utilizado dentro de FormProvider');
  }
  return context;
};
