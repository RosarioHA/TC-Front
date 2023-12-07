import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HorizontalStepper = () =>
{
  // Estado inicial de los pasos
  const [ stepsState, setStepsState ] = useState([ 'default', 'active', 'warning', 'done', 'default' ]);
  const navigate = useNavigate();
  // Títulos para cada paso
  const stepTitles = [
    'Descripción de la Institución',
    'Arquitectura del Proceso',
    'Cobertura de la Competencia',
    'Indicadores de Desempeño',
    'Costeo de la Competencia' ];



  const goToStep = (stepNumber) =>
  {
    // Actualizar solo el estado del paso en el que se hizo clic
    const newStepsState = stepsState.map((state, index) =>
    {
      // Si se hace clic en el paso, alternar entre 'active' y 'done'
      if (index === stepNumber - 1)
      {
        return state === 'active' ? 'done' : 'active';
      }
      // Si un paso no está 'active' o 'done', se mantiene en 'default'
      return state === 'done' ? 'done' : 'default';
    });
    // Navegación basada en el paso seleccionado
    switch (stepNumber)
    {
      case 1:
        navigate('/home/formulario_sectorial/paso_uno');
        break;
      case 2:
        navigate('/home/formulario_sectorial/paso_dos');
        break;
      case 3:
        navigate('/home/formulario_sectorial/paso_tres');
        break;
      case 4:
        navigate('/home/formulario_sectorial/paso_cuatro');
        break;
      case 5:
        navigate('/home/formulario_sectorial/paso_cinco');
        break;
    }

    setStepsState(newStepsState);
  };

  return (
    <div className="stepper-pasos d-flex  w-75 mx-auto">
      {stepsState.map((state, index) => (

        <div key={index} className="step ">
          <button
            className={`step-button ${state}`}
            onClick={() => goToStep(index + 1)}
          >
            {state === 'done' && '✓'}
            {state === 'active' && (index + 1)}
            {state === 'warning' && '!'}
            {state === 'default' && (index + 1)}
          </button>
          <>
            <div className="step-text me-0 ms-0">
              {stepTitles[ index ]}
            </div>
          </>
        </div>
      ))}
    </div>
  );
};