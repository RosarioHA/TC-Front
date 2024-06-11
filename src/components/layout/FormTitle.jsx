import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompetencia } from '../../hooks/competencias/useCompetencias';

export const FormTitle = ({ data, error, title }) => {
  const navigate = useNavigate();
  const id = data?.competencia_id;
  const {competenciaDetails }  = useCompetencia(id);
  const [competenciasCollapsed, setCompetenciasCollapsed] = useState(false);
  const [regionesCollapsed, setRegionesCollapsed] = useState(false);
  const [sectoresCollapsed, setSectoresCollapsed] = useState(false);
  
  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>; 

  console.log("competenciaDetails", competenciaDetails);

  const handleBackButtonClick = () => { 
    navigate(-1); 
  }
  
  const toggleCompetenciasCollapse = () => {
    setCompetenciasCollapsed(!competenciasCollapsed);
  };
  const toggleRegionesCollapse = () => {
    setRegionesCollapsed(!regionesCollapsed);
  };
  const toggleSectoresCollapse = () => {
    setSectoresCollapsed(!sectoresCollapsed);
  };

  const renderCompetenciasAgrupadas = () => {
    const competenciasAgrupadas = competenciaDetails?.competencias_agrupadas;
    const numCompetenciasAgrupadas = competenciasAgrupadas ? competenciasAgrupadas.length : 0;
    if (competenciasAgrupadas && competenciasAgrupadas.length === 0) {
      return (
        <div className="">
          <span className="text-sans-h1 mb-1">{competenciaDetails?.nombre}</span>
        </div>
      );
    } else if (competenciasAgrupadas?.length > 0) {
    return(
      <div>
        <button 
        type="button" 
        onClick={toggleCompetenciasCollapse}
        className="btn_desplegables_encabezados d-flex justify-content-between w-100 px-0"
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

  const renderRegiones = () => {
    const regiones = competenciaDetails?.nombres_regiones;
    const numRegiones = regiones ? regiones.length : 0;

    if (regiones && numRegiones > 0) {
      if (numRegiones === 1) {
        return (
          <div className="">
            <span className="text-sans-h3-greyc mb-1">{regiones[0].region}</span>
          </div>
        );
      } else {
        return (
          <div>
            <button
              type="button"
              onClick={toggleRegionesCollapse}
              className="btn_desplegables_encabezados d-flex justify-content-between w-100 px-0"
            >
              <span className="text-sans-m-semibold-greyc mb-1">Regiones</span>
              <div className="d-flex align-items-center">
                <span className="badge-info-expandibles">
                  <p className="my-0">{numRegiones} regiones</p>
                </span>
                <span className="material-symbols-outlined text-black ms-2">
                  {regionesCollapsed ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            <div className={`collapse ${regionesCollapsed ? 'show' : ''}`}>
              <table className="table table-striped">
                <tbody>
                  {regiones.map((region, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="text-sans-h5 mb-1">{region.region}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const renderSectores = () => {
    const sectores = competenciaDetails?.sectores;
    const numSectores = sectores ? sectores.length : 0;

    if (sectores && numSectores > 0) {
      if (numSectores === 1) {
        return (
          <div className="">
            <span className="text-sans-h3-greyc mb-1">{sectores[0].nombre}</span>
          </div>
        );
      } else {
        return (
          <div>
            <button
              type="button"
              onClick={toggleSectoresCollapse}
              className="btn_desplegables_encabezados d-flex justify-content-between w-100 px-0"
            >
              <span className="text-sans-m-semibold-greyc mb-1">Sectores</span>
              <div className="d-flex align-items-center">
                <span className="badge-info-expandibles">
                  <p className="my-0">{numSectores} sectores</p>
                </span>
                <span className="material-symbols-outlined text-black ms-2">
                  {sectoresCollapsed ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            <div className={`collapse ${sectoresCollapsed ? 'show' : ''}`}>
              <table className="table table-striped">
                <tbody>
                  {sectores.map((sector, index) => (
                    <tr key={index}>
                      <td className="d-flex justify-content-between">
                        <span className="text-sans-h5 mb-1">{sector.nombre}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="container col-11 my-3 mx-3">
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
        <div className="">
          {title.includes('Sectorial') && renderRegiones()}
          {title.includes('Regional') && renderSectores()}
        </div>
      </div>
    </div>
  );
}
