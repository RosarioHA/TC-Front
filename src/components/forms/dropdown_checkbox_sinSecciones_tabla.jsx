import { useState, useRef, useEffect } from 'react';

const DropdownSinSecciones = ({ label, placeholder, options, onSelectionChange, selectedOptions }) =>
{
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() =>
  {
    function handleClickOutside(event)
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      {
        // Hacer clic fuera del dropdown, cierra el dropdown y refleja las selecciones
        setIsOpen(false);
      }
    }
    if (isOpen)
    {
      // Agregar un event listener para cerrar el dropdown al hacer clic fuera de el
      document.addEventListener('mousedown', handleClickOutside);
    } else
    {
      // Remover el event listener cuando el dropdown esta cerrado
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () =>
    {
      // Limpieza al desmontar el componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ isOpen ]);

  const toggleDropdown = () =>
  {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (optionId) =>
  {
    const updatedOptions = [ ...selectedOptions ]; // Cambia de objeto a array

    const optionIndex = updatedOptions.indexOf(optionId);
    if (optionIndex !== -1)
    {
      // Si ya está en la lista, quítalo
      updatedOptions.splice(optionIndex, 1);
    } else
    {
      // Si no está en la lista, agrégalo
      updatedOptions.push(optionId);
    }
    onSelectionChange(updatedOptions);
  };

  const handleInputClick = (e) =>
  {
    e.preventDefault();
    e.stopPropagation();
    console.log("propagacion detenida en componente")
  };

  // Filtrar opciones segun termino de busqueda
  const filteredOptions = options.filter(option =>
    option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
          <span>{placeholder}</span>
          <i className="material-symbols-rounded ms-2">
            {isOpen ? 'expand_less' : 'expand_more'}
          </i>
        </button>
      )}

      {isOpen && (
        <div className="dropdown d-flex flex-column" ref={dropdownRef}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label
                className={selectedOptions.includes(option.id) ? 'selected-option' : 'unselected-option'}
                key={option.id}
              >
                <input
                  className="ms-2 me-2 my-3"
                  type="checkbox"
                  value={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id)}
                />
                {option.nombre}
              </label>
            ))
          ) : (
            <p>No se encontraron coincidencias</p>
          )}
        </div>
      )}

      <div className="d-flex mt-3 text-sans-h6-primary">
        <i className="material-symbols-rounded me-2">info</i>
        <h6 className="">Si la competencia no está creada, debes crearla primero y luego asociarle un usuario. </h6>
      </div>

      {selectedOptions.length > 0 && (
        <div className="mb-5 mt-5">
          <table>
            <thead className="">
              <tr className="">
                <th className="col-1"> <p className="ms-4">#</p> </th>
                <th className="col-5"> <p >Competencia</p> </th>
                <th className="col-1"> <p className="ms-2">Acción</p> </th>
              </tr>
            </thead>
            <tbody>
              {selectedOptions.map((competenciaId, index) =>
              {
                const competencia = options.find(comp => comp.id === parseInt(competenciaId));
                const competenciaNombre = competencia ? competencia.nombre : `Competencia ${competenciaId}`;

                return (
                  <tr key={competenciaId} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                    <td> <p className="ms-4 my-3">{index + 1}</p> </td>
                    <td> <p className="my-3">{competenciaNombre}</p> </td>
                    <td>
                      <button className="btn-terciario-ghost" onClick={() => handleCheckboxChange(competenciaId)}>
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

export default DropdownSinSecciones;