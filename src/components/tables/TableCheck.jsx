import { useState } from 'react';
export const TableCheckbox = ({ columnTitles, renderRow, data, itemType, sortableColumns, sortOptions }) =>
{
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ selectAll, setSelectAll ] = useState(false);
  const [ selectedItems, setSelectedItems ] = useState(new Set());
  const [ sortConfig, setSortConfig ] = useState({ key: null, direction: 'original' });



  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const dataToShow = data.slice(startIndex, endIndex);


  const handlePageChange = (pageNumber) =>
  {
    setCurrentPage(pageNumber);
  };

  const rangeInfo = `${startIndex + 1} - ${endIndex} de ${data.length} ${itemType}`;

  const handleSelectAllChange = () =>
  {
    if (selectAll)
    {
      setSelectedItems(new Set());
    } else
    {
      const newSelectedIds = new Set(dataToShow.map(item => item.id));
      setSelectedItems(newSelectedIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowCheckboxChange = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);

    // Verificar si todos los elementos de la página actual están seleccionados
    setSelectAll(newSelectedItems.size === dataToShow.length);
  };


  // Renderizar cada fila pasando el estado del checkbox y el controlador
  const customRenderRow = (item) =>
  {
    return renderRow(item, selectedItems.has(item.id), handleRowCheckboxChange);
  };

    // Función para ordenar los datos
    const sortedData = () => {
      if (sortConfig.key && sortOptions[sortConfig.key]) {
        return [...data].sort(sortOptions[sortConfig.key](sortConfig.direction));
      }
      return data;
    };
  

  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      // Si ya está ordenando por la misma columna en orden ascendente, cambia a descendente
      direction = 'desc';
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'desc'
    ) {
      // Si se hace clic en la misma columna por tercera vez, restablece el estado de ordenamiento
      setSortConfig({ key: null, direction: 'original' });
      return;
    }

    setSortConfig({ key, direction });
  };

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                className="check"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </th>
            {columnTitles.map((title, index) =>
            {
              const isSortable = sortableColumns.includes(title);
              const isSortingColumn = sortConfig.key === title;

              return (
                <th
                  key={index}
                  scope="col"
                  onClick={() => isSortable && requestSort(title)}
                  style={{ cursor: isSortable ? 'pointer' : 'default' }}
                  className="mt-3 p-2"
                >
                  {title}
                  {isSortable && (
                    <span
                      className="material-symbols-outlined mx-1"
                      onClick={() => isSortable && requestSort(title)}
                    >
                      {isSortingColumn ? (
                        sortConfig.direction === 'asc' ? 'filter_alt ' : 'filter_alt'
                      ) : (
                        'filter_alt'
                      )}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData().slice(startIndex, endIndex).map(customRenderRow)}
        </tbody>
      </table>
      <div className="pagination-container d-flex justify-content-center">
        <span className="range-info text-sans-h6">{rangeInfo}</span>
        {totalPages > 1 && (
          <nav>
            <ul className="pagination ms-md-5">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="custom-pagination-btn mx-3"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
              </li>
              {[ ...Array(totalPages) ].map((_, i) => (
                <li key={i} className="page-item">
                  <button
                    className={`custom-pagination-btn text-decoration-underline px-2 mx-2 ${currentPage === i + 1 ? 'active' : ''
                      }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? 'disabled' : ''
                  }`}
              >
                <button
                  className="custom-pagination-btn mx-3"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};