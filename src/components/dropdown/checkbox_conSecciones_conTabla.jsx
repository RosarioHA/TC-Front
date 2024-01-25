import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

const DropdownConSecciones = ({ label, placeholder, options, readOnly, onUsuariosTransformed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const onSearchTermChange = e => setSearchTerm(e.target.value);

  const handleCheckboxChange = option => {
    const perfil = option.perfil;
    const updatedSelection = { ...selectedOptions, [perfil]: (selectedOptions[perfil] || []).filter(o => o.id !== option.id) };

    if (!selectedOptions[perfil]?.includes(option)) {
      updatedSelection[perfil] = [...(updatedSelection[perfil] || []), option];
    }

    setSelectedOptions(updatedSelection);
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options; // Retorna todas las opciones si no hay término de búsqueda
  
    const searchTextLower = searchTerm.toLowerCase();
    return options.map(optionGroup => ({
      ...optionGroup,
      options: optionGroup.options.filter(option =>
        option.nombre_completo && option.nombre_completo.toLowerCase().includes(searchTextLower)
      )
    })).filter(optionGroup => optionGroup.options.length > 0);
  }, [options, searchTerm]);


  const transformSelectedOptionsForProfiles = (selectedOptions) =>
  {
    let transformed = {
      usuarios_subdere: [],
      usuarios_dipres: [],
      usuarios_sectoriales: [],
      usuarios_gore: []
    };

    // Recorre cada grupo de opciones y llena los arrays correspondientes
    for (let perfil in selectedOptions)
    {
      selectedOptions[ perfil ].forEach(option =>
      {
        // Maneja el caso especial para "Usuario Sectorial"
        let key;
        if (perfil === "Usuario Sectorial")
        {
          key = "usuarios_sectoriales";
        } else
        {
          key = `usuarios_${perfil.toLowerCase()}`;
        }

        if (transformed[ key ] !== undefined)
        {
          transformed[ key ].push(option.id);
        }
      });
    }

    return transformed;
  };

  const transformedOptions = useMemo(() =>
  {
    return transformSelectedOptionsForProfiles(selectedOptions);
  }, [ selectedOptions ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnUsuariosTransformed = useCallback(debounce(onUsuariosTransformed, 500), []);

  useEffect(() =>
  {
    if (typeof onUsuariosTransformed === 'function')
    {
      debouncedOnUsuariosTransformed(transformedOptions);
    }
  }, [ transformedOptions, debouncedOnUsuariosTransformed, onUsuariosTransformed ]);

  const renderTablaResumen = (users, tipoUsuario) =>
  {
    return (
      <div className="mb-5 mt-5">
        <p className="text-sans-p-bold ms-2 mb-3">{tipoUsuario}</p>
        <table>
          <thead>
            <tr>
              <th className="col-1"><p className="ms-4">#</p></th>
              <th className="col-5"><p>Usuario</p></th>
              {!readOnly && <th className="col-1"><p className="ms-2">Acción</p></th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                <td><p className="ms-4 my-3">{index + 1}</p></td>
                <td><p className="my-3">{user.nombre_completo}</p></td>
                {!readOnly && (
                  <td>
                    <button
                      type="button"
                      className="btn-terciario-ghost"
                      onClick={() => handleCheckboxChange(user)}
                    >
                      <p className="mb-0 text-decoration-underline">Eliminar</p>
                      <i className="material-symbols-rounded ms-2">delete</i>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`input-container col-11 ${readOnly ? 'readonly' : ''}`}>
      {readOnly ? (
        <>
          <label className="text-sans-h5 input-label">Usuario(s) Asignado(s):</label>
          {Object.keys(selectedOptions).some(tipo => selectedOptions[tipo].length > 0) ? (
            Object.keys(selectedOptions).map((tipo) =>
              renderTablaResumen(selectedOptions[tipo], tipo)
            )
          ) : (
            <p className="text-sans-p pt-4 ms-3">Sin usuarios asignados</p>
          )}
        </>
      ) : (
        <>
          <label className="text-sans-h5 input-label">{label}</label>
          <div
            className={`dropdown-btn ${isOpen ? 'dropdown-btn-abierto' : ''}`}
            onClick={toggleDropdown}
          >
            {isOpen ? (
              <input
                type="search"
                placeholder="Buscar usuario por nombre"
                className="ghost-input"
                value={searchTerm}
                onChange={onSearchTermChange}
                autoFocus
              />
            ) : (
              <span>{placeholder}</span>
            )}
            <i className="material-symbols-rounded ms-2">{isOpen ? 'expand_less' : 'expand_more'}</i>
          </div>
          <div className="d-flex mt-3 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6>Si aún no creas los usuarios para esta competencia, puedes crear la competencia y asignarle usuario más tarde.</h6>
          </div>
        </>
      )}
  
      {isOpen && (
        <div className="dropdown d-flex flex-column p-2 dropdown-container" ref={dropdownRef}>
          {filteredOptions.map((optionGroup) => (
            <React.Fragment key={optionGroup.id}>
              <div className="group-label unselected-option py-2 ps-3 d-flex border-bottom border-top">
                <label className="me-1 mb-0 text-sans-p-bold">{optionGroup.label}</label>
              </div>
              {optionGroup.options.map((option) => (
                <label
                  className={`${selectedOptions[option.perfil]?.includes(option) ? 'selected-option-ghost' : 'unselected-option-ghost'}`}
                  key={option.id}
                >
                  <input
                    className="checkbox ms-4 me-2 my-3"
                    type="checkbox"
                    value={option.id}
                    checked={selectedOptions[option.perfil]?.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {option.nombre_completo}
                </label>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
  
      {/* Tabla de selecciones */}
      {Object.keys(selectedOptions).map((tipoUsuario) =>
        selectedOptions[tipoUsuario].length > 0 && renderTablaResumen(selectedOptions[tipoUsuario], tipoUsuario)
      )}
    </div>
  );
  
};

export default DropdownConSecciones;