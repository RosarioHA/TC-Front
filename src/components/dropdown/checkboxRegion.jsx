import { useState, useRef, useEffect } from 'react';

export const CheckboxRegion = ({ label, placeholder, options, onSelectionChange, readOnly }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() =>
  {
    function handleClickOutside(event)
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        toggleRef.current && !toggleRef.current.contains(event.target))
      {
        setIsOpen(false);
        onSelectionChange(selectedOptions);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
    {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ selectedOptions, onSelectionChange ]);

  const handleDropdownClick = () =>
  {
    setIsOpen(current => !current);
  };

  const handleCheckboxChange = (option) =>
  {
    if (option === 'Todas')
    {
      const optionsWithoutSinRegion = options.filter(opt => opt.label !== 'Sin región asociada');
      setSelectedOptions(optionsWithoutSinRegion);
    } else if (option === 'Eliminar Selección')
    {
      setSelectedOptions([]); // Deseleccionar todas las opciones
    } else
    {
      const isAlreadySelected = selectedOptions.some(opt => opt.value === option.value);
      if (isAlreadySelected)
      {
        setSelectedOptions(selectedOptions.filter(opt => opt.value !== option.value));
      } else
      {
        setSelectedOptions([ ...selectedOptions, option ]);
      }
    }
  };

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`} ref={dropdownRef}>
      <label className="text-sans-h5 input-label">{label}</label>
      <button
        type="button"
        onClick={handleDropdownClick}
        className={`text-sans-p dropdown-btn ${readOnly ? 'disabled' : ''}`}
        ref={toggleRef}
      >
        {selectedOptions.length > 0
          ? selectedOptions.length === 1
            ? selectedOptions[ 0 ].label
            : `${selectedOptions.length} seleccionadas`
          : placeholder}
        {!readOnly && (
          <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
        )}
      </button>

      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column dropdown-container" ref={dropdownRef}>
          <button
            type="button"
            className={`text-sans-p btn-option ${selectedOptions.length > 0 ? 'active' : ''}`}
            onClick={() => handleCheckboxChange('Todas')}
          >
            Todas
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
              className={selectedOptions.some(opt => opt.value === option.value) ? 'selected-option' : 'unselected-option'}
              key={option.value}
            >
              <input
                className="my-3 mx-3 p-3"
                type="checkbox"
                value={option.value}
                checked={selectedOptions.some(opt => opt.value === option.value)} // Asegurar valor booleano
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
