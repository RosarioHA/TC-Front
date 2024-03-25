export const JustificarCostos = ({ recursos }) =>
{
  console.log(recursos);
  return (
    <>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col-3">Subtitulo</th>
            <th scope="col-3"><span className="mx-5">Item</span></th>
            <th scope="col-4"><span className="mx-5">Sector</span></th>
            <th scope="col-4">Costo informado <br/> por el sector ($M)</th>
            <th scope="col-4">Costo informado<br /> por GORE ($M)</th>
            <th scope="col-4"><span className="text-center ms-5">Diferencia</span></th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((recurso) => (
            <tr key={recurso.id}>
              <th className="">{recurso.subtitulo_label_value.label}</th>
              <td className="col-2">
                <span className="text-sans-p-grayc">
                  {recurso.item_subtitulo_label_value.label}
                </span>
              </td>
              <td className="col-2 text-center">
                {recurso.sector_nombre || "-"}
              </td>
              <td className="mx-5 text-center col-2">
                <div className="border-gris px-3 py-1">
                  {recurso.costo_sector === 0 ? "No informado" : `$${recurso.costo_sector}`}
                </div>
              </td>
              <td className="mx-5 col-2 text-center">
                <div className="border-gris px-3 py-1">
                  ${recurso.costo_gore}
                </div>
              </td>
              <td>
                <div className="text-sans-p-bold-darkred mx-3 text-center">
                  ${recurso.diferencia_monto}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
