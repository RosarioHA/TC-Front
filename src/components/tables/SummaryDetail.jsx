
export const SummaryDetail = ({ competencia }) => {
  const etapas_info = competencia.etapas_info || competencia.resumen_competencia?.etapas_info;
  const tiempo_transcurrido = competencia.tiempo_transcurrido || competencia.resumen_competencia?.tiempo_transcurrido;
  const fecha_fin = competencia.fecha_fin || competencia.resumen_competencia?.fecha_fin;
  const estado = competencia.estado || competencia.resumen_competencia?.estado;
  const ambito_competencia_origen = competencia.ambito_competencia_origen || competencia.resumen_competencia?.ambito_competencia_origen;
  const ambito_definitivo_competencia = competencia.ambito_definitivo_competencia || competencia.resumen_competencia?.ambito_definitivo_competencia;
  const recomendacion_transferencia = competencia.recomendacion_transferencia || competencia.resumen_competencia?.recomendacion_transferencia;


  if (!competencia || !etapas_info) {
    return <div>Cargando...</div>;
  }
  // Transformar etapas_info en un arreglo para facilitar su manejo
  const etapasArray = Object.keys(etapas_info).map(key => ({
    id: key,
    ...etapas_info[key]
  }));

  // Calcula la cantidad de etapas finalizadas
  const etapasFinalizadas = etapasArray.filter(etapa => etapa.estado === 'Finalizada').length;


  const getBadgeDetails = (estado) => {
    const badgeClasses = {
      'Finalizada': 'badge-status-finish',
      'En Estudio': 'badge-status-review',
      'En revisión SUBDERE': 'badge-status-review',
      'Aún no puede comenzar': 'badge-status-pending',
    };

    const classForState = badgeClasses[estado] || '';

    return { class: classForState, text: estado };
  };


  // Calcula el tiempo restante (ajusta los valores según sea necesario)
  const totalEtapas = etapasArray.length;
  const { dias, horas, minutos } = tiempo_transcurrido;


  if (estado === "Finalizada") {
    return (
      <>
        <div className="row">
          <div className="col-4">
            <div className="d-flex flex-row my-3 justify-content-center">
            </div>
            <div>
              <ul className="chart-skills">
                {Array.from({ length: etapasFinalizadas }, (_, index) => (
                  <li key={index}>
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
                    <span className="text-sans-h6-bold-darkblue">Proceso finalizado en:</span>
                  </div>
                </div>
                <div className="row mx-5 px-3 py-2 gap-1">
                  <div className="col d-flex flex-column ms-3">
                    <span className="text-sans-h6-bold-darkblue">{dias}</span>
                    <span className="text-sans-h6-darkblue">Días</span>
                  </div>
                  <div className="col d-flex flex-column">
                    <span className="text-sans-h6-bold-darkblue">{horas}</span>
                    <span className="text-sans-h6-darkblue" >Horas</span>
                  </div>
                  <div className="col d-flex flex-column me-3">
                    <span className="text-sans-h6-bold-darkblue">{minutos}</span>
                    <span className="text-sans-h6-darkblue" >Mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="mb-4 ms-4">
              <ul className="list-group list-group-flush my-3">

                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Proceso de levantamiento</p>
                  </span>
                  <span>
                    <p>{fecha_fin}</p>
                  </span>
                  <div>
                    {estado}
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Ámbito de la competencia</p>
                  </span>
                  <div>
                    {ambito_definitivo_competencia || ambito_competencia_origen}
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Recomendacion de transferencia</p>
                  </span>
                  <div>
                    {recomendacion_transferencia}
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Documento de información levantada</p>
                  </span>
                  <div>
                    Otra cosa
                  </div>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </>

    )
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
                <div className="text-sans-h2-bold-tertiary">{etapasFinalizadas} de {totalEtapas}</div>
                <p>Etapas finalizadas</p>
              </div>
            </ul>
            <div className="container text-center mt-3">
              <div className="row">
                <div className="col">
                  <span className="text-sans-h6-bold-darkblue">Tiempo transcurrido del proceso</span>
                </div>
              </div>
              <div className="row mx-5 px-3 py-2 gap-1">
                <div className="col d-flex flex-column ms-3">
                  <span className="text-sans-h6-bold-darkblue">{dias}</span>
                  <span className="text-sans-h6-darkblue">Días</span>
                </div>
                <div className="col d-flex flex-column">
                  <span className="text-sans-h6-bold-darkblue">{horas}</span>
                  <span className="text-sans-h6-darkblue" >Horas</span>
                </div>
                <div className="col d-flex flex-column me-3">
                  <span className="text-sans-h6-bold-darkblue">{minutos}</span>
                  <span className="text-sans-h6-darkblue" >Mins</span>
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
                  <li className="list-group-item d-flex justify-content-between " key={etapa.id}>
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

  )
}
