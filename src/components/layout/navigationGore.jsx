import { useNavigate } from 'react-router-dom';

export const NavigationGore= ({ step , id }) =>
{
  const navigate = useNavigate();

  const getRouteForStep = (stepNumber) =>
  {
    const stepToRouteMap = {
      1: `/home/formulario_gore/${id}/paso_1`,
      2: `/home/formulario_gore/${id}/paso_2`,
      3: `/home/formulario_gore/${id}/paso_3`,
    };
    return stepToRouteMap[ stepNumber ];
  };

  const handleNextButtonClick = () =>
  {
    if (step < 3)
    {
      navigate(getRouteForStep(step + 1));
    } else
    {
      navigate( `/home/formulario_gore/${id}/resumen_formulario_gore`);
    }
  };

  return ( <div className={`px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {/* El botón "Atrás" solo se muestra si no estamos en el primer paso */}
      {step > 1 ? (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>
      ) : <div></div> /* Elemento vacío para mantener el espacio */}

      {/* Botón "Siguiente" o "Ir a resumen de formulario" */}
      {step < 3 ? (
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