const TablaSelecciones = ({ selecciones, onRemove, colTitle }) => {
    return (
      <div className="mb-5">
        <table>
          <thead className="">
            <tr className="">
              <th className="col-1"> <p className="ms-4">#</p> </th>
              <th className="col-5"> <p >{colTitle}</p> </th>
              <th className="col-1"> <p className="ms-2">Acción</p> </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(selecciones).map((opcion, index) => (
              <tr key={opcion} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                <td> <p className="ms-4 my-3">{index + 1}</p> </td>
                <td> <p className="my-3">{opcion}</p> </td>
                <td>
                  <button className="btn-terciario-ghost" onClick={() => onRemove(opcion)}>
                    <p className="mb-0 text-decoration-underline">Eliminar</p>
                    <i className="material-symbols-rounded ms-2">delete</i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default TablaSelecciones;