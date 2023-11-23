
import React, { useState, useRef, useEffect } from 'react';


const DropdownCheckboxUsuarios = ({ label, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    const updatedSelection = [...selectedOptions];
    const optionIndex = updatedSelection.indexOf(option);
    if (optionIndex !== -1) {
      updatedSelection.splice(optionIndex, 1);
    } else {
      updatedSelection.push(option);
    }
    setSelectedOptions(updatedSelection);
    console.log("Selección desde el componente", updatedSelection);
  };

  const filteredOptions = options.filter((optionGroup) => {
    const groupLabel = typeof optionGroup === 'object' ? optionGroup.label : optionGroup;
    const searchTextLower = searchTerm.toLowerCase();

    return groupLabel.toLowerCase().includes(searchTextLower);
  });

  return (
    <div className="input-container">
      <label className="text-sans-h5 input-label">{label}</label>
      <button onClick={toggleDropdown} className="text-sans-p dropdown-btn">
        {isOpen ? (
          <input
            className="ghost-input"
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        ) : (
          <span>{placeholder}</span>
        )}
        <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
      </button>

      {isOpen && (
        <div className="dropdown d-flex flex-column unselected-option" ref={dropdownRef}>
          {filteredOptions.map((optionGroup, index) => (

            <div key={index}>

            <React.Fragment key={index}>
              <div className="group-label unselected-option py-2 ps-3 d-flex"><p className="me-1 mb-0">Usuarios</p>{optionGroup.label}</div>
              {optionGroup.options && optionGroup.options.map((option) => (
                <label
                  className={selectedOptions.includes(option) ? 'selected-option-ghost' : 'unselected-option-ghost'}
                  key={typeof option === 'object' ? option.id : option}
                >
                  <input
                    className="ms-2 me-2 my-3"
                    type="checkbox"
                    value={typeof option === 'object' ? option.id : option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {typeof option === 'object' ? option.nombre : option}
                </label>
              ))}

            </div>

            </React.Fragment>
          ))}
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div className="mb-5 mt-5">
          <table>
            <thead className="">
              <tr className="">
                <th className="col-1"> <p className="ms-4">#</p> </th>
                <th className="col-5"> <p >Usuario</p> </th>
                <th className="col-1"> <p className="ms-2">Acción</p> </th>
              </tr>
            </thead>
            <tbody>
              {selectedOptions.map((usuario, index) => {
                const usuarioNombre = usuario ? usuario.nombre : `Competencia ${usuario}`;
                console.log(usuario)

                return (
                  <tr key={usuario.id} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                    <td> <p className="ms-4 my-3">{index + 1}</p> </td>
                    <td> <p className="my-3">{usuarioNombre}</p> </td>
                    <td>
                      <button className="btn-terciario-ghost" onClick={() => handleCheckboxChange(usuario)}>
                        <p className="mb-0 text-decoration-underline">Eliminar</p>
                        <i className="material-symbols-rounded ms-2">delete</i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default DropdownCheckboxUsuarios;