import { useState, useRef, useEffect } from 'react';

const DropdownCheckbox = ({ label, placeholder, options, onSelectionChange, readOnly }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() =>
  {
    function handleClickOutside(event)
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      {
        setIsOpen(false);
        onSelectionChange(selectedOptions);
      }
    }

    if (isOpen)
    {
      document.addEventListener('mousedown', handleClickOutside);
    } else
    {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () =>
    {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ isOpen, selectedOptions, onSelectionChange ]);

  const toggleDropdown = () =>
  {
    setIsOpen(!isOpen);
    if (isOpen)
    {
      setIsOpen(false);
      onSelectionChange(selectedOptions);
    }
  };

  const handleCheckboxChange = (option) =>
  {
    if (option.value === 'Todas')
    {
      setSelectedOptions(selectedOptions.length === options.length ? [] : [ ...options ]);
    } else if (option.value === 'Eliminar Selección')
    {
      setSelectedOptions([]);
    } else
    {
      const updatedOptions = selectedOptions.find(opt => opt.value === option.value)
        ? selectedOptions.filter((item) => item.value !== option.value)
        : [ ...selectedOptions, option ];

      setSelectedOptions(updatedOptions);
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
        {selectedOptions.length > 0
          ? selectedOptions.length === 1
            ? selectedOptions[ 0 ].label
            : `${selectedOptions.length} alternativas seleccionadas`
          : placeholder}
        {!readOnly && (
          <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
        )}
      </button>

      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          <button
            type="button"
            className={`text-sans-p btn-option ${selectedOptions.length > 0 ? 'active' : ''}`}
            onClick={() => handleCheckboxChange('Todas')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`text-sans-p btn-option ${selectedOptions.length === 0 ? 'active' : ''}`}
            onClick={() => handleCheckboxChange('Eliminar Selección')}
          >
            Eliminar Selección
          </button>

          {options.map((option) => (
            <label
              className={selectedOptions.find(opt => opt.value === option.value) ? 'selected-option' : 'unselected-option'}
              key={option.value}
            >
              <input
                className="ms-2 me-2 my-3"
                type="checkbox"
                value={option.value}
                checked={selectedOptions.find(opt => opt.value === option.value)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;