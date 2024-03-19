import { OpcionesAB } from '../../forms/opciones_AB';
// import { AgregarPersonal } from './AgregarPersonal';

export const PersonalInformado = () => {
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
            <tr>
              <th scope="row ">1</th>
              <td className="col-2">Directivo</td>
              <td className="col-3 mx-5">
                <div className="border-gris col-6 py-2 px-3">20.000</div>
              </td>
              <td className="col-2">
                <div className="border-gris col-6 py-2 px-3">12</div>
              </td>
              <td className="col-2">
                <span>
                  Instituto Nacional de Desarrollo Sustentable de la Pesca ...
                </span>
              </td>
              <td className="col-2 px-5">
                <span className="text-sans-p-bold-blue">Sí</span>
              </td>
              <td className="col-2 pe-3">
                <OpcionesAB altA="Si" altB="No" />
              </td>
            </tr>
          </tbody>
        </table>
        {/* <AgregarPersonal /> */}
      </div>
    </>
  );
};
