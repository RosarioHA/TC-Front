import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResumenFormulario } from "../../hooks/formulario/useResumenFormulario";

export const HorizontalStepper = ({ baseUrl, id }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { resumen, fetchResumen } = useResumenFormulario(id);

  const [stepsState, setStepsState] = useState([]);

  const stepTitles = useMemo(() => [
    'Descripción de la Institución',
    'Arquitectura del Proceso',
    'Cobertura de la Competencia',
    'Indicadores de Desempeño',
    'Costeo de la Competencia'
  ], []);

  useEffect(() => {
    if (resumen) {
      const newState = stepTitles.map((title, index) => {
        const paso = resumen[`paso${index + 1}`];
        const estado = paso && paso.estado_stepper ? paso.estado_stepper : 'default';
        const esPasoActual = location.pathname === `${baseUrl}/paso_${index + 1}`;
        return esPasoActual && estado === 'default' ? 'active' : estado;
      });
      setStepsState(newState);
    }
  }, [resumen, stepTitles, location.pathname, baseUrl]);

  const goToStep = (stepNumber) => {
    navigate(`${baseUrl}/paso_${stepNumber}`);
    fetchResumen();
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
            {['active', 'default'].includes(state) && (index + 1)}
          </button>
          <div className="step-text me-0 ms-0">
            {stepTitles[index]}
          </div>
        </div>
      ))}
    </div>
  );
};