import { useState, useRef, useEffect, useCallback } from 'react';

const DropdownCheckbox = ({
  label,
  options,
  placeholder,
  readOnly,
  selectedRegions,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(() => selectedRegions || []);
  const [userHasMadeSelection, setUserHasMadeSelection] = useState(false); 
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);


  useEffect(() => {
    // Actualizar solo si el usuario no ha hecho ninguna selección
    if (selectedRegions && !userHasMadeSelection) {
      setSelectedOptions(selectedRegions);
    }
  }, [selectedRegions, userHasMadeSelection]);

  const handleDropdownClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleCheckboxChange = useCallback((option) => {
    if (readOnly) return;
    let newSelectedOptions;
  
    if (option === 'Todas') {
      newSelectedOptions = options.filter(opt => opt.label !== 'Sin región asociada');
    } else if (option === 'Eliminar Selección') {
      newSelectedOptions = [];
    } else {
      const index = selectedOptions.findIndex(opt => opt.value === option.value);
      if (index > -1) {
        // Deseleccionar
        newSelectedOptions = [
          ...selectedOptions.slice(0, index),
          ...selectedOptions.slice(index + 1)
        ];
      } else {
        // Seleccionar
        newSelectedOptions = [...selectedOptions, option];
      }
    }

    setSelectedOptions(newSelectedOptions)
    setUserHasMadeSelection(true);
    // Llamar a la función de callback pasada por el componente padre
    if (onSelectionChange) {
      onSelectionChange(newSelectedOptions);
    }
  }, [selectedOptions, options, onSelectionChange, readOnly]);


  const renderSelectedOptions = () => {
    if (readOnly && selectedRegions && selectedRegions.length > 0) {
      return selectedRegions.map((region) => region.label).join(', ');
    } else if (!readOnly && selectedOptions && selectedOptions.length > 0) {
      return selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} seleccionadas`;
    }
    return placeholder;
  };

  return (
    <div
      className={`input-container ${readOnly ? 'readonly' : ''}`}
      ref={dropdownRef}
    >
      <label className="text-sans-h5 input-label">{label}</label>
      <button
        type="button"
        onClick={!readOnly ? handleDropdownClick : undefined}
        className={`text-sans-p dropdown-btn ${readOnly ? 'disabled' : ''}`}
        ref={toggleRef}
      >
        {renderSelectedOptions()}
        {!readOnly && (
          <i className="material-symbols-rounded ms-2">
            {isOpen ? 'expand_less' : 'expand_more'}
          </i>
        )}
      </button>

      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column dropdown-container">
          <button
            type="button"
            className={`text-sans-p btn-option ${
              selectedOptions.length > 0 ? 'active' : ''
            }`}
            onClick={() => handleCheckboxChange('Todas')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`text-sans-p btn-option ${
              selectedOptions.length === 0 ? 'active' : ''
            }`}
            onClick={() => handleCheckboxChange('Eliminar Selección')}
          >
            Eliminar Selección
          </button>
          {options.map((option) => (
            <label
              className={
                selectedOptions.some((opt) => opt.value === option.value)
                  ? 'selected-option'
                  : 'unselected-option'
              }
              key={option.value}
            >
              <input
                className="my-3 mx-3 p-3"
                type="checkbox"
                value={option.value}
                checked={selectedOptions.some(
                  (opt) => opt.value === option.value
                )}
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
