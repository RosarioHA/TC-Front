import { useState, useEffect } from "react";
export const RadioButtons = ({ initialState, handleEstadoChange, field }) => {
  const [activeButton, setActiveButton] = useState(initialState);

  useEffect(() => {
    setActiveButton(initialState);
  }, [initialState]);

  const handleClick = (estado) => {
    setActiveButton(estado);
    handleEstadoChange(estado); // Notifica al padre
    field.onChange(estado === 'activo'); // Actualiza react-hook-form
  };

  return (
    <div className="mb-5">
      <h5 className="text-sans-h5">Estado</h5>
      <div className="d-flex mb-2">
        <button
          type="button"
          className={activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}
          onClick={() => handleClick('activo')}>
          Activo
          {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
        <button
          type="button"
          className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
          onClick={() => handleClick('inactivo')}>
          Inactivo
          {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
        </button>
      </div>
    </div>
  );
};
