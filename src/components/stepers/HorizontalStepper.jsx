import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HorizontalStepper = ({ baseUrl }) => {
  const [stepsState, setStepsState] = useState(['default', 'active', 'warning', 'done', 'default']);
  const navigate = useNavigate();

  const stepTitles = [
    'Descripción de la Institución',
    'Arquitectura del Proceso',
    'Cobertura de la Competencia',
    'Indicadores de Desempeño',
    'Costeo de la Competencia'
  ];

  const goToStep = (stepNumber) => {
    const newStepsState = stepsState.map((state, index) => {
      if (index === stepNumber - 1) {
        return state === 'active' ? 'done' : 'active';
      }
      return state === 'done' ? 'done' : 'default';
    });

    // Navegación dinámica usando baseUrl y el número de paso actualizado
    navigate(`${baseUrl}/paso_${stepNumber}`);

    setStepsState(newStepsState);
  };

  return (
    <div className="stepper-pasos d-flex w-75 mx-auto">
      {stepsState.map((state, index) => (
        <div key={index} className="step">
          <button
            className={`step-button ${state}`}
            onClick={() => goToStep(index + 1)}
          >
            {state === 'done' && '✓'}
            {state === 'active' && (index + 1)}
            {state === 'warning' && '!'}
            {state === 'default' && (index + 1)}
          </button>
          <div className="step-text me-0 ms-0">
            {stepTitles[index]}
          </div>
        </div>
      ))}
    </div>
  );
};
