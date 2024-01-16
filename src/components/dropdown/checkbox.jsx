import { useState, useRef, useEffect } from 'react';

const DropdownCheckbox = ({ label, placeholder, options, onSelectionChange, readOnly, prevSelection }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (prevSelection && prevSelection.length > 0) {
      // Si hay opciones preseleccionadas, establecerlas como opciones seleccionadas
      setSelectedOptions(prevSelection);
    }
  }, [prevSelection]);  

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        onSelectionChange(selectedOptions);
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
  }, [ isOpen, selectedOptions, onSelectionChange ]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsOpen(false);
      onSelectionChange(selectedOptions);
    }
  };

  const handleCheckboxChange = (option) => {
    let updatedOptions;
  
    if (option === 'Todas') {
      // Seleccionar todas las opciones disponibles
      updatedOptions = options;
    } else if (option === 'Eliminar Selección') {
      // Deseleccionar todas las opciones
      updatedOptions = [];
    } else {
      // Resto de la lógica para opciones individuales
      updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item.value !== option.value)
        : [...selectedOptions, option];
    }
  
    // Filtramos duplicados y notificamos al componente padre
    onSelectionChange([...new Map(updatedOptions.map((item) => [item.value, item])).values()]);
    setSelectedOptions(updatedOptions);
  };
  
  console.log("selected options", selectedOptions)

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
                checked={selectedOptions.some(opt => opt.value === option.value)}
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