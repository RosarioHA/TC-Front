import { useState, useRef, useEffect } from 'react';

export const DropdownSelectBuscadorCheck = ({ label, placeholder, options, onSelectionChange, readOnly }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const [ openSections, setOpenSections ] = useState({});
  const [ hasOpened, setHasOpened ] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() =>
  {
    if (isOpen && !hasOpened)
    {
      setHasOpened(true);
      const searchInput = dropdownRef.current.querySelector('.ghost-input');
      if (searchInput)
      {
        searchInput.focus();
      }
    }
    const handleDocumentClick = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // Agregar un event listener al documento para el clic fuera del dropdown
    document.addEventListener('mousedown', handleDocumentClick);
    return () =>
    {
      // Remover el event listener al desmontar el componente
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [ isOpen, hasOpened ]);

  const toggleDropdown = () =>
  {
    if (!readOnly)
    {
      setIsOpen(!isOpen);
    }
  };

  const toggleSection = (label) =>
  {
    setOpenSections(prev => ({ ...prev, [ label ]: !prev[ label ] }));
  };


  const handleInputClick = (e) =>
  {
    e.stopPropagation();
  };
  
  const handleOptionClick = (sector) => {
    setSelectedOptions(prevSelectedOptions => {
      const isCurrentlySelected = prevSelectedOptions.some(option => option.value === sector.value);
      const newSelectedOptions = isCurrentlySelected
        ? prevSelectedOptions.filter(option => option.value !== sector.value)
        : [...prevSelectedOptions, sector];
  
      if (onSelectionChange) {
        onSelectionChange(newSelectedOptions.map(option => option.value));
      }
  
      return newSelectedOptions;
    });
  };

  const isOptionSelected = (option) => selectedOptions.some(selectedOption => selectedOption.value === option.value);

  const filteredOptions = options.reduce((acc, ministerio) =>
  {
    // Verificar si el ministerio coincide con el término de búsqueda
    const isMinisterioMatch = ministerio.label.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrar los sectores que coinciden con el término de búsqueda
    const matchingSectors = ministerio.options.filter(sector =>
      sector.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isMinisterioMatch || matchingSectors.length > 0)
    {
      acc.push({
        ...ministerio,
        // Solo incluir los sectores que coinciden si el ministerio en sí no coincide
        options: isMinisterioMatch ? ministerio.options : matchingSectors
      });
    }

    return acc;
  }, []);

  const isMinisterioSelected = (ministerio) => {
    return ministerio.options.some(sector => 
      selectedOptions.some(selectedOption => selectedOption.value === sector.value)
    );
  };

  const clearSelections = () =>
  {
    setSelectedOptions([]);
    setOpenSections({});
    onSelectionChange([]);
  };
  


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
          className={`text-sans-p dropdown-btn ${isOpen ? "dropdown-btn-abierto" : ""} ${readOnly ? "disabled" : ""}`}
        >
          <span>{selectedOptions.length > 0 ? `${selectedOptions.length} seleccionado(s)` : placeholder}</span>
          {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
        </button>
      )}
      {isOpen && (
        <div className="dropdown d-flex flex-column p-2 dropdown-container" ref={dropdownRef}>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              className="btn-clear-selections text-sans-p btn-option "
              onClick={clearSelections}
            >
              Limpiar Selecciones
            </button>
          )}
          {filteredOptions.map((ministerio) => (
            <div key={ministerio.label} className="dropdown-ministerio">
              <div
                className={`d-flex justify-content-between align-items-center dropdown-option-check py-2 my-2 ${openSections[ ministerio.label ] ? 'active' : ''}`}
                onClick={() => toggleSection(ministerio.label)}
              >
                <input
                  type="checkbox"
                  className="checkbox-custom my-1"
                  checked={isMinisterioSelected(ministerio)}
                  readOnly
                />
                <label className="flex-grow-1">{ministerio.label}</label>
                <span className="material-symbols-outlined">
                  {openSections[ ministerio.label ] ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {openSections[ ministerio.label ] && (
                <div className="dropdown-sectores my-2">
                  {ministerio.options.map((sector) => (
                    <label key={sector.value} className="dropdown-sector py-1">
                      <input
                        type="checkbox"
                        className={`checkbox-custom  ${selectedOptions.includes(sector) ? 'selected-option' : 'unselected-option'}`}
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
