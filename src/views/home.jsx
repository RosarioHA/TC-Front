import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SummaryDetail } from '../components/tables/SummaryDetail';
import { CompetenciasContext } from '../context/competencias';

const Home = () =>
{
  const { dataCompetencia } = useContext(CompetenciasContext);
  const  navigate =  useNavigate(); 


  const handleDetailsCompetencia = (competencia) => {
    navigate(`/home/estado_competencia/${competencia.id}`, { state: { competencia } });
  };

    // Verifica si dataCompetencia es un arreglo y no está vacío
    const tieneCompetencias = Array.isArray(dataCompetencia) && dataCompetencia.length > 0;


  return (
    <>
      <div className="container-home">
        {/* Verificar si hay competencias */}
        {!tieneCompetencias ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <span className="align-self-center text-sans-h2-tertiary my-5 py-5">
              Aún no tienes competencias asignadas
            </span>
          </div>
        ) : (
          <>
            <div className="d-flex flex-row m-5">
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
            </div>
            {dataCompetencia.map(competencia => (
              <>
                <div className="container-compentencia" >
                  <div className="container" key={competencia.id}>
                    <h3 className="my-3">{competencia.nombre}</h3>
                    <SummaryDetail competencia={competencia} tiempoTranscurrido={competencia.tiempo_transcurrido} />
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
              </>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Home;