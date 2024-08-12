export const ResumenDirectos = ({ resumen }) => {
  return (
    <>
      <div className="mt-4 col-11">
        <span className="my-4 text-sans-h4">Resumen costos directos</span>
        <div className="text-sans-h6-primary my-3 ">
          <h6>
            Las diferencias que tengas en los subtítulos 21 (Gastos en personal), 22 (Bienes y servicios de consumo) y 29 (Adquisición de activos no financieros) deberás justificarlas en el paso 3 (Estimación de personal y de administración).
          </h6>
        </div>
        <div>
          <table className="table table-secondary my-4">
            <thead>
              <tr>
                <th scope="col"><span>Costos Directos <br/> Totales Anual ($M)</span></th>
                <th scope="col"><span>Informados por<br/> el/los sectores</span></th>
                <th scope="col ps-4 py-2">Informados por <br/>GORE</th>
                <th scope="col ps-4 py-2 ">Diferencia con <br/>el sector</th>
              </tr>
            </thead>
            <tbody>
              {resumen?.map((item) => (
                <tr className="table-light text-center py-5 " key={item.id}>
                  <td></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">$ {Number(item.directos_por_sector).toLocaleString('es-CL')}</span></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">$ {Number(item.directos_por_gore).toLocaleString('es-CL')}</span></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">$ {Number(item.diferencia_directos).toLocaleString('es-CL')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
