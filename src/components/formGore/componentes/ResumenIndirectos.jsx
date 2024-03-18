export const ResumenIndirectos = ({ resumen }) => {
  return (
    <>
      <div className="pe-5 me-5 mt-4 ">
        <span className="my-4 text-sans-h4">Resumen costos indirectos</span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
          Las diferencias que tengas en los subtítulos 21 (Gastos en personal), 22 (Bienes y servicios de consumo) y 29 (Adquisición de activos no financieros) deberás justificarlas en el paso 3 (Estimación de personal y de administración).
          </h6>
        </div>
        <div>
          <table className="table table-secondary my-4">
            <thead>
              <tr>
                <th scope="col"><span className="py-2">Costos Indirectos <br/> Totales Anual ($M)</span></th>
                <th scope="col"><span className="py-2">Informados por<br/> el/los sectores</span></th>
                <th scope="col ps-4 py-2">Informados por <br/>GORE</th>
                <th scope="col ps-4 py-2 ">Diferencia con <br/>el sector</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(resumen) && resumen.map((item) => (
                <tr className="table-light text-center py-5 " key={item.id}>
                  <td></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">{item.indirectos_por_sector}</span></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">{item.indirectos_por_gore}</span></td>
                  <td className="py-3"><span className="text-sans-p-bold-blue pe-5">{item.diferencia_indirectos}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
