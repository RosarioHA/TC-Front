import { useNavigate } from 'react-router-dom';
import { useResumenFinal } from '../../hooks/revisionFinalSubdere/useResumenFinal';
import { useDescargarDocumento } from '../../hooks/competencias/useDownloadPDFFinal';

export const SummaryDetail = ({ competencia }) => {
  const navigate = useNavigate();
  const { resumen } = useResumenFinal(competencia.id);
  const { descargarDocumento, disponible } = useDescargarDocumento(competencia.id);
  const etapas_info =
    competencia.etapas_info || competencia?.resumen_competencia?.etapas_info;
  const tiempo_transcurrido =
    competencia.tiempo_transcurrido ||
    competencia.resumen_competencia?.tiempo_transcurrido;
  const estado = competencia.estado || competencia?.resumen_competencia?.estado;
  const ambito_definitivo_competencia =
    competencia.ambito_definitivo_competencia ||
    competencia.resumen_competencia?.ambito_definitivo_competencia;
  const fechaFin =
    competencia.fecha_fin || competencia.resumen_competencia?.fecha_fin;
  const ambito_competencia_origen =
    competencia.ambito_competencia_origen ||
    competencia.resumen_competencia?.ambito_competencia_origen;
  const recomendacion_transferencia =
    competencia.recomendacion_transferencia ||
    competencia.resumen_competencia?.recomendacion_transferencia;

  if (!competencia || !etapas_info) {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando...</div>;
  }
  // Transformar etapas_info en un arreglo para facilitar su manejo
  const etapasArray = Object.keys(etapas_info).map((key) => ({
    id: key,
    ...etapas_info[key],
  }));

  const handleDownloadClick = () => {
    descargarDocumento();
  };

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

    const classForState = badgeClasses[estado] || '';
    return { class: classForState, text: estado };
  };

  const handleVerRevisionSubdere = () => {
    navigate(`/home/revision_subdere/${competencia.id}/paso_1/`);
  };

  // Calcula el tiempo restante (ajusta los valores según sea necesario)
  const { dias, horas, minutos } = tiempo_transcurrido;

  const formattedDate = new Date(fechaFin).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const etapa_levantamiento = {
    nombre: 'Proceso de Levantamiento de Información',
    fecha: formattedDate,
    estado: 'Finalizado',
  }
  const ambito_definitivo = {
    nombre: 'Ámbito de la competencia',
    estado: ambito_definitivo_competencia || ambito_competencia_origen,
  }
  const recomendacion = {
    nombre: 'Recomendación de transferencia',
    estado: recomendacion_transferencia,
  }


  if (estado === 'Finalizada') {
    return (
      <div className="py-2">
        <div className="row pt-3">
          <div className="col-4">
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
                  <div className="chart-numbers">5 de 5</div>
                  <p>Etapas finalizadas</p>
                </div>
              </ul>

              <div>
                <div className="d-flex justify-content-center mt-3">
                  <span className="text-sans-h6-bold-darkblue">
                    Proceso finalizado en:
                  </span>
                </div>

                <div className="d-flex justify-content-between px-4 px-xxl-5 mx-xxl-5 mt-3">
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
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="mb-4 ms-4">
              <ul className="list-group list-group-flush my-3">
                <li
                  className="list-group-item d-flex justify-content-between "                    >
                  <span>
                    {etapa_levantamiento?.nombre}
                    <span className="mx-5 px-5">{etapa_levantamiento?.fecha}</span>
                  </span>
                  <div className="my-auto">
                    <span className={getBadgeDetails(etapa_levantamiento?.estado).class}>
                      {getBadgeDetails(etapa_levantamiento?.estado).text}
                    </span>
                  </div>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between "                    >
                  <span>
                    {ambito_definitivo.nombre}
                  </span>
                  <div>
                    <span className={getBadgeDetails(ambito_definitivo?.estado).class}>
                      {getBadgeDetails(ambito_definitivo?.estado).text}
                    </span>
                  </div>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between "                    >
                  <span>
                    {recomendacion.nombre}
                    <span className="mx-5 px-5"></span>
                  </span>
                  <div>
                    <span className={getBadgeDetails(recomendacion?.estado).class}>
                      {getBadgeDetails(recomendacion?.estado).text}
                    </span>
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between ">
                  <span>
                    <p>Documento de información levantada</p>
                  </span>
                  <div>
                    {resumen && (
                      <>
                        {resumen.formulario_final_enviado ? (
                          <div>
                            {disponible ? (
                              <button className="btn-secundario-s" onClick={handleDownloadClick}>
                                <i className="material-symbols-rounded ms-2">download</i>
                                <u>Descargar</u>
                              </button>
                            ) : (
                              <span className="badge-status-pending">Pendiente</span>
                            )}
                          </div>
                        ) : (
                          <button
                            className="text-decoration-underline btn-secundario-s"
                            onClick={handleVerRevisionSubdere}
                          >
                            <u>Ver Revisión SUBDERE</u>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
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

              <div className="d-flex justify-content-between px-4 px-xxl-5 mx-xxl-5 mt-3">
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
