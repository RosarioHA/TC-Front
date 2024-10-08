export const ResumenSubtitulosSistemasInformaticos = ({
  nombreSubtitulo,
  subDiferencia,
  subJustificados,
  subJustificar
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
    <div className="my-4 col-12 pe-5">
    <div className="ps-3 my-4">
      <table className="table table-secondary my-4">
        <thead>
          <tr>
            <th scope="col">
              <span className="py-2">
                Costo Total Anual <br /> {`${nombreSubtitulo} `}($M)
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
          <tr>
            <td>
            Ítem 07 - Programas <br /> Informáticos
            </td>
            <td>
              {formatNumber(subDiferencia || 0)}
            </td>
            <td>
              {formatNumber(subJustificados || 0)}
            </td>
            <td>
              {formatNumber(subJustificar || 0, true)}
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </>
  );
};
