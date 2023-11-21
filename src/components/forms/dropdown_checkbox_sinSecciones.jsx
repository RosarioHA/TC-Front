import { useState, useRef, useEffect } from 'react';

const DropdownCheckboxSinSecciones = ({ label, placeholder, options, onSelectionChange, selectedOptions }) => {
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


  const handleCheckboxChange = (optionId) => {
    const updatedOptions = [...selectedOptions]; // Cambia de objeto a array
  
    const optionIndex = updatedOptions.indexOf(optionId);
    if (optionIndex !== -1) {
      // Si ya está en la lista, quítalo
      updatedOptions.splice(optionIndex, 1);
    } else {
      // Si no está en la lista, agrégalo
      updatedOptions.push(optionId);
    }
  
    onSelectionChange(updatedOptions);
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("propagacion detenida en componente")
  };

  // Filtrar opciones segun termino de busqueda
  const filteredOptions = options.filter((option) =>
  String(option).toLowerCase().includes(searchTerm.toLowerCase())
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
              className={selectedOptions.includes(option.id) ? 'selected-option' : 'unselected-option'}
              key={option.id}
            >
            <input
              className="ms-2 me-2 my-3"
              type="checkbox"
              value={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleCheckboxChange(option.id)}
            />
            {option.nombre}
            </label>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxSinSecciones;