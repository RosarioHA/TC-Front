import { useState, useRef, useEffect } from 'react';

const DropdownCheckbox = ({ label, placeholder, options, onSelectionChange, readOnly }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          onSelectionChange(selectedOptions);
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
    }, [isOpen, selectedOptions, onSelectionChange]);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
      if (isOpen) {
        setIsOpen(false);
        onSelectionChange(selectedOptions);
      }
    };
  
    const handleCheckboxChange = (option) => {
      if (option === 'Todas') {
        setSelectedOptions(selectedOptions.length === options.length ? [] : [...options]);
      } else if (option === 'Eliminar Selección') {
        setSelectedOptions([]);
      } else {
        const updatedOptions = selectedOptions.includes(option)
          ? selectedOptions.filter((item) => item !== option)
          : [...selectedOptions, option];
  
        setSelectedOptions(updatedOptions);
      }
    };

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
      <label className="text-sans-h5 input-label">{label}</label>  
      <button 
      type="button" 
      onClick={toggleDropdown} 
      className={`text-sans-p dropdown-btn ${readOnly ? "disabled" : ""}`}
      >
        {selectedOptions.length > 0
          ? (selectedOptions.length === 1
              ? selectedOptions[0]
              : `${selectedOptions.length} alternativas seleccionadas`)
          : placeholder}
         {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
      </button>
    
      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          <label className="unselected-option" key="Todas">
            <input
              className="ms-2 me-2 my-3"
              type="checkbox"
              value="Todas"
              checked={selectedOptions.length === options.length}
              onChange={() => handleCheckboxChange('Todas')}
            />
            Seleccionar todas las opciones
          </label>
          <label className="unselected-option" key="Eliminar Selección">
            <input
              className="ms-2 me-2 my-3"
              type="checkbox"
              value="Eliminar Selección"
              checked={selectedOptions.length === 0}
              onChange={() => handleCheckboxChange('Eliminar Selección')}
            />
            Eliminar Selección
          </label>
          <br/>
          {options.map((option) => (
            <label className={selectedOptions.includes(option) ? 'selected-option' : 'unselected-option'} key={option}>
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
}

export default DropdownCheckbox;