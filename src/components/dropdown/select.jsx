import { useState, useRef, useEffect } from 'react';

const DropdownSelect = ({ label, placeholder, options, onSelectionChange, selected, readOnly }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedOption, setSelectedOption ] = useState(null);
  const dropdownRef = useRef(null);

  // Inicialización y actualización de selectedOption
  useEffect(() => {
    // Si 'selected' es un objeto (como en CreacionUsuario)
    if (selected && typeof selected === 'object') {
      setSelectedOption(selected);
    }
    // Si 'selected' es un valor simple (como en Subpaso_CuatroUno)
    else if (selected) {
      const option = options.find(o => o.value === selected);
      setSelectedOption(option || null);
    }
  }, [ selected, options ]);

  useEffect(() => {
    function handleDocumentClick(event) {
      // Si el clic ocurre fuera del dropdown y del botón, cerrar el dropdown
      if (!dropdownRef.current.contains(event.target) && event.target.id !== 'abreDropdownSelect') {
        setIsOpen(false);
      }
    }

    // Agregar un event listener al documento para el clic fuera del dropdown
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      // Remover el event listener al desmontar el componente
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectionChange(option);
  };
  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
      <label className="text-sans-h5 input-label">{label}</label>
      <button
        type="button"
        id="abreDropdownSelect"
        onClick={toggleDropdown}
        className={`text-sans-p dropdown-btn ${readOnly ? "disabled" : ""}`}
      >
        {selectedOption ? selectedOption.label : placeholder}
        {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
      </button>
      {isOpen && !readOnly && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`p-3 ${option.value === selectedOption?.value ? 'selected-option' : 'unselected-option'}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;