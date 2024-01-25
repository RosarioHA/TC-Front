import { useState, useRef, useEffect } from 'react';

const DropdownSelectBuscador = ({ label, placeholder, options, onSelectionChange, readOnly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      const searchInput = dropdownRef.current.querySelector('.ghost-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
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
  }, [isOpen, hasOpened]);

  const toggleDropdown = () => {
    if (!readOnly) {
      setIsOpen(!isOpen);
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectionChange(option);
  };

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
      <label className="text-sans-h5 input-label">{label}</label>
          {isOpen ? (
            <input
              className={`ghost-input dropdown-btn ${isOpen ? "dropdown-btn-abierto" : ""}`}
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={handleInputClick}
              autoFocus
            />
          ) : (
            <button
              type="button"
              id="abreDropdownSelectBuscador" 
              onClick={toggleDropdown} 
              className={`text-sans-p dropdown-btn ${isOpen ? "dropdown-btn-abierto": ""} ${readOnly ? "disabled" : ""}`}
            >
              <span>{selectedOption ? selectedOption.label : placeholder}</span>
              {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
            </button>
          )}

      {isOpen && (
        <div className="dropdown d-flex flex-column p-2 dropdown-container" ref={dropdownRef}>
          {filteredOptions.map((option) => (
            <label
              
              key={option.value}
            >
              <div
                //className="ms-2 me-2 my-3"
                onClick={() => handleOptionClick(option)}
                className={`p-3 dropdown-option text-sans-p ${option.value === selectedOption?.value ? 'selected-dropdown-option text-sans-p-white' : ''}`}
              >
                {option.label}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelectBuscador;