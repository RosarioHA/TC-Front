import { useState, useRef, useEffect } from 'react';

const DropdownCheckbox = ({ label, placeholder, options, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          // Hacer clic fuera del dropdown, cierra el dropdown y refleja las selecciones
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
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };  

  return (
    <div className="input-container">
      <label className="text-sans-h5 input-label">{label}</label>  
      <button type="button" onClick={toggleDropdown} className="text-sans-p-lightgrey dropdown-btn">
        {placeholder}
        <i className="material-symbols-rounded ms-2">expand_more</i>
      </button>
      {isOpen && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
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