import { Sub1_a } from "./Sub1_a"
import { Sub1_b } from "./Sub1_b"

export const Sub_1 = ({data}) =>
{
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
        3.1 Estamento, tipo de contrato y cantidad de personal para el Gobierno Regional solicitante
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
          El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.
          </h6>
        </div>
        <div className="my-4 ">
        <Sub1_a data={data}/>
        <Sub1_b data={data}/>
        </div>
      </div>
    </>
  )
}
