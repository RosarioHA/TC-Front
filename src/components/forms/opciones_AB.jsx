import { useState } from "react";

export const OpcionesAB = ({ initialState, handleEstadoChange, field, altA, altB, label, readOnly }) => {
  const [activeButton, setActiveButton] = useState(initialState);
  console.log("initial state en componente OpcionesAB", initialState);

  const handleClick = (estado) => {
    if (!readOnly) {
      setActiveButton(prevActiveButton => {
        if (prevActiveButton === estado) {
          // Si el botón ya está activo, desactívalo
          return null;
        } else {
          // Activa el botón
          handleEstadoChange(estado);
          field.onChange(estado === 'activo');
          return estado;
        }
      });
    }
  };

  return (
    <div className="mb-5">
      {label && <h5 className="text-sans-h5">{label}</h5>}
      <div className="d-flex mb-2">
        <button
          type="button"
          disabled={readOnly}
          className={activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}
          onClick={() => handleClick('activo')}
        >
          {altA}
          {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
        <button
          type="button"
          disabled={readOnly}
          className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
          onClick={() => handleClick('inactivo')}
        >
          {altB}
          {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
      </div>
    </div>
  );
};