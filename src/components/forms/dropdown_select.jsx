import { useState, useRef, useEffect } from 'react';

const DropdownSelect = ({ label, placeholder, options, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
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
    onSelectionChange(option);
  };

  return (
    <div className="input-container">
      <label className="text-sans-h5 input-label">{label}</label>
      <button type="button" onClick={toggleDropdown} className="text-sans-p dropdown-btn">
        {selectedOption || placeholder}
      </button>
      {isOpen && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`p-3 ${option === selectedOption ? 'selected-option' : 'unselected-option'}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;