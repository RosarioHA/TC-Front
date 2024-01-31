import { useState, useRef, useEffect } from 'react';

export const DropdownSelectBuscadorUnico = ({ label, placeholder, options, onSelectionChange, readOnly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [openSections, setOpenSections] = useState({});
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
    const handleDocumentClick = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen, hasOpened]);

  const toggleDropdown = () => {
    if (!readOnly) {
      setIsOpen(!isOpen);
    }
  };

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (onSelectionChange) {
      onSelectionChange(option.value);
    }

    setIsOpen(false); // Cierra el dropdown después de seleccionar
  };

  const isOptionSelected = (option) => selectedOption && option.value === selectedOption.value;

  const filteredOptions = options.reduce((acc, ministerio) => {
    const isMinisterioMatch = ministerio.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingSectors = ministerio.options.filter(sector =>
      sector.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isMinisterioMatch || matchingSectors.length > 0) {
      acc.push({
        ...ministerio,
        options: isMinisterioMatch ? ministerio.options : matchingSectors
      });
    }

    return acc;
  }, []);

  const clearSelection = () => {
    setSelectedOption(null);
    setOpenSections({});
    onSelectionChange(null);
  };

  return (
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
      <label className="text-sans-h5 input-label">{label}</label>
      {isOpen ? (
        <input
          className={`ghost-input dropdown-btn ${isOpen ? "dropdown-btn-abierto" : ""}`}
          type="search"
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
          className={`text-sans-p dropdown-btn ${isOpen ? "dropdown-btn-abierto" : ""} ${readOnly ? "disabled" : ""}`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
        </button>
      )}
      {isOpen && (
        <div className="dropdown d-flex flex-column p-2 dropdown-container" ref={dropdownRef}>
          {selectedOption && (
            <button
              type="button"
              className="btn-clear-selections text-sans-p btn-option"
              onClick={clearSelection}
            >
              Limpiar Selección
            </button>
          )}
          {filteredOptions.map((ministerio) => (
            <div key={ministerio.label} className="dropdown-ministerio">
              <div
                className={`d-flex justify-content-between align-items-center dropdown-option-check py-2 my-2 ${openSections[ministerio.label] ? 'active' : ''}`}
                onClick={() => toggleSection(ministerio.label)}
              >
                <label className="flex-grow-1">{ministerio.label}</label>
                <span className="material-symbols-outlined">
                  {openSections[ministerio.label] ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {openSections[ministerio.label] && (
                <div className="dropdown-sectores my-2">
                  {ministerio.options.map((sector) => (
                    <label key={sector.value} className="dropdown-sector py-1">
                      <input
                        type="checkbox"
                        className="checkbox-custom"
                        checked={isOptionSelected(sector)}
                        onChange={() => handleOptionClick(sector)}
                      />
                      {sector.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
