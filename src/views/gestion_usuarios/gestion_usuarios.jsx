import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitlesUser, userData } from "../../Data/Usuarios";

const GestionUsuarios = () =>
{
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ filteredUsers, setFilteredUsers ] = useState(userData);


  const sortOptions = {
    Estado: (direction) => (a, b) =>
    {
      if (direction === 'asc')
      {
        return a.estado.localeCompare(b.estado);
      } else
      {
        return b.estado.localeCompare(a.estado);
      }
    },
  };

   // Función de búsqueda
  const handleSearch = useCallback((query) => {
    const filtered = userData.filter(user =>
      user.nombre.toLowerCase().includes(query.toLowerCase()) ||
      user.estado.toLowerCase().includes(query.toLowerCase()) ||
      user.tipoUsuario.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, []); 


  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);  // Actualiza el estado con el valor actual del input/ Llama a la función de búsqueda
  };

  return (
    <div className="container-fluid mt-2">
      <div className="text-sans-h2 mx-3 ">Administrar Usuarios</div>
      <div className="d-flex flex-row px-4">
        <div className="w-50  pl-2 text-sans-24 align-self-center">Todos los usuarios</div>
        <InputSearch
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar usuarios"
          onSearch={handleSearch}
        />

        <div>
          <Link className="btn-primario-l mx-4 py-3 link-underline link-underline-opacity-0" type="button" to='/home/crear_usuario'><u>Crear Usuario</u><span className="material-symbols-outlined mx-1">
            person_add
          </span>
          </Link>
        </div>
      </div>
      <TableCheckbox
        columnTitles={columnTitlesUser}
        data={filteredUsers}
        itemType="usuarios"
        sortableColumns={[ 'Estado' ]}
        renderRow={(user, isChecked, handleCheckboxChange) => (
          <tr key={user.id}>
            <th scope="row">
              <input
                type="checkbox"
                className="check my-3"
                checked={isChecked}
                onChange={() => handleCheckboxChange(user.id)}
              />
            </th>
            <td className="pt-3"><u className="text-sans-p my-4">{user.nombre}</u></td>
            <td className="text-primary pt-4">{
              user.competenciaAsociada.length === 0
                ? 'No asociada'
                : user.competenciaAsociada.length > 2
                  ? '+3 Competencias'
                  : user.competenciaAsociada.join(', ')
            }</td>
            <td >
              <span className={`badge my-3 ${user.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                {user.estado}
              </span>
            </td>
            <td className="pt-4">
              <span className="badge-type">
                {user.tipoUsuario}
              </span>
            </td>
            <td>
              <button className="btn-secundario-s btn-sm align-self-center"><u>{user.accion}</u></button>
            </td>
          </tr>
        )}
        sortOptions={sortOptions}
      />
    </div>
  );
};

export default GestionUsuarios;