import { Counter } from "../tables/Counter";
export const Timmer = () =>
{

  const plazoDias = 15;
  const tiempoTranscurrido = { dias: 5, horas: 0, minutos: 21 }
  const fecha_ultima_modificacion = "30/11/2023 - 12:06";

  return (
    <>
      <div className=" mt-4 border-bottom">
        <div className="w-75 mx-auto mb-5">
          <Counter plazoDias={plazoDias} tiempoTranscurrido={tiempoTranscurrido} />
          <div className="text-sans-p">Fecha última modificación: {fecha_ultima_modificacion}</div>
        </div>
      </div>
    </>
  )
}
