export const ResumenTotal = ({ resumen }) => {
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-11">
        <div className="subrayado col-12">
          <div className="align-self-center text-sans-h4 ps-2">
            Resumen de costos totales (directos + indirectos)
          </div>
        </div>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            La tabla muestra, la suma de costos directos e indirectos, tanto informados por el sector, como los informados por GORE. Las diferencias que tengas en los subtítulos 21 (Gastos en personal), 22 (Bienes y servicios de consumo) y 29 (Adquisición de activos no financieros) deberás justificarlas en el paso 3 (Estimación de personal y de administración).
          </h6>
        </div>
        <div>
          <table className="table table-secondary my-4">
            <thead>
            <tr>
                <th scope="col align-items-center">
                  <span className="py-2">
                  Costos Totales  <br/>Anual ($M)
                  </span>
                </th>
                <th scope="col">
                  <span className="py-2">
                  Total de costos <br/> Informados <br/> por el/los sectores
                  </span>
                </th>
                <th scope="col ps-4 py-2">
                Total de costos <br/> Informados por <br/> GORE
                </th>
                <th scope="col ps-4 py-2 ">
                  Diferencia con <br />
                  el sector
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(resumen) && resumen.map((item) => (
                <tr className="table-light text-center py-5" key={item.id}>
                  <td></td>
                  <td className="py-3">
                    <span className="text-sans-p-bold-blue pe-5">
                      $ {Number(item.costos_sector).toLocaleString('es-CL')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sans-p-bold-blue pe-5">
                    $ {Number(item.costos_gore).toLocaleString('es-CL')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sans-p-bold-blue pe-5">
                      $ {Number(item.diferencia_costos).toLocaleString('es-CL')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
