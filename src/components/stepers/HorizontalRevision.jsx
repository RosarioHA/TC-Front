import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const HorizontalRevision = ({ baseUrl, permisoSiguiente, permisoPaso2 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const stepTitles = [
    'Ámbito y recomendación de transferencia',
    'Condiciones de transferencia',
  ];

  const regionesSeleccionadas = permisoSiguiente?.paso1_revision_final_subdere?.regiones_seleccionadas;

  const [stepsState, setStepsState] = useState(['active', 'default']);

  useEffect(() => {
    const currentStep = location.pathname.includes("/paso_2") ? 2 : 1;
    if (currentStep === 2) {
      setStepsState(['default', 'active']);
    } else if (regionesSeleccionadas && permisoPaso2) {
      // Asumiendo que quieres hacer algo con permisoPaso2 y regionesSeleccionadas para habilitar el paso 2
      // Ajustamos según sea necesario.
      setStepsState(['default', 'active']);
    }
  }, [location, regionesSeleccionadas, permisoPaso2]);

  const goToStep = (stepNumber) => {
    navigate(`${baseUrl}/paso_${stepNumber + 1}/`);
    setStepsState(prevState =>
      prevState.map((state, index) => index === stepNumber ? 'active' : index < stepNumber ? 'done' : 'default')
    );
  };

  // Ajustamos la lógica aquí para que el botón del paso 2 esté habilitado si estamos en el paso 2
  const isStepTwoDisabled = location.pathname.includes("/paso_1") && !(regionesSeleccionadas === permisoPaso2);

  return (
    <div className="stepper-pasos d-flex col-7 mx-auto">
      {stepsState.map((state, index) => (
        <div key={index} className={`step ${state}`}>
          <button
            className={`step-button ${state} ${index === 1 && isStepTwoDisabled ? 'disabled' : ''}`}
            onClick={() => index === 1 && isStepTwoDisabled ? null : goToStep(index)}
            disabled={index === 1 && isStepTwoDisabled}
          >
            {state === 'done' ? '✓' : index + 1}
          </button>
          <div className="step-text mt-2 w-50">{stepTitles[index]}</div>
        </div>
      ))}
    </div>
  );
};
