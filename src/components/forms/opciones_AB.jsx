import { useState, useEffect } from "react";

export const OpcionesAB = ({ initialState, handleEstadoChange, field, altA, altB, label, readOnly }) => {
  const [activeButton, setActiveButton] = useState(initialState === true ? 'activo' : 'inactivo');
  console.log("initial state en componente OpcionesAB", initialState);

  useEffect(() => {
    if (initialState !== null && !readOnly) {
      const newActiveButton = initialState === true ? 'activo' : 'inactivo';

      // Verificamos si el nuevo estado es diferente al estado actual antes de actualizar
      if (newActiveButton !== activeButton) {
        setActiveButton(newActiveButton);
        handleEstadoChange(initialState);
        field.onChange(initialState === true);
      }
    }
  }, [initialState, readOnly, handleEstadoChange, field, activeButton]);

  const handleClick = (estado) => {
    if (!readOnly) {
      setActiveButton((prevActiveButton) => {
        if (prevActiveButton === estado) {
          // Si el botón ya está activo, desactívalo
          handleEstadoChange(null);
          field.onChange(false);
          return null;
        } else {
          // Activa el botón
          handleEstadoChange(estado === 'activo');
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