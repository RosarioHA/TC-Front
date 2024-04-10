import { useNavigate } from 'react-router-dom';

export const SummaryDetail = ({ competencia }) => {
  const navigate = useNavigate();

  const etapas_info =
    competencia.etapas_info || competencia.resumen_competencia?.etapas_info;
  const tiempo_transcurrido =
    competencia.tiempo_transcurrido ||
    competencia.resumen_competencia?.tiempo_transcurrido;
  const estado = competencia.estado || competencia.resumen_competencia?.estado;
  const ambito_definitivo_competencia =
    competencia.ambito_definitivo_competencia ||
    competencia.resumen_competencia?.ambito_definitivo_competencia;
  // const fecha_fin =
  //   competencia.fecha_fin || competencia.resumen_competencia?.fecha_fin;
  // const ambito_competencia_origen =
  //   competencia.ambito_competencia_origen ||
  //   competencia.resumen_competencia?.ambito_competencia_origen;
  // const recomendacion_transferencia =
  //   competencia.recomendacion_transferencia ||
  //   competencia.resumen_competencia?.recomendacion_transferencia;

  if (!competencia || !etapas_info) {
    return <div>Cargando...</div>;
  }
  // Transformar etapas_info en un arreglo para facilitar su manejo
  const etapasArray = Object.keys(etapas_info).map((key) => ({
    id: key,
    ...etapas_info[key],
  }));

  // Calcula la cantidad de etapas finalizadas
  const etapasFinalizadas = etapasArray.filter(
    (etapa) => etapa.estado === 'Finalizada'
  ).length;
  const totalEtapas = etapasArray.length;

  const getBadgeDetails = (estado) => {
    const badgeClasses = {
      Finalizada: 'badge-status-finish',
      'En Estudio': 'badge-status-review',
      'En revisión SUBDERE': 'badge-status-review',
      'Aún no puede comenzar': 'badge-status-pending',
      Omitida: 'badge-status-pending',
      Finalizado: 'badge-status-green',
      Pendiente: 'badge-status-pending',
    };

    const classForState = badgeClasses[estado] || '';

    return { class: classForState, text: estado };
  };

  const handleVerRevisionSubdere = () => {
    navigate(`/home/revision_subdere/${competencia.id}/paso_1/`);
  };

  // Calcula el tiempo restante (ajusta los valores según sea necesario)
  const { dias, horas, minutos } = tiempo_transcurrido;

  const fechaFin = '2024-04-10T08:41:53.302402-04:00';
  const formattedDate = new Date(fechaFin).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const etapas_finalizada = [
    {
      nombre: 'Proceso de Levantamiento de Información',
      fecha: formattedDate,
      estado: 'Finalizado',
    },
    {
      nombre: 'Ámbito de la competencia',
      ambito: ambito_definitivo_competencia,
    },
    {
      nombre: 'Recomendación de transferencia',
      estado: 'Pendiente',
    },
  ];

  const etapasFinalizadasArray = Object.entries(etapas_finalizada).map(
    ([id, data]) => ({
      id,
      ...data,
    })
  );

  if (estado === 'Finalizada') {
    return (
      <>
        <div className="row">
          <div className="col-4">
            <div className="d-flex flex-row my-3 justify-content-center"></div>
            <div>
              <ul className="chart-skills">
                {Array.from({ length: totalEtapas }, (_, index) => (
                  <li
                    key={index}
                    style={{
                      borderColor:
                        index < etapasFinalizadas ? 'green' : 'green',
                    }}
                  >
                    <span></span>
                  </li>
                ))}
                <div className="chart-text">
                  <div className="text-sans-h2-bold-tertiary">5 de 5</div>
                  <p>Etapas finalizadas</p>
                </div>
              </ul>
              <div className="container text-center mt-3">
                <div className="row">
                  <div className="col">
                    <span className="text-sans-h6-bold-green">
                      Proceso finalizado en:
                    </span>
                  </div>
                </div>
                <div className="row mx-5 px-3 py-2 gap-1">
                  <div className="col d-flex flex-column ms-3">
                    <span className="text-sans-h6-bold-green">{dias}</span>
                    <span className="text-sans-h6-green">Días</span>
                  </div>
                  <div className="col d-flex flex-column">
                    <span className="text-sans-h6-bold-green">{horas}</span>
                    <span className="text-sans-h6-green">Horas</span>
                  </div>
                  <div className="col d-flex flex-column me-3">
                    <span className="text-sans-h6-bold-green">{minutos}</span>
                    <span className="text-sans-h6-green">Mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="mb-4 ms-4">
              <ul className="list-group list-group-flush my-3">
                {etapasFinalizadasArray.map((etapa, index) => {
                  const badgeDetails = getBadgeDetails(etapa.estado);
                  return (
                    <li
                      className="list-group-item d-flex justify-content-between "
                      key={index}
                    >
                      <span>
                        {etapa.nombre}{' '}
                        <span className="mx-5 px-5">{etapa.fecha}</span>
                      </span>
                      <div className={badgeDetails.class}>
                        {badgeDetails.text || etapa.ambito}
                      </div>
                    </li>
                  );
                })}
                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Documento de información levantada</p>
                  </span>
                  <div>
                    {' '}
                    <button
                      className="text-decoration-underline btn-secundario-s"
                      onClick={handleVerRevisionSubdere}
                    >
                      Ver Revisión SUBDERE
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
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
          <div>
            <ul className="chart-skills">
              {Array.from({ length: etapasFinalizadas }, (_, index) => (
                <li key={index}>
                  <span></span>
                </li>
              ))}
              <div className="chart-text">
                <div className="text-sans-h2-bold-tertiary">
                  {etapasFinalizadas} de {totalEtapas}
                </div>
                <p>Etapas finalizadas</p>
              </div>
            </ul>
            <div className="container text-center mt-3">
              <div className="row">
                <div className="col">
                  <span className="text-sans-h6-bold-darkblue">
                    Tiempo transcurrido del proceso
                  </span>
                </div>
              </div>
              <div className="row mx-5 px-3 py-2 gap-1">
                <div className="col d-flex flex-column ms-3">
                  <span className="text-sans-h6-bold-darkblue">{dias}</span>
                  <span className="text-sans-h6-darkblue">Días</span>
                </div>
                <div className="col d-flex flex-column">
                  <span className="text-sans-h6-bold-darkblue">{horas}</span>
                  <span className="text-sans-h6-darkblue">Horas</span>
                </div>
                <div className="col d-flex flex-column me-3">
                  <span className="text-sans-h6-bold-darkblue">{minutos}</span>
                  <span className="text-sans-h6-darkblue">Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="mb-4 ms-4">
            <ul className="list-group list-group-flush my-3">
              {etapasArray.map((etapa) => {
                const badgeDetails = getBadgeDetails(etapa.estado);
                return (
                  <li
                    className="list-group-item d-flex justify-content-between "
                    key={etapa.id}
                  >
                    <span>
                      <strong className="pe-2">{etapa.id}:</strong>
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
