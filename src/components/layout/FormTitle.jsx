import { Link, useNavigate } from 'react-router-dom';

export const FormTitle = () =>
{
  const navigate = useNavigate();
  const id = 22; 

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };
  return (
    <div className="my-3 mx-3">
      <div className="py-3 d-flex">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0 text-decoration-underline">Volver</p>
        </button>
        <nav className="container mx-5" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page"><Link to={`/home/estado_competencia/${id}`}>Formulario Sectorial: $competencia nombre</Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Formulario Sectorial</li>
          </ol>
        </nav>
      </div>
      <span className="text-sans-Title mt-3">Formulario Sectorial</span>
      <div className="my-3 border-bottom">
        <div className="text-sans-h1 mb-1">$NombreCompetencia </div>
        <div className="text-sans-h2-grey mb-2">$SectorCompetencia </div>
      </div>
    </div>
  )
}
