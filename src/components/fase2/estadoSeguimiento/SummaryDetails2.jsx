// import { useAuth } from '../../../context/AuthContext'; 
import { useCompetenciasPostCid } from '../../../hooks/competencias/fase2/useCompetenciasPostCID';

export const SummaryDetail2 = ({ competencia }) => {
  const { competenciaPostCid } = useCompetenciasPostCid(competencia.id);
  // const { userData } = useAuth();
  // const { descargarDocumento , verificarDocumento , disponible } = useDescargarDocumento(competencia.id);
  // const userSubdere = userData?.perfil?.includes('SUBDERE');

  console.log("competenciaPostCid en SummaryDetails2, viene del hook", competenciaPostCid);
  console.log("competencia en SummaryDetails2, viene del padre", competencia);

  const etapas_info = competenciaPostCid?.etapas_info || competenciaPostCid?.resumen_competencia?.etapas_info;
  // const tiempo_transcurrido =
  // competenciaPostCid?.tiempo_transcurrido ||
  // competenciaPostCid?.resumen_competencia?.tiempo_transcurrido;
  // const fechaFin =
  // competenciaPostCid?.fecha_fin || competenciaPostCid?.resumen_competencia?.fecha_fin;

  if (!competenciaPostCid || !etapas_info) {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando...</div>;
  }
  // Transformar etapas_info en un arreglo para facilitar su manejo
  const etapasArray = Object.keys(etapas_info).map((key) => ({
    id: key,
    ...etapas_info[ key ],
  }));

  // Calcula la cantidad de etapas finalizadas
  const etapasFinalizadas = etapasArray.filter(
    (etapa) => etapa.estado === 'Finalizada' || etapa.estado === 'Omitida'
  ).length;
  const totalEtapas = etapasArray.length;

  const getBadgeDetails = (estado) => {
    const badgeClasses = {
      Finalizada: 'badge-status-finish',
      'En Estudio': 'badge-status-review',
      'En revisión SUBDERE': 'badge-status-study',
      'Aún no puede comenzar': 'badge-status-pending',
      Omitida: 'badge-status-pending',
      Finalizado: 'badge-status-green',
      Pendiente: 'badge-status-pending',
      Favorable: 'badge-status-finish',
      'Favorable Parcial': 'badge-status-study',
      Desfavorable: 'badge-status-red',
      'Atrasada': 'badge-status-borderRed',
    };

    const classForState = badgeClasses[ estado ] || '';
    return { class: classForState, text: estado };
  };

  return (
    <>
      <div className="row">
        <div className="col-4">
          <div className="d-flex flex-row my-3 justify-content-center">
            <span className="d-flex align-items-center me-5">
              <div className="circle-color-blue mx-2"></div>Finalizado
            </span>
            <span className="d-flex align-items-center me-4">
              <div className="circle-color-light-blue mx-2"></div>Restante
            </span>
          </div>
          <div className="">
            <ul className="chart-skills">
              {Array.from({ length: etapasFinalizadas }, (_, index) => (
                <li key={index}>
                  <span></span>
                </li>
              ))}
              <div className="chart-text">
                <div className="chart-numbers ">
                  {etapasFinalizadas} de {totalEtapas}
                </div>
                <p>Etapas finalizadas</p>
              </div>
            </ul>

            <div>
              <div className="d-flex justify-content-center mt-3">
                <span className="text-sans-h6-bold-darkblue">
                  Tiempo transcurrido del proceso
                </span>
              </div>

              {/* <div className="d-flex justify-content-between px-4 px-xxl-5 mx-xxl-5 mt-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="text-sans-h6-bold-darkblue">{dias}</span>
                  <span className="text-sans-h6-darkblue">Días</span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span className="text-sans-h6-bold-darkblue">{horas}</span>
                  <span className="text-sans-h6-darkblue">Horas</span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span className="text-sans-h6-bold-darkblue">{minutos}</span>
                  <span className="text-sans-h6-darkblue">Mins</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="col-8">
          <div className="mb-4 ms-4">
            <ul className="list-group list-group-flush my-3">
              {etapasArray.map((etapa, index) =>
              {
                const badgeDetails = getBadgeDetails(etapa.estado);
                return (
                  <li
                    className="list-group-item d-flex justify-content-between "
                    key={etapa.id}
                  >
                    <span>
                      <strong className="pe-2">Etapa {index+1}:</strong>
                      {etapa.nombre}
                    </span>
                    <div className={badgeDetails.class}>
                      {badgeDetails.text}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
