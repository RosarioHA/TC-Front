import { useState, useEffect, } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from '../../hooks/usuarios/useUsers';
import { useAuth } from '../../context/AuthContext';
//import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitlesUser } from "../../Data/Usuarios";

const GestionUsuarios = () => {
  const { userData } = useAuth();
  const { users, pagination, setPagination, metadata } = useUsers();
  //const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const userSubdere = userData?.perfil?.includes('SUBDERE');

  useEffect(() => {
    if (users) {
      // Si hay información de paginación, filtra los usuarios según la página actual
      if (pagination && pagination.results) {
        const startIndex = (pagination.current_page - 1) * pagination.page_size;
        const endIndex = startIndex + pagination.results.length;
        setFilteredUsers(users.slice(startIndex, endIndex));
      } else {
        // Si no hay información de paginación, muestra todos los usuarios
        setFilteredUsers(users);
      }
    }
  }, [users, pagination]);

  const sortOptions = {
    Estado: (direction) => (a, b) => {
      // Convertir booleanos a números para la comparación
      const firstValue = a.is_active ? 1 : 0;
      const secondValue = b.is_active ? 1 : 0;

      // Orden ascendente
      if (direction === 'asc') {
        return firstValue - secondValue;
      }
      // Orden descendente
      return secondValue - firstValue;
    },
  };

  // Muestra las competencias por usuario
  const renderCompetenciasAsignadas = (competencias) => {
    const cantidad = competencias.length;
  
    switch (cantidad) {
      case 0:
        // Si no hay competencias asignadas
        return 'No asociada';
      case 1:
        // Si hay exactamente una competencia asignada
        return competencias[0].nombre;
      default:
        // Si hay más de una competencia asignada
        return `${cantidad} Competencias`;
    }
  };

  // Función de búsqueda
  // const handleSearch = useCallback((query) => {
  //   const lowerCaseQuery = query.toLowerCase();
  //   const filtered = users.filter(user =>
  //     user.nombre_completo.toLowerCase().includes(lowerCaseQuery) ||
  //     (user.is_active ? 'activo' : 'inactivo').includes(lowerCaseQuery) ||
  //     user.perfil.toLowerCase().includes(lowerCaseQuery) 
  //   );
  //   setFilteredUsers(filtered);
  // }, [ users ]);

  const handleDetailsUser = (user) => {
    navigate(`/home/editar_usuario/${user.id}`, { state: { user } });
  };

  const projectsPerPage = 10;

  const totalPages = Math.ceil(metadata.count / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setPagination(pageNumber);
  };

  // Modificar la función para renderizar botones de paginación
  const renderPaginationButtons = () => {
    if (!pagination) {
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5">
        {/* Índice */}
        <p className="text-sans-h5 mx-5 text-center">
          {`${(pagination - 1) * projectsPerPage + 1}- ${Math.min(pagination * projectsPerPage, metadata.count)} de ${metadata.count} usuarios`}
        </p>
        {/* Paginación */}
        <nav className="pagination-container mx-auto mx-md-0">
          <ul className="pagination ms-md-5">
            <li className={`page-item ${pagination === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination - 1)} disabled={pagination === 1}>
                &lt;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <button className={`custom-pagination-btn text-decoration-underline px-2 mx-2 ${pagination === i + 1 ? 'active' : ''}`} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination + 1)} disabled={pagination === totalPages}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-2">
      <div className="text-sans-h2 mx-3">Administrar Usuarios</div>
      <div className="d-flex flex-row px-4 mb-5 justify-content-between">
        <div className="w-50 pl-2 text-sans-24 align-self-center">Todos los usuarios</div>
        {/* <InputSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar usuarios"
          onSearch={handleSearch}
        /> */}
        {userSubdere && (
          <div className="d-flex justify-content-end">
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
        renderRow={(user) => (
          <tr key={user.id}>
            <th scope="row">
              {/* <input
                type="checkbox"
                className="check my-3"
                checked={isChecked}
                onChange={() => handleCheckboxChange(user.id)}
              /> */}
            </th>
            <td className="pt-3"><u className="text-sans-p my-4">{user.nombre_completo}</u></td>
            <td className="text-primary pt-4">
              {renderCompetenciasAsignadas(user.competencias_asignadas)}
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
      
      {metadata.count > projectsPerPage && (
        <div className="pagination-container d-flex justify-content-center">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;