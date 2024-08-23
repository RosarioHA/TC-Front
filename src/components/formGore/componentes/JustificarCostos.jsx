export const JustificarCostos = ({ recursos }) => {
  // Función para formatear los números con separadores de miles
  const formatNumber = (number) => {
    // Verificar si el número es 0 para manejar el caso "No informado"
    if (number === 0) return "No informado";
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col-3">Subtitulo</th>
            <th scope="col-3"><span className="mx-5">Item</span></th>
            <th scope="col-4"><span className="mx-5">Sector</span></th>
            <th scope="col-4">Costo informado por el sector ($M)</th>
            <th scope="col-4">Costo informado por GORE ($M)</th>
            <th scope="col-4"><span className="text-center ms-5">Diferencia</span></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(recursos) && recursos.map((recurso) => (
            <tr key={recurso.id}>
              <th>{recurso.subtitulo_label_value.label}</th>
              <td className="col-2">
                <span className="text-sans-p-grayc">
                  {recurso.item_subtitulo_label_value.label}
                </span>
              </td>
              <td className="col-2 text-center">
                {recurso.sector_nombre || "-"}
              </td>
              <td className="text-center col-2">
                <div className=" py-1">
                  {formatNumber(recurso.costo_sector)}
                </div>
              </td>
              <td className="col-2 text-center">
                <div className="">
                  {formatNumber(recurso.costo_gore)}
                </div>
              </td>
              <td>
                <div className="text-sans-p-bold-darkred mx-3 text-center">
                  {formatNumber(recurso.diferencia_monto)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
