
export const Avance = () =>
{

  const completados = 16; 
  const total = 16; 
  const esCompleto = completados === total;

  // Clase para avance-step basado en si está completo o no
  const claseAvanceStep = `avance-step py-1 px-1 mx-2 ${esCompleto ? '' : 'incompleto'}`;


  return (
    <div className="d-inline-flex my-2 py-1">
      <div className="avance-bar pt-2 my-auto mx-5 align-self-center">
        <span className="text-sans-h5-medium mx-2">
          Avance
          <span className={claseAvanceStep}>
            {completados}/{total}
          </span>
          <span className="text-sans-h6 mx-1"> campos obligatorios completos</span>
        </span>
      </div>
    </div>
  )
}
