
export const CostoPersonal = ({ title }) =>
{
  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
          <div className="subrayado col-12">
            <span className="py-2 my-2 align-self-center">
              Costos de personal {title} a justificar
            </span>
          </div>
          <table className="table table-striped  align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col-5">item</th>
                <th scope="col-6">Costo adicional <br /> informado por GORE ($M)</th>
                <th scope="col-4">Pendiente por<br /> justificar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td><span className="text-sans-p-grayc">01 - Personal de Planta</span></td>
                <td><div className="border-gris col-6 py-2 px-3">
                  $20.000
                </div></td>
                <td><div className="text-sans-p-bold-darkred">$20.000</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
