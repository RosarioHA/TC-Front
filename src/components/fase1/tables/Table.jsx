
export const Table = ({ userData, userType }) => {
  // Determinar si se deben mostrar las columnas de 'Sector' y 'Región'
  const showSector = userType === 'Sectorial' ;
  const showRegion = userType  === 'Gore';

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
        {userData.map((user, index) => (
          <tr key={user.id}>
            <th scope="row">{index + 1}</th>
            <td>{user.nombre_completo}</td>
            <td>{user.email}</td>
            {showSector && <td>{user.sector_nombre || 'N/A'}</td>}
            {showRegion && <td>{user.region_nombre || 'N/A'}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};