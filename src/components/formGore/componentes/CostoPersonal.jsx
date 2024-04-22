export const CostoPersonal = ({
  title,
  plantaJustificado,
  plantaJustificar,
  contrataJustificado,
  contrataJustificar,
  otrasJustificado,
  otrasJustificar,
  gastoPersonalJustificado,
  gastosPersonalJustificar,
}) => {
  // Función para formatear los números con separadores de miles
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(Number(number));
  };

  // Lista de filas con sus respectivos datos, ya formateados
  const filas = [
    { nombre: '01 - Personal de Planta', justificado: formatNumber(plantaJustificado), justificar: formatNumber(plantaJustificar) },
    { nombre: '02 - Personal Contrata', justificado: formatNumber(contrataJustificado), justificar: formatNumber(contrataJustificar) },
    { nombre: '03 - Otras Remuneraciones', justificado: formatNumber(otrasJustificado), justificar: formatNumber(otrasJustificar) },
    { nombre: '04 - Otras Gastos en Personal', justificado: formatNumber(gastoPersonalJustificado), justificar: formatNumber(gastosPersonalJustificar) },
  ];

  // Filtrar primero las filas que deben mostrarse
  const filasVisibles = filas.filter(fila => fila.justificado !== "0" || fila.justificar !== "0");

  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
          <div className="subrayado col-12">
            <span className="py-2 my-2 align-self-center">
              <p className="text-sans-p ms-2"> Costos de personal {title} a justificar</p>
            </span>
          </div>
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col-5">item</th>
                <th scope="col-6">
                  Costo adicional informado por GORE ($M)
                </th>
                <th scope="col-4">
                  Pendiente por justificar
                </th>
              </tr>
            </thead>
            <tbody>
              {filasVisibles.map((fila, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td><span className="text-sans-p-grayc">{fila.nombre}</span></td>
                  <td><div className="border-gris col-6 py-2 px-3">{fila.justificado}</div></td>
                  <td><div className="text-sans-p-bold-darkred">{fila.justificar}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
