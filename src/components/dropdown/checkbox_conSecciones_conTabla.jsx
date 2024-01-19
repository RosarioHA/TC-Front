import React, { useState, useRef, useEffect , useMemo, useCallback} from 'react';
import { debounce } from 'lodash';


const DropdownConSecciones = ({ label, placeholder, options, readOnly,  onUsuariosTransformed}) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ selectedOptions, setSelectedOptions ] = useState({});
  const dropdownRef = useRef(null);


  useEffect(() =>
  {
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
  }, [ isOpen ]);

  const toggleDropdown = () =>
  {
    setIsOpen(!isOpen);
  };



  const handleCheckboxChange = (option) =>
  {
    const perfil = option.perfil; // Asumiendo que cada 'option' tiene un perfil
    let updatedSelection = { ...selectedOptions };

    if (!updatedSelection[ perfil ])
    {
      updatedSelection[ perfil ] = [];
    }

    const optionIndex = updatedSelection[ perfil ].findIndex(
      (selectedOption) => selectedOption.id === option.id
    );

    if (optionIndex !== -1)
    {
      updatedSelection[ perfil ].splice(optionIndex, 1);
    } else
    {
      updatedSelection[ perfil ].push(option);
    }

    setSelectedOptions(updatedSelection);
  };

  console.log(selectedOptions)

  const filteredOptions = options.filter((optionGroup) =>
  {
    const searchTextLower = searchTerm.toLowerCase();

    return optionGroup.label.toLowerCase().includes(searchTextLower) ||
      optionGroup.options.some(option => option.nombre.toLowerCase().includes(searchTextLower));
  });

  const transformSelectedOptionsForProfiles = (selectedOptions) => {
    let transformed = {
      usuarios_subdere: [],
      usuarios_dipres: [],
      usuarios_sectoriales: [],
      usuarios_gore: []
    };
  
    // Recorre cada grupo de opciones y llena los arrays correspondientes
    for (let perfil in selectedOptions) {
      selectedOptions[perfil].forEach(option => {
        // Maneja el caso especial para "Usuario Sectorial"
        let key;
        if (perfil === "Usuario Sectorial") {
          key = "usuarios_sectoriales";
        } else {
          key = `usuarios_${perfil.toLowerCase()}`;
        }
  
        if (transformed[key] !== undefined) {
          transformed[key].push(option.id);
        }
      });
    }
  
    return transformed;
  };
  
  const transformedOptions = useMemo(() => {
    return transformSelectedOptionsForProfiles(selectedOptions);
  }, [selectedOptions]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnUsuariosTransformed = useCallback(debounce(onUsuariosTransformed, 500), []);
  
  useEffect(() => {
    if (typeof onUsuariosTransformed === 'function') {
      debouncedOnUsuariosTransformed(transformedOptions);
    }
  }, [transformedOptions, debouncedOnUsuariosTransformed, onUsuariosTransformed]);

  const renderTablaResumen = (users, tipoUsuario) =>
  {
    return (
      <div className="mb-5 mt-5">
        <p className="text-sans-p ms-2 mb-3">{`Usuarios ${tipoUsuario}`}</p>
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
    <div className={`input-container  col-11 ${readOnly ? 'readonly' : ''}`}>
      {readOnly ? (
        <>
          <label className="text-sans-h5 input-label">Usuario(s) Asignado(s):</label>
          {Object.keys(selectedOptions).some(tipo => selectedOptions[ tipo ].length > 0) ? (
            // Renderizar la tabla solo si hay usuarios asignados
            Object.keys(selectedOptions).map((tipo) =>
              renderTablaResumen(selectedOptions[ tipo ], tipo)
            )
          ) : (
            // Mostrar el mensaje si no hay usuarios asignados
            <p className="text-sans-p pt-4 ms-3">Sin usuarios asignados</p>
          )}
        </>
      ) : (
        <>
          <label className="text-sans-h5 input-label">{label}</label>
          <button type="button" onClick={toggleDropdown} className="text-sans-p dropdown-btn">
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
          <div className="d-flex mt-3 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6> Si aun no creas los usuarios para esta competencia, puedes crear la competencia y asignarle usuario más tarde. </h6>
          </div>
        </>
      )}

      {isOpen && (
        <div
          className="dropdown d-flex flex-column unselected-option"
          ref={dropdownRef}
        >
          {filteredOptions.map((optionGroup, index) => (
            <React.Fragment key={index}>
              <div className="group-label unselected-option py-2 ps-3 d-flex">
                <p className="me-1 mb-0">Usuarios</p>
                {optionGroup.label}
              </div>
              {optionGroup.options &&
                optionGroup.options.map((option) => (
                  <label
                    className={
                      selectedOptions[ option.perfil ] &&
                        selectedOptions[ option.perfil ].includes(option)
                        ? 'selected-option-ghost'
                        : 'unselected-option-ghost'
                    }
                    key={option.id}
                  >
                    <input
                      className="ms-2 me-2 my-3"
                      type="checkbox"
                      value={option.id}
                      checked={
                        selectedOptions[ option.perfil ] &&
                        selectedOptions[ option.perfil ].includes(option)
                      }
                      onChange={() => handleCheckboxChange(option)}
                    />
                    {/* Asegúrate de que aquí se utilice la propiedad nombre_completo */}
                    {option.nombre_completo}
                  </label>
                ))}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Tabla de selecciones */}
      {Object.keys(selectedOptions).map((tipoUsuario) =>
        renderTablaResumen(selectedOptions[ tipoUsuario ], tipoUsuario)
      )}
    </div>
  );
};

export default DropdownConSecciones;