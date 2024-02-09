import { useState } from "react";

export const OpcionesAB = ({
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
  handleSave,
  arrayNameId,
  fieldName
}) => {
  const [activeButton, setActiveButton] = useState(
    initialState === true ? 'activo' : initialState === false ? 'inactivo' : 'none'
  );


  const handleClick = async (estado) => {
    if (!readOnly) {
      const newState = estado === 'activo' ? true : false;
      setActiveButton(estado);
      handleEstadoChange(newState);
      field.onChange(newState);

      await handleSave(arrayNameId, fieldName, newState);
    }
  };

  const renderSpinnerOrCheck = (buttonState) => {
    // Solo muestra el spinner o el check si el estado del botón coincide con el estado activo/inactivo
    if (loading && activeButton === buttonState) {
      return <div className="spinner-border  text-info spinner-border-sm mx-2" role="status"></div>;
    }
    if (saved && activeButton === buttonState) {
      return <i className="material-symbols-outlined mx-1 ">check</i>;
    }
    // Si no está cargando ni ha guardado, y el botón está activo, muestra el check
    if (!loading && !saved && activeButton === buttonState) {
      return <i className="material-symbols-rounded">check</i>;
    }
    return null; // No muestra nada si no se cumplen las condiciones
  };

  return (
    <div className="mb-5">
      {label && <h5 className="text-sans-h5">{label}</h5>}
      <div className="d-flex my-3">
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
