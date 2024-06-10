import { Link, useNavigate } from 'react-router-dom';

export const FormTitle = ({ data, error, title }) => {
  const navigate = useNavigate();
  const handleBackButtonClick = () => { 
    navigate(-1); 
  }

  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>; 

  console.log("data en FormTitle", data)
  console.log("title en FormTitle", title)

  return (
    <div className="my-3 mx-3">
      <div className="py-3 d-flex">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
        </div>
        <nav className="container mx-2" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">
              <Link to={`/home/estado_competencia/${data.competencia_id || data.id}`}>{title}: {data.competencia_nombre}</Link>
            </li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">{title}</li>
          </ol>
        </nav>
      </div>
      <span className="text-sans-Title mt-3">{title}</span>
      <div className="my-3 mb-5">
        <div className="text-sans-h1 mb-1">{data.competencia_nombre}</div>
        <div className="text-sans-h2-grey mb-2">{data.sector_nombre || data.region_nombre}</div>
      </div>
    </div>
  );
}
