import React, { useState, useRef, useEffect } from 'react';

const DropdownCheckboxUsuarios = ({ label, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
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
    const updatedSelection = [...selectedOptions];
    const optionIndex = updatedSelection.indexOf(option);
    if (optionIndex !== -1) {
      updatedSelection.splice(optionIndex, 1);
    } else {
      updatedSelection.push(option);
    }
    setSelectedOptions(updatedSelection);
    console.log("Selección desde el componente", updatedSelection);
  };

  const filteredOptions = options.filter((optionGroup) => {
    const groupLabel = typeof optionGroup === 'object' ? optionGroup.label : optionGroup;
    const searchTextLower = searchTerm.toLowerCase();

    return groupLabel.toLowerCase().includes(searchTextLower);
  });

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
          />
        ) : (
          <span>{placeholder}</span>
        )}
        <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
      </button>

      {isOpen && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          {filteredOptions.map((optionGroup, index) => (
            <React.Fragment key={index}>
              <div className="group-label">{optionGroup.label}</div>
              {optionGroup.options && optionGroup.options.map((option) => (
                <label
                  className={selectedOptions.includes(option) ? 'selected-option' : 'unselected-option'}
                  key={typeof option === 'object' ? option.id : option}
                >
                  <input
                    className="ms-2 me-2 my-3"
                    type="checkbox"
                    value={typeof option === 'object' ? option.id : option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {typeof option === 'object' ? option.nombre : option}
                </label>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxUsuarios;