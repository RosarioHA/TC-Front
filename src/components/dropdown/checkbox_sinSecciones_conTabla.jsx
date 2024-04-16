import { useState, useRef, useEffect } from 'react';

const DropdownSinSecciones = ({ label, placeholder, options, onSelectionChange, selectedOptions, readOnly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (optionValue) => {
    if (optionValue === 'Todas') {
      // Seleccionar todas las competencias si se presiona "Todas"
      const allOptionIds = options.map(option => option.value);
      onSelectionChange(allOptionIds);
    } else if (optionValue === 'Eliminar Selección') {
      // Limpiar todas las selecciones si se presiona "Eliminar Selección"
      onSelectionChange([]);
    } else {
      // Manejo normal de selección/deselección de una sola competencia
      const isSelected = selectedOptions.includes(optionValue);
      const updatedOptions = isSelected
        ? selectedOptions.filter((option) => option !== optionValue)
        : [...selectedOptions, optionValue];
      onSelectionChange(updatedOptions);
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Filtrar opciones segun termino de busqueda
  const filteredOptions = options.filter((option) =>
  String(option).toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
    {readOnly ? (
      <>
      <label className="text-sans-h5 input-label ps-0">Competencia(s) Asignada(s)</label>
      {selectedOptions.length > 0 && (
        <div className="mb-5 pt-5">
          <table>
            <thead className="">
              <tr className="">
                <th className="col-1">
                  <p className="ms-4">#</p>
                </th>
                <th className="col-5">
                  <p>Competencia</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedOptions.map((competenciaId, index) => {
                const competencia = options.find(comp => comp.id === parseInt(competenciaId));
                const competenciaNombre = competencia ? competencia.nombre : `${competenciaId}`;

                return (
                  <tr key={competenciaId} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                    <td>
                      <p className="ms-4 my-3">{index + 1}</p>
                    </td>
                    <td>
                      <p className="my-3">{competenciaNombre}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </>
    ) : (
      <>
        <label className="text-sans-h5 input-label">{label}</label>
        <button 
        type="button" 
        onClick={toggleDropdown} 
        className={`text-sans-p dropdown-btn ${isOpen ? 'dropdown-btn-abierto' : ''} ${readOnly ? "disabled" : ""}`}
        >
          {isOpen ? (
            <input
              className="ghost-input"
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={handleInputClick}
              onMouseDown={handleInputClick}
            />
          ) : (
            <span>{placeholder}</span>
          )}
          <i className="material-symbols-rounded ms-2">
            {isOpen ? 'expand_less' : 'expand_more'}
          </i>
        </button>
        <div className="d-flex mt-3 text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6 className=""> Si la competencia no está creada, debes crearla primero y luego asociarle un usuario. </h6>
        </div>
      </>
    )}
    
    {isOpen && (
      <div className="dropdown d-flex flex-column p-2 dropdown-container" ref={dropdownRef}>
        <button
          type="button"
          className={`text-sans-p btn-option ${selectedOptions.length > 0 ? 'active' : ''}`}
          onClick={() => handleCheckboxChange('Todas')}
        >
          Todas
        </button>
        <button
          type="button"
          className={`text-sans-p btn-option ${selectedOptions.length === 0 ? 'active' : ''}`}
          onClick={() => handleCheckboxChange('Eliminar Selección')}
        >
          Eliminar Selección
        </button>

        {filteredOptions.map((option) => (
          <label
          key={option.value}
          className={selectedOptions.includes(option.value) ? 'selected-option' : 'unselected-option'}
          >
            <input
              className="ms-2 me-2 my-3"
              type="checkbox"
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    )}

    {/* Tabla de Selecciones */}
    {!readOnly && selectedOptions.length > 0 && (
      <div className="mb-5 mt-5">
        <table>
          <thead className="">
            <tr className="">
              <th className="col-1">
                <p className="ms-4">#</p>
              </th>
              <th className="col-5">
                <p>Competencias</p>
              </th>
              <th className="col-1">
                <p className="ms-2">Acción</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedOptions.map((competenciaId, index) => {
              const competencia = options.find(comp => comp.value === parseInt(competenciaId, 10));
              const competenciaNombre = competencia ? competencia.label : `Competencia ${competenciaId}`;

              return (
                <tr key={competenciaId} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                  <td>
                    <p className="ms-4 my-3">{index + 1}</p>
                  </td>
                  <td>
                    <p className="my-3">{competenciaNombre}</p>
                  </td>
                  <td>
                    <button type="button" className="btn-terciario-ghost" onClick={() => handleCheckboxChange(competenciaId)}>
                      <p className="mb-0 text-decoration-underline">Eliminar</p>
                      <i className="material-symbols-rounded ms-2">delete</i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default DropdownSinSecciones;