import { useState, useRef, useEffect } from 'react';

//input search 
const normalizeText = (text) =>
{
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};


export const DropdownSelectBuscadorCheck = ({ label, placeholder, options, onSelectionChange, readOnly, selectedReadOnlyOptions, editMode, competencia }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const [ openSections, setOpenSections ] = useState({});
  const [ hasOpened, setHasOpened ] = useState(false);
  const dropdownRef = useRef(null);

  // Actualizado: Cambio en la lógica de establecer las opciones seleccionadas
  useEffect(() =>
  {
    let newSelectedOptions = [];
    if (readOnly)
    {
      newSelectedOptions = selectedReadOnlyOptions;
    } else if (editMode && competencia)
    {
      newSelectedOptions = competencia.sectores.map(sector => ({
        label: sector.nombre,
        value: sector.id
      }));
    }
    setSelectedOptions(newSelectedOptions);
  }, [ readOnly, editMode, selectedReadOnlyOptions, competencia ]);

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
    const handleDocumentClick = event =>
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    // Agregar un event listener al documento para el clic fuera del dropdown
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
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


  useEffect(() =>
  {
    if (editMode && competencia)
    {
      // Carga inicial de sectores preseleccionados
      const preselectedSectors = competencia.sectores.map(sector => ({
        label: sector.nombre,
        value: sector.id
      }));
      setSelectedOptions(preselectedSectors);
    }
  }, [ editMode, competencia ]);

  const handleOptionClick = (sector) =>
  {
    if (!readOnly)
    {
      const isSelected = selectedOptions.some(option => option.value === sector.value);
      let newSelectedOptions = isSelected
        ? selectedOptions.filter(option => option.value !== sector.value)
        : [ ...selectedOptions, sector ];

      setSelectedOptions(newSelectedOptions);
      if (onSelectionChange)
      {
        onSelectionChange(newSelectedOptions); // Notificar al padre
      }
    }
  };

  const isOptionSelected = (option) =>
  {
    return selectedOptions.some(selectedOption => selectedOption.value === option.value);
  };

  const filteredOptions = options.reduce((acc, ministerio) =>
  {
    const searchTermNormalized = normalizeText(searchTerm);

    // Comparar con el término de búsqueda normalizado
    const isMinisterioMatch = normalizeText(ministerio.label).includes(searchTermNormalized);
    const matchingSectors = ministerio.options.filter(sector =>
      normalizeText(sector.label).includes(searchTermNormalized)
    );

    if (isMinisterioMatch || matchingSectors.length > 0)
    {
      acc.push({
        ...ministerio,
        options: isMinisterioMatch ? ministerio.options : matchingSectors
      });
    }

    return acc;
  }, []);

  const isMinisterioSelected = (ministerio) =>
  {
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

  const handleSearchKeyDown = (e) =>
  {
    if (e.key === 'Enter')
    {
      // Lógica para Enter, si es necesaria
    } else if (e.key === 'Tab')
    {
      setSearchTerm(''); // Limpiar la búsqueda al presionar Tab
    }
  };

  // Actualizar openSections basado en los resultados de búsqueda
  useEffect(() =>
  {
    const searchTermNormalized = normalizeText(searchTerm);

    // Solo actualizar openSections si searchTerm no está vacío
    if (searchTermNormalized)
    {
      const newOpenSections = options.reduce((acc, ministerio) =>
      {
        const isMinisterioMatch = normalizeText(ministerio.label).includes(searchTermNormalized);
        const matchingSectors = ministerio.options.some(sector =>
          normalizeText(sector.label).includes(searchTermNormalized)
        );

        if (isMinisterioMatch || matchingSectors)
        {
          acc[ ministerio.label ] = true;
        }

        return acc;
      }, {});

      setOpenSections(newOpenSections);
    } else
    {
      setOpenSections({});
    }
  }, [ searchTerm, options ]);

  // Función para obtener el texto del botón
const getButtonText = () => {
  let optionsToDisplay = readOnly ? selectedReadOnlyOptions : selectedOptions;

  if (optionsToDisplay.length > 1) {
      return `${optionsToDisplay.length} sectores seleccionados`;
  } else if (optionsToDisplay.length === 1) {
      return optionsToDisplay[0].label;
  } else {
      return placeholder;
  }
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
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
      ) : (
        <button
          type="button"
          id="abreDropdownSelectBuscador"
          onClick={toggleDropdown}
          className={`text-sans-p dropdown-btn ${isOpen ? "dropdown-btn-abierto" : ""} ${readOnly ? "disabled" : ""}`}
        >
          <span>{getButtonText()}</span>
          {!readOnly && <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>}
        </button>
      )
      }
      {
        isOpen && (
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
        )
      }

    </div >
  );
};
