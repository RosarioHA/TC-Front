import { useState } from "react";

import { TableCheckbox } from "../components/tables/TableCheck";
import { columnTitlesUser, userData } from "../Data/Usuarios";
import { PersonsAssigned } from "../components/tables/PersonsAssigned";

const Home = () =>
{

  const [ filteredUsers ] = useState(userData);


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

  return (
    <div className="container ms-3 my-5">
      <div>
        <p>LANDING: DASHBOARD RESUMEN</p>
        <div className="d-flex flex-column col-8">
          <button className="btn-primario-s mb-2">Primario S</button>
          <button className="btn-primario-l mb-2">Primario L</button>
          <button className="btn-secundario-s mb-2">Secundario S</button>
          <button className="btn-secundario-l mb-2">Secundario L</button>
          <button className="btn-terciario mb-2">Terciario</button>
          <button className="btn-terciario-ghost">
            <p className="mb-0">Eliminar</p>
            <i className="material-symbols-rounded me-2">delete</i>
          </button>
          <button className="btn-danger my-2">Danger</button>

          <button className="btn-sidebar my-2">sidebar</button>

          <button className='btn-logout my-2'>logout</button>

          <div>Tablas</div>
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
      <PersonsAssigned/>
        </div>
      </div>
    </div>
  );
};

export default Home;