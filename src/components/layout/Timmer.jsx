import { Counter } from "../tables/Counter";
export const Timmer = ({data, error }) =>
{

  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>;

  const plazoDias = data.plazo_dias;
  const tiempoTranscurrido = data.calcular_tiempo_transcurrido;

  return (
    <>
      <div className=" mt-4">
        <div className="w-75 mx-auto mb-5">
          <Counter plazoDias={plazoDias} tiempoTranscurrido={tiempoTranscurrido} />
          <div className="text-sans-p">Fecha última modificación: {data.fecha_ultima_modificacion}</div>
        </div>
      </div>
    </>
  )
}
