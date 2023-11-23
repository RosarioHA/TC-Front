import { useState, useRef, useEffect } from 'react';



const DropdownSelectBuscador = ({ label, placeholder, options, onSelectionChange }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ selectedOption, setSelectedOption ] = useState(null);
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

    function handleClickOutside(event)
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      {
        setIsOpen(false);
      }
    }

    if (isOpen)
    {
      document.addEventListener('mousedown', handleClickOutside);
    } else
    {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () =>
    {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ isOpen, hasOpened ]);

  const toggleDropdown = () =>
  {
    setIsOpen(!isOpen);
  };

  const handleInputClick = (e) =>
  {
    // Previene que el evento se propague al botón
    e.stopPropagation();
  };

  const handleOptionClick = (option) =>
  {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectionChange(option.value);
  };

  // Filtrar opciones segun termino de busqueda
  const filteredOptions = options.filter((option) =>
  option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="input-container">
      <label className="text-sans-h5 input-label">{label}</label>
      {isOpen ? (
        <input
          className="ghost-input dropdown-btn"
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleInputClick}
          autoFocus
        />
      ) : (
        <button onClick={toggleDropdown} className="text-sans-p dropdown-btn">
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <i className="material-symbols-rounded ms-2">
            {isOpen ? 'expand_less' : 'expand_more'}
          </i>
        </button>
      )}

      {isOpen && (
          <div className="dropdown d-flex flex-column" ref={dropdownRef}>
            {filteredOptions.map((option) => (
              <label
                className={selectedOption && selectedOption.value === option.value ? 'selected-option' : 'unselected-option'}
                key={option.value}
              >
                <div
                  className="ms-2 me-2 my-3"
                  onClick={() => handleOptionClick(option)}
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
