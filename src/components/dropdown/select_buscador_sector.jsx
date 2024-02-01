import { useState, useRef, useEffect, useMemo } from 'react';

const normalizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const DropdownSelectBuscadorUnico = ({
  label,
  placeholder,
  options,
  onSelectionChange,
  readOnly,
  sectorId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [hasOpened, setHasOpened] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (sectorId) {
      const findSectorAndMinisterioById = (id) => {
        for (const ministerio of options) {
          const sectorFound = ministerio.options.find(
            (sector) => sector.value === id
          );
          if (sectorFound) {
            return {
              label: sectorFound.label,
              value: sectorFound.value,
              ministerioLabel: ministerio.label,
            };
          }
        }
        return null;
      };

      const sectorAndMinisterio = findSectorAndMinisterioById(sectorId);
      if (sectorAndMinisterio) {
        setSelectedOption({
          label: sectorAndMinisterio.label,
          value: sectorAndMinisterio.value,
        });
        setOpenSections((prev) => ({
          ...prev,
          [sectorAndMinisterio.ministerioLabel]: true,
        }));
      }
    }
  }, [sectorId, options]);
  const toggleDropdown = () => {
    if (!readOnly) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      const searchInput = dropdownRef.current.querySelector('.ghost-input');
      if (searchInput) {
        searchInput.focus();
      }
    }

    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleDropdownClose();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen, hasOpened]);

  const handleDropdownClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setOpenSections({});
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const filteredOptions = useMemo(
    () =>
      options.reduce((acc, ministerio) => {
        const searchNormalized = normalizeText(searchTerm);
        const isMinisterioMatch = normalizeText(ministerio.label).includes(
          searchNormalized
        );
        const matchingSectors = ministerio.options.filter((sector) =>
          normalizeText(sector.label).includes(searchNormalized)
        );

        if (isMinisterioMatch || matchingSectors.length > 0) {
          acc.push({
            ...ministerio,
            options: isMinisterioMatch ? ministerio.options : matchingSectors,
          });
        }

        return acc;
      }, []),
    [searchTerm, options]
  );

  useEffect(() => {
    if (searchTerm) {
      const newOpenSections = filteredOptions.reduce((acc, ministerio) => {
        acc[ministerio.label] = true; // Abrir automáticamente las secciones que tienen coincidencias
        return acc;
      }, {});
      setOpenSections(newOpenSections);
    } else {
      setOpenSections({});
    }
  }, [filteredOptions, searchTerm]);

  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (onSelectionChange) {
      onSelectionChange(option.value); // Asegúrate de que esto envía el ID correctamente
    }
    setIsOpen(false);
  };

  const isOptionSelected = (option) =>
    selectedOption && option.value === selectedOption.value;

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
          className={`ghost-input dropdown-btn ${
            isOpen ? 'dropdown-btn-abierto' : ''
          }`}
          type="search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange} // Usar el nuevo manejador
          onClick={handleInputClick}
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={toggleDropdown}
          className={`text-sans-p dropdown-btn ${
            isOpen ? 'dropdown-btn-abierto' : ''
          }`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {!readOnly && (
            <i className="material-symbols-rounded ms-2">
              {isOpen ? 'expand_less' : 'expand_more'}
            </i>
          )}
        </button>
      )}
      {isOpen && (
        <div
          className="dropdown d-flex flex-column p-2 dropdown-container"
          ref={dropdownRef}
        >
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
                className={`d-flex justify-content-between align-items-center dropdown-option-check py-2 my-2 ${
                  openSections[ministerio.label] ? 'active' : ''
                }`}
                onClick={() => toggleSection(ministerio.label)}
              >
                <label className="flex-grow-1 ms-2">{ministerio.label}</label>
                <span className="material-symbols-outlined">
                  {openSections[ministerio.label]
                    ? 'expand_less'
                    : 'expand_more'}
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
