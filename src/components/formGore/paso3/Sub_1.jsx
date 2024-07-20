import { Sub1_a } from "./Sub1_a"
import { Sub1_b } from "./Sub1_b"

export const Sub_1 = ({ data, solo_lectura }) => {

  console.log(data.paso3_gore)

  return (
    <>
      <div className="pe-xxl-5 me-xxl-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          3.1 Estamento, tipo de contrato y cantidad de personal para el Gobierno Regional solicitante
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.
          </h6>
        </div>
        <div className="my-4 ">
          <Sub1_a data={data} solo_lectura={solo_lectura} />
          <Sub1_b data={data} solo_lectura={solo_lectura} />
        </div>
        <div className="my-4 col-11 pe-5">
          <div className="ps-3 my-4">
            <table className="table table-secondary my-4">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="py-2">
                      Costos Totales Anual <br />  Subtítulo 21 ($M)
                    </span>
                  </th>
                  <th scope="col">
                    <span className="py-2">
                      Informados
                      <br /> por GORE
                    </span>
                  </th>
                  <th scope="col ps-4 py-2">
                    Justificados<br /> por GORE
                  </th>
                  <th scope="col ps-4 py-2 ">
                    Diferencia <br />
                    por justificar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
