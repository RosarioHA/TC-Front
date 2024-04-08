import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const NavigationSubdere = ({ step, id, permisoSiguiente, solo_lectura }) => {
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
    // Solo navegar si permisoSiguiente es true
    if (!permisoSiguiente) {
      alert('Por favor, completa los requisitos necesarios para avanzar al siguiente paso.'); // O cualquier otra forma de feedback al usuario
      return; // No hacer nada si no se tienen los permisos
    }
    if (step < 2) {
      navigate(getRouteForStep(step + 1));
    } else {
      const resumenRoute = userSubdere
        ? `/home/revision_subdere/${id}/resumen_revision_final`
        : `/home/revision_subdere/${id}/resumen_revision_final`;
      navigate(resumenRoute);
    }
  };

  const handleExpedienteButtonClick = () => {
    navigate(`/home/estado_competencia/${id}`);
  };

  return (
    <div className={`px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {step > 1 && (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="text-decoration-underline mb-0">Atrás</p>
        </button>
      )}

      {step < 2 && (
        <button className={`btn-primario-s ${!(permisoSiguiente || solo_lectura) ? 'disabled' : ''}`} onClick={handleNextButtonClick} disabled={!permisoSiguiente && !solo_lectura}>
          <p className="text-decoration-underline mb-0">Siguiente</p>
          <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
        </button>
      )}

      {step === 2 && (
        <div>
          {solo_lectura ? (
            <button className="btn-primario-s" onClick={handleExpedienteButtonClick}>
              <p className="text-decoration-underline mb-0">Ir al expediente de la competencia</p>
            </button>
          ) : (
            <button className="btn-primario-s" onClick={handleNextButtonClick}>
              <p className="text-decoration-underline mb-0">{userSubdere ? 'Ir a resumen de observaciones final Subdere' : 'Ir a resumen de formulario'}</p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};