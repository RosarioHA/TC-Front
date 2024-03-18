export const Monto = ({ monto }) => {
  let texto, claseCss;

  // Determinar el texto y la clase CSS basados en el valor de monto
  if (monto > 0) {
    texto = "Bajo el presupuesto";
    claseCss = "text-sans-h6-bold-success";
  } else if (monto < 0) {
    texto = "Por sobre el presupuesto";
    claseCss = "text-sans-p-bold-darkred";
  } else if (monto === 0) {
    texto = "Estas dentro del presupuesto";
    claseCss = "text-sans-p-bold-blue";
  } else {
    texto = "Llena la casilla de costo";
    claseCss = "text-sans-p-bold";
  }

  // Calcular el valor absoluto del monto para asegurarse de que no se muestre el signo negativo
  const montoMostrado = monto !== null ? Math.abs(monto) : '';

  return (
    <>
      <p className="text-sans-p-bold text-center">
        Diferencia con el monto
        <br /> informado por el sector
      </p>
      {monto !== null && (
        // Usar montoMostrado para mostrar el valor absoluto sin el signo negativo
        <div className={`mx-5 ${claseCss} text-center`}>${montoMostrado}</div>
      )}
      <div className={`${claseCss} text-center`}>
        {texto}
      </div>
    </>
  );
};
