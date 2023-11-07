import { useState, useRef, useEffect } from 'react';

const DropdownCheckboxBuscador = ({ label, placeholder, options, onSelectionChange, selectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Hacer clic fuera del dropdown, cierra el dropdown y refleja las selecciones
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Agregar un event listener para cerrar el dropdown al hacer clic fuera de el
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remover el event listener cuando el dropdown esta cerrado
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Limpieza al desmontar el componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      // Deselecciona la opción
      onSelectionChange(selectedOptions.filter((item) => item !== option));
    } else {
      // Selecciona la opción
      onSelectionChange([...selectedOptions, option]);
    }
  };

  const handleInputClick = (e) => {
    // Previene que el evento se propague al boton
    e.stopPropagation();
  };

  // Filtrar opciones segun termino de busqueda
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="input-container">
      <label className="text-sans-h5 input-label">{label}</label>
      <button onClick={toggleDropdown} className="text-sans-p dropdown-btn">
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
      
      {isOpen && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          {filteredOptions.map((option) => (
            <label
            className={selectedOptions.includes(option) ? 'selected-option' : 'unselected-option'}
            key={option}>
              <input
                className="ms-2 me-2 my-3"
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxBuscador;