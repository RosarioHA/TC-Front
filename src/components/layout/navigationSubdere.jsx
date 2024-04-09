import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const NavigationSubdere = ({ step, id, permisoSiguiente }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');


  const getRouteForStep = (stepNumber) => {
    const stepToRouteMap = {
      1: `/home/revision_subdere/${id}/paso_1`,
      2: `/home/revision_subdere/${id}/paso_2`,
    };
    return stepToRouteMap[stepNumber];
  };

  const handleNextButtonClick = () => {
    if (step < 2) {
      navigate(getRouteForStep(step + 1));
    } else {
      const resumenRoute = userSubdere
        ? `/home/revision_subdere/${id}/resumen_revision_final`
        : `/home/revision_subdere/${id}/resumen_revision_final`;
      navigate(resumenRoute);
    }
  };

  return (
    <div className={`px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {step > 1 && (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>
      )}
      {step < 2 && (
        <button className={`btn-primario-s ${!permisoSiguiente ? 'disabled' : ''}`} onClick={handleNextButtonClick} disabled={!permisoSiguiente}>
          Siguiente
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      )}
      {step === 2 && (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          {userSubdere ? 'Ir a resumen de observaciones final Subdere' : 'Ir a resumen de formulario'}
        </button>
      )}
    </div>
  );
};