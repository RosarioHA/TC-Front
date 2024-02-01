import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

const DropdownConSecciones = ({
  label,
  placeholder,
  options,
  readOnly,
  onUsuariosTransformed,
  usuariosCompetencia,
}) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  console.log('usetab', usuariosCompetencia);

  useEffect(() => {
    console.log('usuariosCompetencia:', usuariosCompetencia);
  }, [usuariosCompetencia]);

  // Cierra el dropdown si se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const onSearchTermChange = (e) => setSearchTerm(e.target.value);

  // Maneja el cambio de selección en las casillas de verificación
  const handleCheckboxChange = (option) => {
    const perfil = option.perfil;
    const updatedSelection = {
      ...selectedOptions,
      [perfil]: (selectedOptions[perfil] || []).filter(
        (o) => o.id !== option.id
      ),
    };

    if (!selectedOptions[perfil]?.includes(option)) {
      updatedSelection[perfil] = [...(updatedSelection[perfil] || []), option];
    }

    setSelectedOptions(updatedSelection);
  };

  // Filtra las opciones basadas en el término de búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    const searchTextLower = searchTerm.toLowerCase();
    return options
      .map((optionGroup) => ({
        ...optionGroup,
        options: optionGroup.options.filter(
          (option) =>
            option.nombre_completo &&
            option.nombre_completo.toLowerCase().includes(searchTextLower)
        ),
      }))
      .filter((optionGroup) => optionGroup.options.length > 0);
  }, [options, searchTerm]);

  // Transforma las opciones seleccionadas para perfiles
  const transformSelectedOptionsForProfiles = useCallback((selectedOptions) => {
    let transformed = {
      usuarios_subdere: [],
      usuarios_dipres: [],
      usuarios_sectoriales: [],
      usuarios_gore: [],
    };

    for (let perfil in selectedOptions) {
      selectedOptions[perfil].forEach((option) => {
        let key =
          perfil === 'Usuario Sectorial'
            ? 'usuarios_sectoriales'
            : `usuarios_${perfil.toLowerCase()}`;
        transformed[key].push(option.id);
      });
    }

    return transformed;
  }, []);



  useEffect(() => {
    if (typeof onUsuariosTransformed === 'function') {
      const transformed = transformSelectedOptionsForProfiles(selectedOptions);
      onUsuariosTransformed(transformed); // Directamente llamando a onUsuariosTransformed
    }
  }, [selectedOptions, transformSelectedOptionsForProfiles, onUsuariosTransformed]);


  const agruparUsuariosPorPerfil = (usuarios) => {
    const usuariosAgrupados = {};

    usuarios.forEach((usuario) => {
      const perfil = usuario.perfil;
      if (!usuariosAgrupados[perfil]) {
        usuariosAgrupados[perfil] = [];
      }
      // Asegúrate de que no se agreguen duplicados
      if (!usuariosAgrupados[perfil].find((u) => u.id === usuario.id)) {
        usuariosAgrupados[perfil].push(usuario);
      }
    });

    return usuariosAgrupados;
  };

  const usuariosPorPerfil = usuariosCompetencia
    ? agruparUsuariosPorPerfil(usuariosCompetencia)
    : {};

    const inicializarUsuarios = (usuarios) => {
      const usuariosInicializados = {};
      usuarios.forEach((usuario) => {
        if (!usuariosInicializados[usuario.perfil]) {
          usuariosInicializados[usuario.perfil] = [];
        }
        if (!usuariosInicializados[usuario.perfil].some((u) => u.id === usuario.id)) {
          usuariosInicializados[usuario.perfil].push(usuario);
        }
      });
      return usuariosInicializados;
    };

    useEffect(() => {
      if (usuariosCompetencia) {
        const usuariosInicializados = inicializarUsuarios(usuariosCompetencia);
        setSelectedOptions(usuariosInicializados);
      }
    }, [usuariosCompetencia]);

  console.log('Usuarios Competencia: ', usuariosCompetencia);
  console.log('Selected Options: ', selectedOptions);
  console.log('Usuarios Por Perfil: ', usuariosPorPerfil);

  // Renderiza la tabla resumen
  const renderTablaResumen = (usuarios, tipoUsuario, tipoPerfil) => {
    if (!usuarios || usuarios.length === 0) {
      return null; // No hay usuarios para este tipo de perfil
    }

    return (
      <div className="mb-5 mt-5">
        <p className="text-sans-p-bold ms-2 mb-3">
          {tipoUsuario || tipoPerfil}
        </p>
        <table>
          <thead>
            <tr>
              <th className="col-1">
                <p className="ms-4">#</p>
              </th>
              <th className="col-5">
                <p>Usuario</p>
              </th>
              {!readOnly && (
                <th className="col-1">
                  <p className="ms-2">Acción</p>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? 'neutral-line' : 'white-line'}
              >
                <td>
                  <p className="ms-4 my-3">{index + 1}</p>
                </td>
                <td>
                  <p className="my-3">{user.nombre_completo}</p>
                </td>
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
        <div className="pt-3">
          <label className="text-sans-h5 input-label">
            Usuario(s) Asignado(s):
          </label>
          {readOnly &&
            (Object.keys(usuariosPorPerfil).length > 0 ? (
              Object.keys(usuariosPorPerfil).map((perfil) =>
                renderTablaResumen(usuariosPorPerfil[perfil], perfil)
              )
            ) : (
              <p className="text-sans-p pt-4 ms-3">Sin usuarios asignados</p>
            ))}
        </div>
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
            <i className="material-symbols-rounded ms-2">
              {isOpen ? 'expand_less' : 'expand_more'}
            </i>
          </div>
          <div className="d-flex mt-3 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6>
              Si aún no creas los usuarios para esta competencia, puedes crear
              la competencia y asignarle usuario más tarde.
            </h6>
          </div>
        </>
      )}

      {isOpen && (
        <div
          className="dropdown d-flex flex-column p-2 dropdown-container"
          ref={dropdownRef}
        >
          {filteredOptions.map((optionGroup) => (
            <React.Fragment key={optionGroup.id}>
              <div className="group-label unselected-option py-2 ps-3 d-flex border-bottom border-top">
                <label className="me-1 mb-0 text-sans-p-bold">
                  {optionGroup.label}
                </label>
              </div>
              {optionGroup.options.map((option) => (
                <label
                  className={`${
                    selectedOptions[option.perfil]?.includes(option)
                      ? 'selected-option-ghost'
                      : 'unselected-option-ghost'
                  }`}
                  key={`${optionGroup.id}-${option.id}`}
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
      {/* Mostrar la tabla de selecciones en modo editar también */}
      {Object.keys(selectedOptions).map(
        (tipoUsuario) =>
          selectedOptions[tipoUsuario].length > 0 &&
          renderTablaResumen(selectedOptions[tipoUsuario], tipoUsuario)
      )}
    </div>
  );
};

export default DropdownConSecciones;
