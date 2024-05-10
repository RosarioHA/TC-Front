import { useState, useRef, useEffect } from 'react';

const DropdownSelect = ({ label, placeholder, options, onSelectionChange, selected, error, readOnly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Inicialización y actualización de selectedOption
  useEffect(() => {
    if (selected && typeof selected === 'object' && selected.hasOwnProperty('label') && selected.hasOwnProperty('value')) {
      setSelectedOption(selected);
    } else {
      // Asumiendo que cuando selected es nulo, se resetea la selección
      setSelectedOption(null);
    }
  }, [selected, options]);

  // Manejo de cambios
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectionChange(option);
  };

  const toggleDropdown = () => {
    if (!readOnly) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`} ref={dropdownRef}>
      <label className="text-sans-h5 input-label">{label}</label>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`text-sans-p dropdown-btn text-wrap ${isOpen ? 'dropdown-btn-abierto' : ''} ${readOnly ? "disabled" : ""}`}
      >
        {selectedOption ? selectedOption.label : placeholder}
        {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
      </button>

      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column p-2 dropdown-container dropdown-menu">
          {options?.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`p-3 dropdown-option text-sans-p text-wrap ${option.value === selectedOption?.value ? 'selected-dropdown-option' : ''}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-sans-h6-darkred mt-2">{error}</div>}
    </div>
  );
};

export default DropdownSelect;
