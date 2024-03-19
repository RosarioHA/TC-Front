import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HorizontalRevision = ({ baseUrl }) => {
  // Initialize with three steps - assuming the first step is 'active' to start with
  const [stepsState, setStepsState] = useState(['active', 'default']);

  const navigate = useNavigate();

  const stepTitles = [
    'Ámbito y recomendación de transferencia',
    'Condiciones de transferencia',

  ];

  const goToStep = (stepNumber) => {
    const newStepsState = stepsState.map((state, index) => index === stepNumber ? 'active' : index < stepNumber ? 'done' : 'default');
    
    navigate(`${baseUrl}/paso_${stepNumber + 1}`);
    setStepsState(newStepsState);

  };

  return (
    <div className="stepper-pasos d-flex w-50 mx-auto">
    {stepsState.map((state, index) => (
      <div key={index} className={`step ${state}`}>
        <button className={`step-button ${state}`} onClick={() => goToStep(index)}>
          {state === 'done' ? '✓' : index + 1}
        </button>
        <div className="step-text me-0 ms-0">{stepTitles[index]}</div>
      </div>
    ))}
  </div>
  );
};