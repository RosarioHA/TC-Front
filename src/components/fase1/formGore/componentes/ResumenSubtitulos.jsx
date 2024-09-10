export const ResumenSubtitulos = ({
  sub22Diferencia,
  sub22Justificados,
  sub22Justificar,
  sub29Diferencia,
  sub29Justificados,
  sub29Justificar,
  sufijo_costos
}) => {
  // Función modificada para formatear los números con separadores de miles
  // y cambiar el color si el número es negativo
  const formatNumber = (number, isDiferenciaPorJustificar = false) => {
    const formattedNumber = new Intl.NumberFormat('es-CL').format(Math.abs(number));
    if (isDiferenciaPorJustificar && number < 0) {
      return <span className="text-sans-p-bold-darkred">{`$ ${formattedNumber}`}</span>;
    }
    return `$ ${formattedNumber}`;
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
              <span >Subtítulo 22 <br />{`${sufijo_costos} `}</span>
            </td>
            <td className="py-3">
              {formatNumber(sub22Diferencia || 0)}
            </td>
            <td className="py-3">
              {formatNumber(sub22Justificados || 0)}
            </td>
            <td className="py-3">
              {formatNumber(sub22Justificar || 0, true)}
            </td>
          </tr>
          <tr className="text-center py-5 table-secondary ">
            <td className="text-start align-middle">
              <span>Subtítulo 29 <br /> {`${sufijo_costos} `}</span>
            </td>
            <td className="py-3">
              {formatNumber(sub29Diferencia || 0)}
            </td>
            <td className="py-3">
              {formatNumber(sub29Justificados || 0)}
            </td>
            <td className="py-3">
              {formatNumber(sub29Justificar || 0, true)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
