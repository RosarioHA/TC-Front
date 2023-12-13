import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitlesUser } from "../../Data/Usuarios";
import { useUsers } from '../../hooks/usuarios/useUsers';

const GestionUsuarios = () =>
{
  const { userData } = useAuth();
  const { users, pagination, updateUrl } = useUsers();
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ filteredUsers, setFilteredUsers ] = useState([ users ]);
  const navigate = useNavigate();

  const userSubdere = userData?.perfil?.includes('SUBDERE');

  //mostrar  siempre a si mismo en primer lugar y eliminar checkbox 

  useEffect(() =>
  {
    if (users)
    {
      setFilteredUsers(users);
    }
  }, [ users ]);

  const sortOptions = {
    Estado: (direction) => (a, b) =>
    {
      // Convertir booleanos a números para la comparación
      const firstValue = a.is_active ? 1 : 0;
      const secondValue = b.is_active ? 1 : 0;

      // Orden ascendente
      if (direction === 'asc')
      {
        return firstValue - secondValue;
      }
      // Orden descendente
      return secondValue - firstValue;
    },
  };

  // Función de búsqueda
  const handleSearch = useCallback((query) =>
  {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = users.filter(user =>
      user.nombre_completo.toLowerCase().includes(lowerCaseQuery) ||
      (user.is_active ? 'activo' : 'inactivo').includes(lowerCaseQuery) ||
      user.perfil.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  }, [ users ]);

  const handleDetailsUser = (user) =>
  {
    navigate(`/home/detalle_usuario/${user.id}`, { state: { user } });
  };

  const handlePageChange = (pageUrl) =>
  {
    // Extrae el número de página de la URL
    const pageNumber = new URL(pageUrl, window.location.origin).searchParams.get('page');
    updateUrl(`/users/?page=${pageNumber}`);
  };


  // Modificar la función para renderizar botones de paginación
  const renderPaginationButtons = () =>
  {
    if (!pagination || (!pagination.next && !pagination.previous))
    {
      return null;
    }

    return (
      <nav>
        <ul className="pagination ms-md-5">
          {pagination.previous && (
            <li className="page-item">
              <button
                className="custom-pagination-btn mx-3"
                onClick={() => handlePageChange(pagination.previous)}
              >
                &lt;
              </button>
            </li>
          )}
          {/* Aquí podrías agregar botones para páginas específicas si es necesario */}
          {pagination.next && (
            <li className="page-item">
              <button
                className="custom-pagination-btn mx-3"
                onClick={() => handlePageChange(pagination.next)}
              >
                &gt;
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  };




  return (
    <div className="container-fluid mt-2">
      <div className="text-sans-h2 mx-3">Administrar Usuarios</div>
      <div className="d-flex flex-row px-4">
        <div className="w-50 pl-2 text-sans-24 align-self-center">Todos los usuarios</div>
        <InputSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar usuarios"
          onSearch={handleSearch}
        />
        {userSubdere && (
          <div>
            <Link className="btn-primario-l mx-4 py-3 link-underline link-underline-opacity-0" to='/home/crear_usuario'>
              <u>Crear Usuario</u>
              <span className="material-symbols-outlined mx-1">
                person_add
              </span>
            </Link>
          </div>
        )}
      </div>
      <TableCheckbox
        columnTitles={columnTitlesUser}
        data={filteredUsers}
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
            <td className="pt-3"><u className="text-sans-p my-4">{user.nombre_completo}</u></td>
            <td className="text-primary pt-4">
              {user.competenciaAsociada ? (user.competenciaAsociada.length === 0 ? 'No asociada' : user.competenciaAsociada.length > 2 ? '+3 Competencias' : user.competenciaAsociada.join(', ')) : 'No asociada'}
            </td>
            <td>
              <span className={`badge my-3 ${user.is_active ? 'badge-activo' : 'badge-inactivo'}`}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td className="pt-4">
              <span className="badge-type">
                {user.perfil}
              </span>
            </td>
            <td>
              <button className="btn-secundario-s btn-sm align-self-center" onClick={() => handleDetailsUser(user)}>
                <u>Ver Usuario</u>
              </button>
            </td>
          </tr>
        )}
        sortOptions={sortOptions}
      />
      <div className="pagination-container d-flex justify-content-center">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default GestionUsuarios;