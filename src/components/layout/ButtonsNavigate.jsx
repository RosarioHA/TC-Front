import { useNavigate } from 'react-router-dom';
export const ButtonsNavigate = () =>
{

  const navigate = useNavigate();

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };



  return (
    <div className="border-top mx-4 pt-3 pb-4 d-flex justify-content-between ">
      <button className="btn-secundario-s" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Atrás</p>
      </button>
      <button className="btn-primario-s"><u>Siguiente</u><span className="material-symbols-outlined">
        arrow_forward_ios
      </span></button>
    </div>
  )
}
