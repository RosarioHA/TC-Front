import { useState, useRef, useEffect, useCallback } from 'react';

export const DropdownCheckbox2 = ({
  label,
  options,
  placeholder,
  readOnly,
  selectedValues,
  onSelectionChange,
  loading,
  saved,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(selectedValues || []);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  // Este useEffect maneja la actualización de selectedOptions cuando selectedValues cambia.
  useEffect(() => {
    setSelectedOptions(selectedValues || []);
  }, [selectedValues]);

  // Función para manejar clics fuera del componente para cerrar el dropdown
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

  // Agrega y elimina el listener de clics fuera del componente
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (option) => {
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
          ...selectedOptions.slice(index + 1),
        ];
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    }

    setSelectedOptions(newSelectedOptions);
    if (onSelectionChange) {
      onSelectionChange(newSelectedOptions);
    }
  };

  // Función para renderizar opciones seleccionadas o placeholder
  const renderSelectedOptions = () => {
    if (readOnly && selectedValues && selectedValues.length > 0) {
      return selectedValues.map(value => value.label).join(', ');
    } else if (!readOnly && selectedOptions && selectedOptions.length > 0) {
      return selectedOptions.length === 1 ? selectedOptions[0].label : `${selectedOptions.length} seleccionadas`;
    }
    return placeholder;
  };

  // Función para renderizar un spinner o un check basado en el estado
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
    <div className={`input-container ${readOnly ? 'readonly' : ''}`} ref={dropdownRef}>
      <label className="text-sans-h5 input-label">{label}</label>
      <button
        type="button"
        onClick={handleDropdownClick}
        className={`text-sans-p dropdown-btn ${isOpen ? 'active' : ''} ${readOnly ? 'disabled' : ''}`}
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
      <div className="col-2 d-flex justify-content-between">
        {error && <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>}
      </div>
      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column dropdown-menu dropdown-container p-0">
          {options.map((option) => (
            <label className={` text-sans-p  my-1 ${selectedOptions.some(opt => opt.value === option.value) ? 'selected-option' : 'unselected-option'} p-2`} key={option.value}>
              <input
                type="checkbox"
                checked={selectedOptions.some(opt => opt.value === option.value)}
                onChange={() => handleCheckboxChange(option)}
                className="mx-2 my-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
