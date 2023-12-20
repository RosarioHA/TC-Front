import { useNavigate } from 'react-router-dom';

export const ButtonsNavigate = ({ step , id }) =>
{
  const navigate = useNavigate();

  const getRouteForStep = (stepNumber) =>
  {
    const stepToRouteMap = {
      1: `/home/formulario_sectorial/${id}/paso_uno`,
      2: `/home/formulario_sectorial/${id}/paso_dos`,
      3: `/home/formulario_sectorial/${id}/paso_tres`,
      4: `/home/formulario_sectorial/${id}/paso_cuatro`,
      5: `/home/formulario_sectorial/${id}/paso_cinco`,
    };
    return stepToRouteMap[ stepNumber ];
  };

  const handleNextButtonClick = () =>
  {
    if (step < 5)
    {
      navigate(getRouteForStep(step + 1));
    } else
    {
      navigate('/home/');
    }
  };

  return (
    <div className={`border-top px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {/* El botón "Atrás" solo se muestra si no estamos en el primer paso */}
      {step > 1 ? (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>
      ) : <div></div> /* Elemento vacío para mantener el espacio */}

      {/* Botón "Siguiente" o "Ir a resumen de formulario" */}
      {step < 5 ? (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          Siguiente
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      ) : (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          Ir a resumen de formulario
        </button>
      )}
    </div>
  );
};