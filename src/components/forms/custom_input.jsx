import { useState, useRef, useEffect, forwardRef } from 'react';

const DropdownSelect = forwardRef(
  ({ label, placeholder, options, onSelectionChange, readOnly, initialValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(initialValue || null);
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

    const handleOptionClick = (option) => {
      setSelectedOption(option);
      setIsOpen(false);
      // Llamar a la función de cambio directamente en el componente padre
      if (onSelectionChange) {
        onSelectionChange(option);
      }
    };

    return (
      <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
        <label className="text-sans-h5 input-label">{label}</label>
        <button
          type="button"
          onClick={toggleDropdown}
          className={`text-sans-p dropdown-btn ${readOnly ? 'disabled' : ''}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
          {!readOnly && (
            <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
          )}
        </button>
        {isOpen && !readOnly && (
          <div className="dropdown d-flex flex-column" ref={dropdownRef}>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`p-3 ${
                  option.value === selectedOption?.value ? 'selected-option' : 'unselected-option'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DropdownSelect.displayName = 'DropdownSelect';
export default DropdownSelect;