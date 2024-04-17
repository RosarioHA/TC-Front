export const ResumenDiferencial = ({ informada, justificados, justificar }) => {
  // Función para formatear los números con separadores de miles
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(number);
  };

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-11">
        <div className="subrayado col-12">
          <div className="align-self-center text-sans-h4">
            <p>Resumen de diferencial de costos con la información entregada por el sector</p>
          </div>
        </div>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            Solo podrás continuar cuando tengas 0 costos por justificar. Es decir, hayas justificado todas las diferencias presupuestarias con el sector.
          </h6>
        </div>
        <div>
          <table className="table table-secondary my-4">
            <thead>
              <tr>
                <th scope="col align-items-center">
                  <span className="py-2">
                    Costos Totales <br />
                    Anual ($M)
                  </span>
                </th>
                <th scope="col ps-4 py-2">
                  Informada por GORE
                </th>
                <th scope="col ps-4 py-2 ">
                  Justificadas por GORE
                </th>
                <th scope="col ps-4 py-2 ">
                  Costos por justificar
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-light text-center py-5 " key="">
                <td className="text-start">Costos informados <br/> total</td>
                <td className="py-3">
                  <span className="text-sans-p-bold-blue pe-5">$ {formatNumber(informada || 0)}</span>
                </td>
                <td className="py-3">
                  <span className="text-sans-p-bold-blue pe-5">$ {formatNumber(justificados || 0)}</span>
                </td>
                <td className="py-3">
                  <span className="text-sans-p-bold-blue pe-5">$ {formatNumber(justificar || 0)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
