import { useState, useRef, useEffect, useCallback } from 'react';

const DropdownCheckbox = ({
  label,
  options,
  placeholder,
  readOnly,
  selectedValues,
  onSelectionChange,
  loading,
  saved,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(() => selectedValues || []);
  const [userHasMadeSelection, setUserHasMadeSelection] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    setSelectedOptions(selectedValues || []);
  }, [selectedValues]);
  

  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target)
    ) {
      if (isOpen) {
        setIsOpen(false);
        // Notificar al componente padre cuando el dropdown se cierra
        if (userHasMadeSelection && onSelectionChange) {
          onSelectionChange(selectedOptions);
        }
      }
    }
  }, [isOpen, selectedOptions, userHasMadeSelection, onSelectionChange]);
  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);


  useEffect(() => {
    // Actualizar solo si el usuario no ha hecho ninguna selección
    if (selectedValues && !userHasMadeSelection) {
      setSelectedOptions(selectedValues);
    }
  }, [selectedValues, userHasMadeSelection]);

  const handleDropdownClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleCheckboxChange = useCallback((option) => {
    if (readOnly) return;
    let newSelectedOptions;
  
    if (option === 'Todas') {
      newSelectedOptions = options.filter(opt => opt.label !== 'Sin opción asociada');
    } else if (option === 'Eliminar Selección') {
      newSelectedOptions = [];
    } else {
      const index = selectedOptions.findIndex(opt => opt.value === option.value);
      if (index > -1) {
        newSelectedOptions = [
          ...selectedOptions.slice(0, index),
          ...selectedOptions.slice(index + 1)
        ];
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    }
  
    if (JSON.stringify(newSelectedOptions) !== JSON.stringify(selectedOptions)) {
      setSelectedOptions(newSelectedOptions);
      setUserHasMadeSelection(true);
      if (onSelectionChange) {
        onSelectionChange(newSelectedOptions);
      }
    }
  }, [selectedOptions, options, onSelectionChange, readOnly]);
  


  const renderSelectedOptions = () => {
    if (readOnly && selectedValues && selectedValues.length > 0) {
      return selectedValues.map((value) => value.label).join(', ');
    } else if (!readOnly && selectedOptions && selectedOptions.length > 0) {
      return selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} seleccionadas`;
    }
    return placeholder;
  };

  const renderSpinnerOrCheck = () => {
    if (loading) {
      return <div className="spinner-border text-primary align-self-end" role="status"></div>;
    }
    if (saved) {
      return <i className="material-symbols-outlined align-self-end">check</i>;
    }
    return null;
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

      <div className="col-1 p-0 d-flex ms-2">
        {renderSpinnerOrCheck()}
      </div>
      <div className="col-2 d-flex justify-content-between ">
        {error && (
          <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
        )}
      </div>  

      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column dropdown-menu dropdown-container p-0">
          <button
            type="button"
            className={`text-sans-p btn-option ${selectedOptions.length > 0 ? 'active' : ''
              }`}
            onClick={() => handleCheckboxChange('Todas')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`text-sans-p btn-option ${selectedOptions.length === 0 ? 'active' : ''
              }`}
            onClick={() => handleCheckboxChange('Eliminar Selección')}
          >
            Eliminar Selección
          </button>
          {options.map((option) => (
            <label
              className={
                selectedOptions.some((opt) => opt.value === option.value)
                  ? 'selected- p-2'
                  : 'unselected-option p-2'
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
