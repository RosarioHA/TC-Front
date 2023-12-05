const RadioButtons = ({ initialState, handleEstadoChange, errors, readOnly, is_active }) => {
    console.log("activeButton en compo radio button". activeButton);
  
    return (
      <div className="mb-5">
        {readOnly ? (
          <>
            <h5 className="text-sans-h5">Estado</h5>
            <button
            type="button"
            className={`btn-primario-s ${is_active ? 'activo' : 'inactivo'}`}
            disabled
            >
              {is_active ? 'Activo' : 'Inactivo'}
            </button>
          </>
        ) : (
          <>
            <h5 className="text-sans-h5">Estado</h5>
            <div className="d-flex mb-2">
              <button
              type="button"
              className={` ${initialState === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
              onClick={() => handleEstadoChange('activo')}
              >
                <p className="mb-0 text-decoration-underline">Activo</p>
                {initialState === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
              </button>
              <button
              type="button"
              className={`ms-2 ${initialState === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
              onClick={() => handleEstadoChange('inactivo')}
              >
                <p className="mb-0 text-decoration-underline">Inactivo</p>
                {initialState === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
              </button>
            </div>
          </>
        )}
        {errors.estado && <p className="text-sans-h6-darkred mt-2 mb-0">{errors.estado.message}</p>}
      </div>
    );
  };
  
  export default RadioButtons;