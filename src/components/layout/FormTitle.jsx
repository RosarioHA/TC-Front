import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompetencia } from '../../hooks/competencias/useCompetencias';

export const FormTitle = ({ data, error, title }) => {
  const navigate = useNavigate();
  const handleBackButtonClick = () => { 
    navigate(-1); 
  }
  const id = data?.competencia_id;
  const {competenciaDetails }  = useCompetencia(id);
  const [competenciasCollapsed, setCompetenciasCollapsed] = useState(false);
  const competenciasAgrupadas = competenciaDetails?.competencias_agrupadas;
  const numCompetenciasAgrupadas = competenciasAgrupadas ? competenciasAgrupadas.length : 0;
  
  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>; 

  console.log("competenciaDetails en FormTitle", competenciaDetails) // data de la competencia que necesitamos
  console.log("competenciasAgrupadas en FormTitle", competenciasAgrupadas);
  console.log("numCompetenciasAgrupadas en FormTitle", numCompetenciasAgrupadas);
  
  const toggleCompetenciasCollapse = () => {
    setCompetenciasCollapsed(!competenciasCollapsed);
  };

  const renderCompetenciasAgrupadas = () => {
    //competencias individuales CHECK
    if (competenciasAgrupadas && competenciasAgrupadas.length === 0) {
      return (
        <div className="">
          <span className="text-sans-h1 mb-1">{competenciaDetails?.nombre}</span>
        </div>
      );
    //competencias agrupadas
    } else if (competenciasAgrupadas?.length > 0) {
    return(
      <div>
        <button 
        type="button" 
        onClick={toggleCompetenciasCollapse}
        className="btn d-flex justify-content-between w-100 px-0"
        >
          <span className="text-sans-h1 mb-1">{competenciaDetails?.nombre}</span>
          <div className="d-flex align-items-center">
            <span className="badge-info-expandibles">
              <p className="my-0">{numCompetenciasAgrupadas} competencias</p>
            </span>
            <span className="material-symbols-outlined text-black ms-2">
              {competenciasCollapsed ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </button>
        <div className={`collapse ${competenciasCollapsed ? 'show' : ''}`}>
          <table className="table table-striped">
            <tbody>
              {competenciasAgrupadas.map((competencia, index) => (
                <tr key={index}>
                  <td className="d-flex justify-content-between">
                    <span className="text-sans-h5 mb-1">{competencia.nombre}</span>
                    <button>boton? a donde?</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    return null;
  };

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
        <div className="">
          {renderCompetenciasAgrupadas()}
        </div>
        <div className="text-sans-h2-grey mb-2">{data.sector_nombre || data.region_nombre}</div>
        <div>AQUI TIENE QUE IR LAS REGIONES/SECTORES SEGUN SI ES FORM SECTORIAL O GORE</div>
      </div>
    </div>
  );
}
