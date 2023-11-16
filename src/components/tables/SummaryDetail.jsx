
export const SummaryDetail = ({ competencia }) =>
{


  if (!competencia)
  {
    return <div>Cargando...</div>;
  }

  // Calcula la cantidad de etapas finalizadas
  const etapasFinalizadas = competencia.etapas.filter((etapa) => etapa.estado === 'Finalizado').length;


  const getBadgeDetails = (estado) =>
  {
    const badgeDetails = {
      'Finalizado': { class: 'badge-status-finish', text: 'Finalizada' },
      'En Estudio': { class: 'badge-status-review', text: 'En Estudio' },
      'Pendiente': { class: 'badge-status-pending', text: 'Aún no puede comenzar' },
    };
    return badgeDetails[ estado ] || { class: '', text: '' };
  };


  // Calcula el tiempo restante (ajusta los valores según sea necesario)
  const diasRestantes = 5 - etapasFinalizadas;
  const horasRestantes = 24;
  const minutosRestantes = 60;
  const totalEtapas = competencia.etapas.length;


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
                <div className="text-sans-h2-bold-tertiary">{etapasFinalizadas} de {totalEtapas}</div>
                <p>Etapas finalizadas</p>
              </div>
            </ul>
            <div className="container text-center mt-3">
              <div className="row">
                <div className="col">
                  <span className="text-sans-h6-bold-darkblue">Tiempo para completar el proceso</span>
                </div>
              </div>
              <div className="row mx-5 px-3 py-2 gap-1">
                <div className="col d-flex flex-column ms-3">
                  <span className="text-sans-h6-bold-darkblue">{diasRestantes}</span>
                  <span className="text-sans-h6-darkblue">Días</span>
                </div>
                <div className="col d-flex flex-column">
                  <span className="text-sans-h6-bold-darkblue">{horasRestantes}</span>
                  <span className="text-sans-h6-darkblue" >Horas</span>
                </div>
                <div className="col d-flex flex-column me-3">
                  <span className="text-sans-h6-bold-darkblue">{minutosRestantes}</span>
                  <span className="text-sans-h6-darkblue" >Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="mb-4 ms-4">
            <ul className="list-group list-group-flush my-3">
              {competencia.etapas.map((etapa) =>
              {
                const { class: badgeClass, text: etapaTexto } = getBadgeDetails(etapa.estado);

                return (
                  <li className="list-group-item d-flex justify-content-between" key={etapa.id}>
                    <span>
                      <strong className="pe-2">Etapa {etapa.id}:</strong>
                      {etapa.etapa}
                    </span>
                    <div className={badgeClass}>
                      {etapaTexto}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>

  )
}
