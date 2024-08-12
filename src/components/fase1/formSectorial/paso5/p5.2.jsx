import { GastosPromedioAnual} from '../../tables/GastoPromedioAnual';
import { GastosEvolucionVariacion } from "../../tables/GastosEvolucionVariacion";

export const Subpaso_CincoDos = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  p_5_2_evolucion_gasto_asociado,
  p_5_2_variacion_promedio,
  años,
  años_variacion,
  region
}) => {

  if (!p_5_2_evolucion_gasto_asociado || !p_5_2_variacion_promedio) {
    return <div>No hay datos para mostrar.</div>;
  }

  return (
    <div className="mt-4">
      <span className="my-4 text-sans-h4">5.2 Evolución del gasto asociado al ejercicio de la competencia</span>
      <div className="container me-5 px-0">
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
        dataGastos={p_5_2_evolucion_gasto_asociado}
        años={años}
        region={region}
      />
      <GastosPromedioAnual
        id={id}
        paso5={paso5}
        solo_lectura={solo_lectura}
        stepNumber={stepNumber}
        dataGastos={p_5_2_variacion_promedio}
        años={años_variacion}
        region={region}
      />
    </div>
  );
};
