import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const NavigationGore= ({ step , id }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userDipres = userData?.perfil?.includes('DIPRES');

  const getRouteForStep = (stepNumber) => {
    const stepToRouteMap = {
      1: `/home/formulario_gore/${id}/paso_1`,
      2: `/home/formulario_gore/${id}/paso_2`,
      3: `/home/formulario_gore/${id}/paso_3`,
    };
    return stepToRouteMap[ stepNumber ];
  };

  const handleNextButtonClick = () => {
    if (step < 3) {
      navigate(getRouteForStep(step + 1));
    } else {
      const resumenRoute = userSubdere
        ? `/home/formulario_gore/${id}/resumen_observaciones_gore`
        : `/home/formulario_gore/${id}/resumen_formulario_gore`;
      navigate(resumenRoute);
    }
  };

  return ( <div className={`px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {/* El botón "Atrás" solo se muestra si no estamos en el primer paso */}
      {step > 1 ? (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="text-decoration-underline mb-0">Atrás</p>
        </button>
      ) : <div></div> /* Elemento vacío para mantener el espacio */}

      {/* Botón "Siguiente" */}
      {step < 3 && (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          <p className="text-decoration-underline mb-0">Siguiente</p>
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      )}

      {/* Botón "Ir a resumen de formulario" */}
      {step === 3 && !userDipres && (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          {userSubdere ? 'Ir a resumen de observaciones Subdere' : 'Ir a resumen de formulario'}
        </button>
      )}
    </div>
  );
};