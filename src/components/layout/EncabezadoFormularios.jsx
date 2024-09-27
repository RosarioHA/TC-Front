import { useState } from 'react';
import { useCompetencia } from '../../hooks/competencias/useCompetencias';

export const EncabezadoFormularios = ({ id, hideRegiones }) => {
  const { competenciaDetails } = useCompetencia(id);
  const [ competenciasCollapsed, setCompetenciasCollapsed ] = useState(false);
  const [ regionesCollapsed, setRegionesCollapsed ] = useState(false);
  const [ sectoresCollapsed, setSectoresCollapsed ] = useState(false);

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
      return (
        <>
          <span className="text-sans-h1 mb-1 text-start">{competenciaDetails?.nombre}</span>
          <div className="">
            <button
              type="button"
              onClick={toggleCompetenciasCollapse}
              className="btn_desplegables_encabezados d-flex justify-content-between w-100 px-0"
            >
              <span className="text-sans-m-semibold-greyc mb-1">Competencias Agrupadas </span>
              <div className="d-flex align-items-center">
                <span className="badge-info-expandibles">
                  <p className="my-0 text-nowrap">{numCompetenciasAgrupadas} competencias</p>
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
        </>
      )
    }
    return null;
  };

  const renderRegiones = () => {
    const regiones = competenciaDetails?.nombres_regiones; //aqui falta apuntar al campo correcto
    const numRegiones = regiones ? regiones.length : 0;

    if (regiones && numRegiones > 0) {
      if (numRegiones === 1) {
        return (
          <div className="">
            <span className="text-sans-h3-greyc mb-1">{regiones[ 0 ].nombre}</span>
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
                  <p className="my-0 text-nowrap">{numRegiones} regiones</p>
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
                        <span className="text-sans-h5 mb-1">{region.nombre}</span>
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
            <span className="text-sans-h3-greyc mb-1">{sectores[ 0 ].nombre}</span>
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
    <div>
      <div className="">
        {renderCompetenciasAgrupadas()}
      </div>
      {!hideRegiones && (
        <div className="">
          {renderRegiones()}
        </div>
      )}
      <div className="">
        {renderSectores()}
      </div>
    </div>
  );
}