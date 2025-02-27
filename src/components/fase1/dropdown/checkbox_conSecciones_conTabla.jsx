import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

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
      [perfil]: selectedOptions[perfil] ? selectedOptions[perfil].filter(o => o.id !== option.id) : []
    };

    if (!selectedOptions[perfil] || !selectedOptions[perfil].some(o => o.id === option.id)) {
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
      usuarios_seguimiento: [],
    };

    for (let perfil in selectedOptions) {
      selectedOptions[perfil].forEach((option) => {
        let key;
        if (perfil === 'Usuario Sectorial') {
          key = 'usuarios_sectoriales';
        } else if (perfil === 'Usuario Seguimiento') {
          key = 'usuarios_seguimiento';
        } else {
          key = `usuarios_${perfil.toLowerCase()}`;
        }

        // Asegurarse de que exista el arreglo antes de hacer push
        if (!transformed[key]) {
          transformed[key] = [];
        }

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
  }, [
    selectedOptions,
    transformSelectedOptionsForProfiles,
    onUsuariosTransformed,
  ]);

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
      if (
        !usuariosInicializados[usuario.perfil].some((u) => u.id === usuario.id)
      ) {
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
  // Renderiza la tabla resumen
  const renderTablaResumen = (usuarios, tipoUsuario, tipoPerfil) => {
    if (!usuarios || usuarios.length === 0) {
      return null; // No hay usuarios para este tipo de perfil
    }

    return (
      <div className="mb-5 mt-5 col-12">
        <p className="text-sans-p-bold ms-2 mb-3">
          {tipoUsuario || tipoPerfil}
        </p>
        <table>
          <thead>
            <tr>
              <th className="col-1">
                <p className="ms-4">#</p>
              </th>
              <th className="col-11">
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
                  <p className="mx-4 my-3">{index + 1}</p>
                </td>
                <td className="col-7">
                  <span className="my-3 col-8">
                    {user.nombre_completo} {(user.sector_nombre || user.region_nombre) ? `- ${user.sector_nombre || user.region_nombre}` : ''}

                  </span>
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
    <div className={`input-container ${readOnly ? 'readonly' : ''}`}>
      {readOnly ? (
        <div className="pt-3 col-10">
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

        </>
      )}

      {isOpen && (
        <div
          className="dropdown d-flex flex-column p-2 dropdown-container"
          ref={dropdownRef}
        >
          {filteredOptions.map((optionGroup, index) => (
            <React.Fragment key={`group-${index}`}>
              <div key={optionGroup.id} className="group-label unselected-option py-2 ps-3 d-flex border-bottom border-top">
                <label className="me-1 mb-0 text-sans-p-bold">
                  {optionGroup.label}
                </label>
              </div>
              {optionGroup.options.map((option) => (
                <label
                  className={`${selectedOptions[option.perfil]?.includes(option)
                    ? 'selected-option-ghost'
                    : 'unselected-option-ghost'
                    }`}
                  key={`${optionGroup.id}-${option.id}`}
                >
                  <input
                    className="checkbox ms-4 me-2 my-3"
                    type="checkbox"
                    value={option.id}
                    checked={selectedOptions[option.perfil]?.some(selectedOption => selectedOption.id === option.id)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {option.nombre_completo} {(option.sector_nombre || option.region_nombre) ? `- ${option.sector_nombre || option.region_nombre}` : ''}
                </label>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
      {!readOnly &&
        Object.keys(selectedOptions).map(
          (tipoUsuario) =>
            selectedOptions[tipoUsuario].length > 0 &&
            renderTablaResumen(selectedOptions[tipoUsuario], tipoUsuario)
        )}
    </div>
  );
};

export default DropdownConSecciones;
