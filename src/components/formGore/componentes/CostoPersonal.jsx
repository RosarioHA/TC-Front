export const CostoPersonal = ({
  title,
  plantaInformado,
  plantaJustificar,
  contrataInformado,
  contrataJustificar,
  otrasInformado,
  otrasJustificar,
  gastoPersonalInformado,
  gastosPersonalJustificar,
}) => {
  // Función para formatear los números con separadores de miles
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(Number(number));
  };

  // Lista de filas con sus respectivos datos, ya formateados
  const filas = [
    { nombre: '01 - Personal de Planta', informado: formatNumber(plantaInformado), justificar: formatNumber(plantaJustificar) },
    { nombre: '02 - Personal Contrata', informado: formatNumber(contrataInformado), justificar: formatNumber(contrataJustificar) },
    { nombre: '03 - Otras Remuneraciones', informado: formatNumber(otrasInformado), justificar: formatNumber(otrasJustificar) },
    { nombre: '04 - Otras Gastos en Personal', informado: formatNumber(gastoPersonalInformado), justificar: formatNumber(gastosPersonalJustificar) },
  ];

  // Filtrar primero las filas que deben mostrarse
  const filasVisibles = filas.filter(fila => fila.informado !== "0" || fila.justificar !== "0");

  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
          <div className="subrayado col-12">
            <span className="py-2 my-2 align-self-center">
              <p className="text-sans-p-bold ms-2"> Costos de personal {title} a justificar por GORE:</p>
            </span>
          </div>
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col-4 ">item</th>
                <th scope="col-4 text-center">
                  Costo adicional 
                  <br /> informado por GORE ($M)
                </th>
                <th scope="col-3 text-center">
                  Pendiente por justificar
                </th>
              </tr>
            </thead>
            <tbody>
              {filasVisibles.map((fila, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td><span className="text-sans-p-grayc col-4">{fila.nombre}</span></td>
                  <td className=""><div className="col-6 py-1 valor-fijo mb-2 mt-2 text-center">$ {fila.informado}</div></td>
                  <td><div className="text-sans-p-bold-darkred text-center col-6">{fila.justificar}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
