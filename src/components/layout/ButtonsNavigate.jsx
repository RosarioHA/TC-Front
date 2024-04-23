import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ButtonsNavigate = ({ step, id, ocultarEnviarBtn }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userGore = userData?.perfil?.includes('GORE');

  const getRouteForStep = (stepNumber) => {
    const stepToRouteMap = {
      1: `/home/formulario_sectorial/${id}/paso_1`,
      2: `/home/formulario_sectorial/${id}/paso_2`,
      3: `/home/formulario_sectorial/${id}/paso_3`,
      4: `/home/formulario_sectorial/${id}/paso_4`,
      5: `/home/formulario_sectorial/${id}/paso_5`,
    };
    return stepToRouteMap[ stepNumber ];
  };

  const handleNextButtonClick = () => {
    if (step < 5) {
      navigate(getRouteForStep(step + 1));
    } else {
      const resumenRoute = userSubdere
        ? `/home/formulario_sectorial/${id}/resumen_OS`
        : `/home/formulario_sectorial/${id}/resumen_formulario`;
      navigate(resumenRoute);
    }
  };

  return ( 
  <div className={`px-5 me-5 pt-3 pb-4 d-flex ${step === 1 ? "justify-content-end" : "justify-content-between"}`}>
      {/* El botón "Atrás" solo se muestra si no estamos en el primer paso */}
      {step > 1 ? (
        <button className="btn-secundario-s" onClick={() => navigate(getRouteForStep(step - 1))}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>
      ) : <div></div> /* Elemento vacío para mantener el espacio */}

      {/* Botón "Siguiente" o "Ir a resumen de formulario" */}
      {step < 5 && !ocultarEnviarBtn ? (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          Siguiente
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      ) : !ocultarEnviarBtn && !userGore && (
        <button className="btn-primario-s" onClick={handleNextButtonClick}>
          {userSubdere ? 'Ir a resumen Observaciones Subdere' : 'Ir a resumen de formulario'}
        </button>
      )}
    </div>
  );
};