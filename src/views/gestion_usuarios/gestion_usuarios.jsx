import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitlesUser, userData } from "../../Data/Usuarios";

const GestionUsuarios = () =>
{
  return (
    <div className="container-fluid mt-2">
      <div className="text-sans-h2 mx-3 ">Administrar Usuarios</div>
      <div className="d-flex flex-row px-4">
        <div className="w-50  pl-2 text-sans-24 align-self-center">Todos los usuarios</div>
        <InputSearch />
        <div>
          <button className="btn-primario-l mx-4 py-3"><u>Crear Usuario</u><span className="material-symbols-outlined mx-1">
            person_add
          </span>
          </button>
        </div>
      </div>
      <TableCheckbox
            columnTitles={columnTitlesUser}
            data={userData}
            itemType="usuarios"
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
                  <span className={`badge my-3 ${user.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}` }>
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
          />
    </div>
  );
};

export default GestionUsuarios;