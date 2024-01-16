import { useState, useEffect } from "react";
export const RadioButtons = ({ initialState, handleEstadoChange, field, altA, altB, label, readOnly }) => {
  const [activeButton, setActiveButton] = useState(initialState);

  useEffect(() => {
    setActiveButton(initialState);
    if (!readOnly) {
      setActiveButton(initialState);
    }
  }, [initialState, readOnly]);

  const handleClick = (estado) => {
    setActiveButton(estado);
    handleEstadoChange(estado); // Notifica al padre
    field.onChange(estado === 'activo'); // Actualiza react-hook-form
    if (!readOnly) {
      setActiveButton(estado);
      handleEstadoChange(estado); // Notifica al padre
      field.onChange(estado === 'activo'); // Actualiza react-hook-form
    }
  };

  return (
    <div className="mb-5">
      {label && <h5 className="text-sans-h5">{label}</h5>}
      {readOnly ? (
        <div className="d-flex mb-2">
        <button
          type="button"
          disabled
          className={activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}
          >
          {altA}
          {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
        <button
          type="button"
          disabled
          className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
          >
          {altB}
          {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
      </div>
      ):(
      <div className="d-flex mb-2">
        <button
          type="button"
          className={activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}
          onClick={() => handleClick('activo')}>
          {altA}
          {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
        <button
          type="button"
          className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
          onClick={() => handleClick('inactivo')}>
          {altB}
          {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
      </div>
      )}
    </div>
  );
};
