import { GastosPromedioAnual } from "../../tables/GastoPromedioAnual";
import { GastosEvolucionVariacion } from "../../tables/GastosEvolucionVariacion";
import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";

export const Subpaso_CincoDos = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  p_5_2_evolucion_gasto_asociado,
  p_5_2_variacion_promedio,
  refreshSubpaso_CincoDos,
  setRefreshSubpaso_CincoDos,
  refetchTrigger
}) => {

  const [dataDirecta, setDataDirecta] = useState(null);
  const [actualizarVariacion, setActualizarVariacion] = useState(null);
  const [evolucionGastoAsociado, setEvolucionGastoAsociado] = useState('');
  const [variacionPromedio, setVariacionPromedio] = useState('');
  const [refreshSubpaso_CincoDosVariacion, setRefreshSubpaso_CincoDosVariacion] = useState(false);

  // Lógica para recargar sumatoria al agregar costos directos o indirectos
  // Llamada para recargar componente
  const fetchDataDirecta = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  // refreshSubpaso_CincoDos es un trigger disparado desde CostosDirectos o CostosIndirectos en paso 5.1
  useEffect(() => {
    if (refreshSubpaso_CincoDos) {
      fetchDataDirecta();
      setRefreshSubpaso_CincoDos(false);
      setRefreshSubpaso_CincoDosVariacion(false);
    }
  }, [refreshSubpaso_CincoDos]);

  // Actualizar variables
  useEffect(() => {
    if (dataDirecta && dataDirecta.paso5) {
      setEvolucionGastoAsociado(dataDirecta.p_5_2_evolucion_gasto_asociado || '0');
      setVariacionPromedio(dataDirecta.p_5_2_variacion_promedio || '0');
    } else {
      setEvolucionGastoAsociado(p_5_2_evolucion_gasto_asociado || '0');
      setVariacionPromedio(p_5_2_variacion_promedio || '0');
    }
  }, [dataDirecta]);

  // Refrescar solo paso 5.2 Variacion Promedio Anual
  const fetchDataVariacion = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setActualizarVariacion(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  useEffect(() => {
    if (refreshSubpaso_CincoDosVariacion) {
      fetchDataVariacion();
      setRefreshSubpaso_CincoDosVariacion(false);
    }
  }, [refreshSubpaso_CincoDosVariacion]);

  useEffect(() => {
    if (actualizarVariacion && actualizarVariacion.paso5) {
      setVariacionPromedio(actualizarVariacion.p_5_2_variacion_promedio || '0');
    } else {
      setVariacionPromedio(p_5_2_variacion_promedio || '0');
    }
  }, [actualizarVariacion]);


  return (
    <div className="mt-4 me-5 pe-5 ">
      <span className="my-4 text-sans-h4">5.2 Evolución del gasto asociado al ejercicio de la competencia</span>
      <div className="container-fluid me-5 px-0">
        <h6 className="text-sans-h6-primary mt-3">
          Para conocer la evolución del gasto asociado al ejercicio de la competencia, en este cuadro se deben incorporar los montos anuales
          desagregados por subtitulo para cada año señalado, donde n-1
          corresponde al año anterior a aquel donde se solicita la competencia, incluyendo glosas asociadas.
          <p className="my-3">
            Si un año no tiene información de gastos, debe llenar con un 0.
          </p>
        </h6>
      </div>
      <GastosEvolucionVariacion
        id={id}
        paso5={paso5}
        solo_lectura={solo_lectura}
        stepNumber={stepNumber}
        dataGastos={evolucionGastoAsociado}
        setRefreshSubpaso_CincoDosVariacion={setRefreshSubpaso_CincoDosVariacion}
        refetchTrigger={refetchTrigger}
      />
      <GastosPromedioAnual
        id={id}
        paso5={paso5}
        solo_lectura={solo_lectura}
        stepNumber={stepNumber}
        dataGastos={variacionPromedio}
        refetchTrigger={refetchTrigger}
      />
    </div>
  )
}
