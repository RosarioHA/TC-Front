import { useState,useEffect } from "react";

export const OpcionesCheck = ({
  initialState,
  handleEstadoChange,
  field,
  label,
  altA,
  altB,
  loading,
  saved,
  error,
  readOnly,
}) => {
  const [activeButton, setActiveButton] = useState(
    initialState === 'Exclusiva' ? 'activo' : initialState === 'Compartida' ? 'activo' : initialState
  );


  useEffect(() => {
    setActiveButton(
      initialState === "Exclusiva" ? 'activo' : initialState === "Compartida" ? 'inactivo' : 'none'
    );
  }, [initialState]);

  const handleClick = async (estado) => {
    if (!readOnly) {
      const newState = estado === 'activo' ? "Exclusiva" : "Compartida";
      setActiveButton(estado);
      handleEstadoChange(newState);

      if (field && typeof field.onChange === 'function') {
        field.onChange(newState);
      }

      await handleSave(arrayNameId, fieldName, newState);
    }
  };

  const renderSpinnerOrCheck = (buttonState) => {
    if (loading && activeButton === buttonState) {
      return <div className="spinner-border text-info spinner-border-sm mx-2" role="status"></div>;
    }
    if (saved && activeButton === buttonState) {
      return <i className="material-symbols-outlined mx-1">check</i>;
    }
    if (!loading && !saved && activeButton === buttonState) {
      return <i className="material-symbols-rounded">check</i>;
    }
    return null;
  };

  return (
    <div className="">
      {label && <h5 className="text-sans-h5">{label}</h5>}
      <div className="d-flex">
        <button
          type="button"
          disabled={readOnly}
          className={activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}
          onClick={() => handleClick('activo')}
        >
            {altA}
            {renderSpinnerOrCheck('activo')}
        </button>
        <button
          type="button"
          disabled={readOnly}
          className={`ms-4  ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
          onClick={() => handleClick('inactivo')}
        >
          {altB}
          {renderSpinnerOrCheck('inactivo')}
        </button>
      </div>
      <div className="d-flex justify-content-between col-12">
        {error && (
          <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
        )}
      </div>
    </div>
  );
};