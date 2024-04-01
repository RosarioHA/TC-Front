export const ResumenSubtitulos = ({
  sub22Diferencia,
  sub22Justificados,
  sub22Justificar,
  sub29Diferencia,
  sub29Justificados,
  sub29Justificar,
}) => {
  // Función para formatear los números con separadores de miles
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(Math.abs(number));
  };

  // Función para determinar el estilo del número basado en si es positivo o negativo
  const numberStyle = (number) => {
    return number < 0 ? "text-sans-p-bold-darkred pe-5" : "text-sans-p-bold-blue pe-5";
  };

  return (
    <>
      <table className="table my-4">
        <thead>
          <tr className="table-secondary">
            <th scope="col align-items-center">
              <span className="py-2">
                Costos Totales Anual <br /> ($M) por subtítulo
              </span>
            </th>
            <th scope="col">
              <span className="py-2">
                Diferencias con <br /> el sector
              </span>
            </th>
            <th scope="col ps-4 py-2">
              Justificados por <br /> GORE
            </th>
            <th scope="col ps-4 py-2 ">
              Diferencia por <br />
              justificar
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center py-5 ">
            <td className="text-start align-middle">
              <span className="mx-3">Subtítulo 22</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub22Diferencia)}>{formatNumber(sub22Diferencia || 0)}</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub22Justificados)}>{formatNumber(sub22Justificados || 0)}</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub22Justificar)}>{formatNumber(sub22Justificar || 0)}</span>
            </td>
          </tr>
          <tr className="text-center py-5 table-secondary ">
            <td className="text-start align-middle">
              <span className="mx-3">Subtítulo 29</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub29Diferencia)}>{formatNumber(sub29Diferencia || 0)}</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub29Justificados)}>{formatNumber(sub29Justificados || 0)}</span>
            </td>
            <td className="py-3">
              <span className={numberStyle(sub29Justificar)}>{formatNumber(sub29Justificar || 0)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
