import { useState, useEffect } from "react";

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
  console.log(`[OpcionesAB] initialState:`, initialState);
  const [activeButton, setActiveButton] = useState(
    initialState === true ? 'activo' : initialState === false ? 'inactivo' : 'none'
  );

  // Log cuando el componente recibe un nuevo initialState
  useEffect(() => {
    console.log(`[OpcionesAB] useEffect updated initialState:`, initialState);
  }, [initialState]);

  const handleClick = async (estado) => {
    if (!readOnly) {
      const newState = estado === 'activo' ? true : false;
      setActiveButton(estado);
      handleEstadoChange(newState);
      field.onChange(newState); // Actualiza el estado en el form global

      // Llama a handleSave directamente con el nuevo estado
      await handleSave(arrayNameId, fieldName, newState);
    }
  };

  const renderSpinnerOrCheck = () =>
  {// Agrega esta línea para depurar
    if (loading)
    {
      return <div className="spinner-border text-primary my-4 mx-3" role="status"></div>;
    }
    if (saved)
    {
      return <i className="material-symbols-outlined my-4 mx-3 text-success ">check</i>;
    }
    return null;
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
      <div className=" d-flex align-self-end align-items-center">
              {renderSpinnerOrCheck()}
            </div>
      <div className="d-flex justify-content-between col-12">
        {error && (
          <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
        )}
      </div>
    </div>
  );
};