import { useNavigate } from 'react-router-dom';
import { SummaryDetail } from '../components/fase1/tables/SummaryDetail';
import { useCompetencia } from '../hooks/competencias/useCompetencias';

const Home = () =>
{
  const {
    dataCompetencia,
    currentPageListaHome,
    setCurrentPageListaHome,
    paginationListaHome
  } = useCompetencia();

  const navigate = useNavigate();
  const competenciasPerPage = 2; // Ajusta según sea necesario
  const totalPages = Math.ceil(paginationListaHome.count / competenciasPerPage);

  const handlePageChange = (newPage) =>
  {
    setCurrentPageListaHome(newPage);
  };

  const handleDetailsCompetencia = (competencia) =>
  {
    navigate(`/home/estado_competencia/${competencia.id}`, { state: { competencia } });
  };

  const tieneCompetencias = Array.isArray(dataCompetencia) && dataCompetencia.length > 0;

  return (
    <>
      <div className="col-10 container-home">
        {/* Verificar si hay competencias */}
        {!tieneCompetencias ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <span className="align-self-center text-sans-h2-tertiary my-5 py-5">
              Aún no tienes competencias asignadas
            </span>
          </div>
        ) : (
          <>
            {/* <div className="d-flex flex-row m-5">
              <div className="container-info p-2 mx-4">
                <span className="text-sans-p-grey align-self-start ms-2">Tiempo promedio proceso de<br /> levantamiento de información</span>
                <div className="d-flex justify-content-between">
                  <div className="text-sans-25 align-self-start me-5 ">3.1 meses</div><div className="align-self-end ms-5 ps-3 badge-percent px-3">+2,5%</div>
                </div>
              </div>
              <div className="container-info p-2 mx-4">
                <span className="text-sans-p-grey align-self-start ms-3">Levantamientos de información en <br /> curso</span>
                <div className="d-flex justify-content-between w-100">
                  <div className="text-sans-h3-bold align-self-start me-5 ms-3 pe-5">236</div><div className="align-self-end ms-5 me-3  ps-3 badge-percent-b px-3"> -1,2%</div>
                </div>
              </div>
              <div className="container-info p-2 mx-4">
                <span className="text-sans-p-grey align-self-start ms-3" >Levantamientos de información <br />terminados</span>
                <div className="d-flex justify-content-between w-100">
                  <div className="text-sans-h3-bold align-self-start me-5  ms-3 pe-5">2.352</div><div className="align-self-end ms-5 me-3 ps-3 badge-percent px-3">+11%</div>
                </div>
              </div>
            </div> */}
            {dataCompetencia.map(competencia => (
              <div key={competencia.id} className="container-competencia">
                <div className="container">
                  <div className="d-flex my-2">
                    <span className="badge-tipo">{competencia.agrupada ? 'Agrupada' : 'Individual'}</span>
                    <h3 className="mb-3 ms-3">{competencia.nombre}</h3>
                  </div>
                  <div>
                    <SummaryDetail competencia={competencia} tiempoTranscurrido={competencia.tiempo_transcurrido} />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button onClick={() => handleDetailsCompetencia(competencia)} className="btn-secundario-s link-underline link-underline-opacity-0 py-3">
                      <u>Ver competencia</u>
                      <span className="material-symbols-outlined">
                        arrow_forward_ios
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column flex-md-row my-5">
            <p className="text-sans-h5 mx-5 text-center">
              {`${Math.max((parseInt(currentPageListaHome) - 1) * competenciasPerPage + 1, 1)}- ${Math.min(parseInt(currentPageListaHome) * competenciasPerPage, paginationListaHome.count)} de ${paginationListaHome.count} competencias`}
            </p>
            <nav className="pagination-container mx-auto mx-md-0">
              <ul className="pagination ms-md-5">
                <li className={`page-item ${currentPageListaHome === 1 ? 'disabled' : ''}`}>
                  <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPageListaHome - 1)} disabled={currentPageListaHome === 1}>

                    &lt;
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPageListaHome === i + 1 ? 'active' : ''}`}>
                    <button className="custom-pagination-btn px-2 mx-2" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPageListaHome === totalPages ? 'disabled' : ''}`}>
                  <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPageListaHome + 1)} disabled={currentPageListaHome === totalPages}>
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;