import { UserData } from '../../Data/Usuarios';

export const Table = ({ filterTypeId }) =>
{
  const filteredData = UserData.filter(user => user.tipoUsuario === filterTypeId);

  // Identificar si necesitamos columnas adicionales
  const showSector = filteredData.some(user => user.tipoUsuario === '2');
  const showRegion = filteredData.some(user => user.tipoUsuario === '4');
  return (
    <table className="table table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Email</th>
        {showSector && <th scope="col">Sector</th>}
        {showRegion && <th scope="col">Región</th>}
      </tr>
    </thead>
    <tbody>
      {filteredData.map((user, index) => (
        <tr key={user.id}>
          <th scope="row">{index + 1}</th>
          <td>{user.nombre}</td>
          <td>{user.email}</td>
          {showSector && <td>{user.sector || 'N/A'}</td>}
          {showRegion && <td>{user.region || 'N/A'}</td>}
        </tr>
      ))}
    </tbody>
  </table>
  )
}
