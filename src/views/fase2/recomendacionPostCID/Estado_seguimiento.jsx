import { useState, useEffect } from 'react';
import { VerticalStepper } from '../../../components/stepers/VerticalStepper';
import { useParams } from 'react-router-dom';
import { useCompetencia } from '../../../hooks/competencias/useCompetencias';

const EstadoSeguimiento = () => {
  const [isEstadoCompetenciaOpen, setIsEstadoCompetenciaOpen] = useState(false);
  const { id } = useParams();
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const [ competencia, setCompetencia ] = useState(null);

  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  // Función para alternar el estado
  const toggleEstadoCompetencia = () => {
    setIsEstadoCompetenciaOpen(!isEstadoCompetenciaOpen);
  };

  if (loading && competencia) {
    return <div className="d-flex align-items-center flex-column ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando detalles de la competencia...</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  } if (error) {
    return <div>Error al cargar los detalles: {error.message}</div>;
  }

  return (
    <div>
      <h2>Estado de Seguimiento</h2>

      {/* Desplegable EstadoCompetencia */}
      <div>
        <button onClick={toggleEstadoCompetencia}>
          {isEstadoCompetenciaOpen ? 'Cerrar Estado Competencia' : 'Abrir Estado Competencia'}
        </button>
        {isEstadoCompetenciaOpen && (
          <div className="estado-competencia-content">
            <div className="mt-5 mx-0">
              <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
              <VerticalStepper etapasObjeto={competencia?.resumen_competencia} etapaDatos={competencia} id={id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoSeguimiento;