import { useState, useRef, useEffect } from 'react';

const DropdownSelectCostos = ({ label, placeholder, options, onSelectionChange, selected, error, readOnly }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedOption, setSelectedOption ] = useState(null);
  const [ hasChanges, setHasChanges ] = useState(false);
  const dropdownRef = useRef(null);

  // useEffect para actualizar selectedOption basado en la prop 'selected'
  useEffect(() => {
    if (selected === '' || selected === null) {
      setSelectedOption(null);
    } else if (typeof selected === 'object' && selected !== null) {
      setSelectedOption(selected);
    } else if (selected) {
      const option = options.find(o => o.value === selected);
      setSelectedOption(option || null);
    }
  }, [selected, options]);

  useEffect(() => {
    if (hasChanges) {
      onSelectionChange(selectedOption);
      setHasChanges(false); // Reinicia el estado de cambios después de notificar al padre
    }
  }, [hasChanges, selectedOption, onSelectionChange]);


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
  }, [ isOpen ]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (!selectedOption || option.value !== selectedOption.value) {
      setSelectedOption(option);
      onSelectionChange(option);
    }
    setIsOpen(false);
  };
  
  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
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
        <div className="dropdown d-flex flex-column p-2 dropdown-container dropdown-menu" ref={dropdownRef}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`p-3 dropdown-option text-sans-p  text-wrap ${option.value === selectedOption?.value ? 'selected-dropdown-option' : ''}`}
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

export default DropdownSelectCostos;
