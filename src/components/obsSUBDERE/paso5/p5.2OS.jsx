import { GastosAnuales } from "../../tables/GastoAnual";
import { GastosAsociados } from "../../tables/GastosAsociados"

export const Subpaso_CincoDosOS = ({ data }) => {
  const { p_5_2_evolucion_gasto_asociado, p_5_2_variacion_promedio } = data;

  return (
    <div className="mt-4 me-5 pe-5 ">
      <span className="my-4 text-sans-h4">5.2 Evolución del gasto asociado al ejercicio de la competencia</span>
      <div className="container-fluid me-5 pe-5 text-sans-h6-primary">
        <h6>
          Para conocer la evolución del gasto asociado al ejercicio de la competencia, en este cuadro se deben incorporar los montos anuales
          desagregados por subtitulo para cada año señalado, donde n-1
          corresponde al año anterior a aquel donde se solicita la competencia, incluyendo glosas asociadas.
          <p className="my-3">
            Si un año no tiene información de gastos, debe llenar con un 0.
          </p>
        </h6>
      </div>
      <GastosAsociados 
      dataGastos={p_5_2_evolucion_gasto_asociado} 
      readOnly={true}/>
      <GastosAnuales 
      dataGastos={p_5_2_variacion_promedio} 
      readOnly={true}/>
    </div>
  )
}
