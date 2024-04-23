export const Avance = ({ avance }) => {
  if (!avance) {
    // Manejar el caso en que avance no esté definido
    return <div>Datos de avances No disponible</div>;
  }

  const [completados, total] = avance.split('/').map(Number);
  const esCompleto = completados === total;
  const claseAvanceStep = `avance-step py-1 px-1 mx-2 ${esCompleto ? '' : 'incompleto'}`;

  return (
    <div className="d-inline-flex my-2 py-1">
      <div className="avance-bar pt-2 my-auto align-self-center">
        <span className="text-sans-h5-medium mx-2 ms-0">
          Avance
          <span className={claseAvanceStep}>
            {completados}/{total}
          </span>
          <span className="text-sans-h6 mx-1"> campos obligatorios completos</span>
        </span>
      </div>
    </div>
  );
};