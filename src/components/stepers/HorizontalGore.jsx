import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResumenGore } from "../../hooks/fase1/fomularioGore/useResumenGore";

export const HorizontalGore = ({ baseUrl, id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumen, fetchResumen } = useResumenGore(id);
  const [stepsState, setStepsState] = useState([]);

  const stepTitles = useMemo(() => [
    'Proyección del ejercicio de la competencia',
    'Estimación de recursos económicos',
    'Incidencia en la capacidad administrativa',
  ], []);

  useEffect(() => {
    if (resumen) {
      const newState = stepTitles.map((title, index) => {
        const pasoKey = `paso${index + 1}_gore`;
        const paso = resumen[pasoKey];
        const estado = paso?.estado_stepper || 'default';
        const esPasoActual = location.pathname === `${baseUrl}/paso_${index + 1}`;

        return {
          estado: esPasoActual && estado === 'default' ? 'active' : estado,
          numeroPaso: index + 1,
        };
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
      {stepsState.map(({ estado, numeroPaso }, index) => (
        <div key={index} className="step">
          <button
            className={`step-button ${estado}`}
            onClick={() => goToStep(numeroPaso)}
          >
            {estado === 'done' ? '✓' : numeroPaso}
          </button>
          <div className="step-text me-0 ms-0">
            {stepTitles[index]}
          </div>
        </div>
      ))}
    </div>
  );
};
