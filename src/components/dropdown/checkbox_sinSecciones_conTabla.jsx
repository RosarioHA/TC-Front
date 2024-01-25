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

  const handleCheckboxChange = (option) => {
    let updatedOptions = [...selectedOptions];
    const optionIndex = updatedOptions.indexOf(option);
    if (optionIndex !== -1) {
      updatedOptions.splice(optionIndex, 1); // Elimina la opción si ya está seleccionada
    } else {
      updatedOptions.push(option); // Agrega la opción si no está seleccionada
    }
    onSelectionChange(updatedOptions);
  };

  // Filtrar opciones según término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`} ref={dropdownRef}>
      {!readOnly && (
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
              />
            ) : (
              <span>{placeholder}</span>
            )}
            <i className="material-symbols-rounded ms-2">
              {isOpen ? 'expand_less' : 'expand_more'}
            </i>
          </button>
          {isOpen && (
            <div className="dropdown d-flex flex-column p-2 dropdown-container">
              {filteredOptions.map((option) => (
                <label key={option.value} className={selectedOptions.includes(option.value.toString()) ? 'selected-option' : 'unselected-option'}>
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedOptions.includes(option.value.toString())}
                    onChange={() => handleCheckboxChange(option.value.toString())}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tabla de Selecciones para mostrar competencias ya asignadas y permitir su eliminación */}
      <div className="mb-5 mt-5">
        <table>
          <thead>
            <tr>
              <th className="col-1"><p className="ms-4">#</p></th>
              <th className="col-5"><p>Competencias</p></th>
              {!readOnly && <th className="col-1"><p className="ms-2">Acción</p></th>}
            </tr>
          </thead>
          <tbody>
            {selectedOptions.map((competenciaId, index) => {
              const competencia = options.find(comp => comp.value.toString() === competenciaId);
              const competenciaNombre = competencia ? competencia.label : `Competencia ${competenciaId}`;

              return (
                <tr key={competenciaId} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                  <td><p className="ms-4 my-3">{index + 1}</p></td>
                  <td><p className="my-3">{competenciaNombre}</p></td>
                  {!readOnly && (
                    <td>
                      <button type="button" className="btn-terciario-ghost" onClick={() => handleCheckboxChange(competenciaId)}>
                        <p className="mb-0 text-decoration-underline">Eliminar</p>
                        <i className="material-symbols-rounded ms-2">delete</i>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DropdownSinSecciones;
