import { useState, useEffect } from "react";

export const BtnRadio = ({ initialState, handleEstadoChange, field, altA, altB, label }) => {
  const [activeButton, setActiveButton] = useState(initialState);

  useEffect(() => {
    setActiveButton(initialState);
  }, [initialState]);

  const handleClick = (estado) => {
    setActiveButton(estado);
    const estadoBoolean = estado === 'agrupada'; // 'agrupal' se asocia con 'true', 'individual' con 'false'
    handleEstadoChange(estadoBoolean);
    field.onChange(estadoBoolean);
  };

  return (
    <div className="mb-5">
      {label && <h5 className="text-sans-h5">{label}</h5>}
      <div className="d-flex mb-2 justify-content-center col-10">
        <button
          type="button"
          className={`${activeButton === 'individual' ? 'btn-secundario-s-round active' : 'btn-secundario-s-round'} mx-5`}
          onClick={() => handleClick('individual')}>
          <u>{altA}</u>
        </button>
        <button
          type="button"
          className={`${activeButton === 'agrupada' ? 'btn-secundario-s-round active' : 'btn-secundario-s-round'} mx-5`}
          onClick={() => handleClick('agrupada')}>
          <u>{altB}</u>
        </button>
      </div>
    </div>
  );
};