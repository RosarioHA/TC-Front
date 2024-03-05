import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HorizontalGore = ({ baseUrl }) => {
  // Initialize with three steps - assuming the first step is 'active' to start with
  const [stepsState, setStepsState] = useState(['active', 'default', 'default']);

  const navigate = useNavigate();

  const stepTitles = [
    'Proyección del ejercicio de la competencia',
    'Estimación de recursos económicos',
    'Estimación de personal y de administración',
  ];

  const goToStep = (stepNumber) => {
    const newStepsState = stepsState.map((state, index) => {
      if (index < stepNumber) {
        return 'done'; // Mark all previous steps as done
      } else if (index === stepNumber) {
        return 'active'; // Mark the current step as active
      }
      return 'default'; // Future steps remain default
    });

    // Navigate to the corresponding step in the process
    navigate(`${baseUrl}/paso_${stepNumber + 1}`); // Adjusted to 0-based index

    setStepsState(newStepsState);
  };

  return (
    <div className="stepper-pasos d-flex w-75 mx-auto">
      {stepsState.map((state, index) => (
        <div key={index} className={`step ${state}`}>
          <button
            className={`step-button ${state}`}
            onClick={() => goToStep(index)}
          >
            {state === 'done' && '✓'}
            {state === 'active' && (index + 1)}
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