import { OpcionesAB } from '../../forms/opciones_AB';
// import { AgregarPersonal } from './AgregarPersonal';

export const PersonalInformado = ({ personal }) =>
{

  console.log(personal);
  return (
    <>
      <div className="my-5 col-11">
        <span>Personal directo informado por el sector:</span>
        <p className="my-2">
          <strong>Calidad Jurídica </strong>{' '}
          <span className="mx-2">Planta</span>
        </p>
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col-2">#</th>
              <th scope="col-3">Estamento</th>
              <th scope="col-4">
                Renta bruta <br /> mensual
              </th>
              <th scope="col-1">
                Grado <br /> (Si corresponde)
              </th>
              <th scope="col-3">Sector</th>
              <th scope="col-1">
                Comisión <br />
                de servicio
              </th>
              <th scope="col-1">
                ¿GORE <br />
                utilizará este <br />
                recurso?
              </th>
            </tr>
          </thead>
          <tbody>
            {personal.map((persona, index) => (
              <tr key={persona.id}>
                <th scope="row ">{index + 1}</th>
                <td className="col-2">{persona.nombre_estamento}</td>
                <td className="col-4 mx-2">
                  <div className="border-gris col-10  py-2 px-3">{persona.renta_bruta || "sin información"}</div>
                </td>
                <td className="col-2">
                  <div className="border-gris col-6 py-2 px-3">{persona.grado}</div>
                </td>
                <td className="col-2">
                  <span>
                    {persona.sector_nombre}
                  </span>
                </td>
                <td className="col-2 px-5">
                  <span className="text-sans-p-bold-blue">{persona.comision_servicio ? 'Sí' : 'No'}</span>
                </td>
                <td className="col-2 pe-3">
                  <OpcionesAB altA="Si" altB="No" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <AgregarPersonal />  */}
      </div>
    </>
  );
};
