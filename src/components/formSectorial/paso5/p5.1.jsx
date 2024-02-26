import CostosDirectos from "../../tables/CostosDirectos";
import { useState, useEffect } from "react";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import CostosIndirectos from "../../tables/CostosIndirectos";
import ResumenCostos from "../../tables/ResumenCostos";

export const Subpaso_CincoPuntoUno = (
  {
    id,
    paso5,
    solo_lectura,
    stepNumber,
    data_costos_directos,
    data_costos_indirectos,
    data_resumen_costos,
    listado_subtitulos,
    listado_item_subtitulos,
    listado_etapas,
    setRefreshSubpaso_CincoDos, 
  }
) => {

  const [refreshSumatoriaCostos, setRefreshSumatoriaCostos] = useState(false);
  const [dataDirecta, setDataDirecta] = useState(null);
  const [totalCostosDirectos, setTotalCostosDirectos] = useState('');
  const [totalCostosIndirectos, setTotalCostosIndirectos] = useState('');
  const [costosTotales, setCostosTotales] = useState('');
  const [descripcionCostosTotales, setDescripcionCostosTotales] = useState('');

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    // Asegurarse de que el valor es un número. Convertir si es necesario.
    const valorNumerico = Number(numero);
    // Verificar si el valor es un número válido antes de intentar formatearlo
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    // Devolver un valor predeterminado o el mismo valor si no es un número
    return numero;
  };

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

  // refreshSumatoriaCostos es un trigger disparado desde CostosDirectos o CostosIndirectos
  useEffect(() => {
    if (refreshSumatoriaCostos) {
      fetchDataDirecta();
      setRefreshSumatoriaCostos(false);
    }
  }, [refreshSumatoriaCostos, id, stepNumber]);

  useEffect(() => {
    if (dataDirecta && dataDirecta.paso5) {
      setTotalCostosDirectos(dataDirecta.paso5.total_costos_directos || '0');
      setTotalCostosIndirectos(dataDirecta.paso5.total_costos_indirectos || '0');
      setCostosTotales(dataDirecta.paso5.costos_totales || '0');
      setDescripcionCostosTotales(dataDirecta.paso5.descripcion_costos_totales || '0');
    } else {
      setTotalCostosDirectos(paso5.total_costos_directos || '0');
      setTotalCostosIndirectos(paso5.total_costos_indirectos || '0');
      setCostosTotales(paso5.costos_totales || '0');
      setDescripcionCostosTotales(paso5.descripcion_costos_totales || '0');
    }
  }, [dataDirecta]);
  

  return (
    <div className="mt-4 me-5 pe-5">
      <h4 className="text-sans-h4">5.1 Costos asociados al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">Para realizar un correcto costeo de la competencia, se toman como bases las etapas descritas y diagramadas en el paso 2. A partir de estas etapas, se deben completar las siguientes tablas de costos por subtitulo.</h6>

      <p className="text-sans-m-semibold mt-4">a. Costos directos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3 mb-4">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      <div >
        <CostosDirectos
          id={id}
          data={data_costos_directos}
          stepNumber={stepNumber}
          listado_subtitulos={listado_subtitulos}
          listado_item_subtitulos={listado_item_subtitulos}
          listado_etapas={listado_etapas}
          setRefreshSubpaso_CincoDos={setRefreshSubpaso_CincoDos}
          setRefreshSumatoriaCostos={setRefreshSumatoriaCostos}
          solo_lectura={solo_lectura}
        />
        <hr />
      </div>

      <div className="row mt-5 d-flex align-items-center">
        <p className="text-sans-p-bold mb-0 col-2">Costos Directos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">{formatearNumero(totalCostosDirectos)}</p>
      </div>
      <hr className="col-4"/>

      <p className="text-sans-m-semibold mt-5">b. Costos indirectos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      <div className="mt-4">
      <CostosIndirectos
          id={id}
          data={data_costos_indirectos}
          stepNumber={stepNumber}
          listado_subtitulos={listado_subtitulos}
          listado_item_subtitulos={listado_item_subtitulos}
          listado_etapas={listado_etapas}
          setRefreshSubpaso_CincoDos={setRefreshSubpaso_CincoDos}
          setRefreshSumatoriaCostos={setRefreshSumatoriaCostos}
          solo_lectura={solo_lectura}
        />
        <hr />
      </div>

      <div className="row mt-5 d-flex align-items-center">
        <p className="text-sans-p-bold mb-0 col-2">Costos Directos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">{formatearNumero(totalCostosIndirectos)}</p>
      </div>
      <hr className="col-4" />

      <p className="text-sans-m-semibold mt-4">c. Sumatoria de costos anuales destinados al ejercicio de la competencia</p>

      <div>
        <ResumenCostos
          id={id}
          data={data_resumen_costos}
          costosTotales={costosTotales}
          descripcionCostosTotales={descripcionCostosTotales}
          stepNumber={stepNumber}
          solo_lectura={solo_lectura}          
          setRefreshSumatoriaCostos={setRefreshSumatoriaCostos}
          refreshSumatoriaCostos={refreshSumatoriaCostos}
        />
      </div>

    </div>
  )
};
