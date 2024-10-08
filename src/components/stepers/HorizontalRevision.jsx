import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResumenFinal } from "../../hooks/fase1/revisionFinalSubdere/useResumenFinal";

export const HorizontalRevision = ({ baseUrl, permisoSiguiente, permisoPaso2 , id}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {resumen, fetchResumen} = useResumenFinal(id);
  const [stepsState, setStepsState] = useState([]);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen, id]);

  useEffect(() => {
    if (resumen) {
      const newStepsState = [
        resumen.paso1_revision_final_subdere?.estado_stepper === 'done' ? 'done' : 'default',
        resumen.paso2_revision_final_subdere?.estado_stepper === 'done' ? 'done' : 'default',
      ];
      setStepsState(newStepsState);
    }
  }, [resumen]);

  const stepTitles = useMemo(() => [
    'Ámbito y recomendación de transferencia',
    'Condiciones de transferencia',
  ], []);

  const regionesSeleccionadas = permisoSiguiente?.paso1_revision_final_subdere?.regiones_seleccionadas;

  const goToStep = (stepNumber) => {
    navigate(`${baseUrl}/paso_${stepNumber + 1}/`);
    setStepsState(prevState =>
      prevState.map((state, index) => index === stepNumber ? 'active' : index < stepNumber ? 'done' : 'default')
    );
  };

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
