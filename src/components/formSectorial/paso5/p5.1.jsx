import Costos from "../../tables/Costos";
import ResumenCostos from "../../tables/ResumenCostos";

export const Subpaso_CincoPuntoUno = ({
  id,
  paso5,
  region,
  solo_lectura,
  stepNumber,
  data_costos_directos,
  data_costos_indirectos,
  data_resumen_costos,
  listado_subtitulos_directos,
  listado_subtitulos_indirectos,
  listado_item_subtitulos_directos,
  listado_item_subtitulos_indirectos,
  listado_etapas,
}) => {
  // Verificar que paso5 no sea null o undefined y proporcionar valores por defecto
  const paso5Data = Array.isArray(paso5) && paso5.length > 0 ? paso5[0] : {};

  const {
    id: paso5Id,
    total_costos_directos = 0,
    total_costos_indirectos = 0,
    costos_totales = 0,
    descripcion_costos_totales = "",
  } = paso5Data;

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    const valorNumerico = Number(numero);
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return numero;
  };

  return (
    <div className="mt-4">
      <h4 className="text-sans-h4">5.1 Costos asociados al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">
        Para realizar un correcto costeo de la competencia, se toman como bases las etapas descritas y diagramadas en el paso 2. A partir de estas etapas, se deben completar las siguientes tablas de costos por subtitulo.
      </h6>

      <p className="text-sans-m-semibold mt-4">a. Costos directos</p>
      <h6 className="text-sans-h6-primary mt-3">
        Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.
      </h6>
      <h6 className="text-sans-h6-primary mt-3 mb-4">
        Llenar información para al menos un subtítulo/item es obligatorio.
      </h6>

      <div>
        <Costos
          id={id}
          region={region}
          data={data_costos_directos}
          stepNumber={stepNumber}
          listado_subtitulos={listado_subtitulos_directos}
          listado_item_subtitulos={listado_item_subtitulos_directos}
          listado_etapas={listado_etapas}
          solo_lectura={solo_lectura}
          seccion="p_5_1_a_costos_directos"
        />
        <hr />
      </div>

      <div className="row mt-5 d-flex align-items-center">
        <p className="text-sans-p-bold mb-0 col-2">Costos Directos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">{formatearNumero(total_costos_directos)}</p>
      </div>
      <hr className="col-4"/>

      <p className="text-sans-m-semibold mt-5">b. Costos indirectos</p>
      <h6 className="text-sans-h6-primary mt-3">
        Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.
      </h6>
      <h6 className="text-sans-h6-primary mt-3">
        Llenar información para al menos un subtítulo/item es obligatorio.
      </h6>

      <div className="mt-4">
        <Costos
          id={id}
          region={region}
          data={data_costos_indirectos}
          stepNumber={stepNumber}
          listado_subtitulos={listado_subtitulos_indirectos}
          listado_item_subtitulos={listado_item_subtitulos_indirectos}
          listado_etapas={listado_etapas}
          solo_lectura={solo_lectura}
          seccion="p_5_1_b_costos_indirectos"
        />
        <hr />
      </div>

      <div className="row mt-5 d-flex align-items-center">
        <p className="text-sans-p-bold mb-0 col-2">Costos Indirectos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">{formatearNumero(total_costos_indirectos)}</p>
      </div>
      <hr className="col-4" />

      <p className="text-sans-m-semibold mt-4">c. Sumatoria de costos anuales destinados al ejercicio de la competencia</p>

      <div>
        <ResumenCostos
          id={id}
          paso5Id={paso5Id}
          region={region}
          data={data_resumen_costos}
          costosTotales={costos_totales}
          descripcionCostosTotales={descripcion_costos_totales}
          stepNumber={stepNumber}
          solo_lectura={solo_lectura}
        />
      </div>
    </div>
  );
};
