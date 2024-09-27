import { useState } from 'react';
export const TableCheckbox = ({ columnTitles, renderRow, data = [], sortableColumns, sortOptions }) => {

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'original' });

  const sortedData = () => {
    if (!data || data.length === 0) {
      return [];
    }
  
    if (sortConfig.key && sortOptions[sortConfig.key]) {
      const sortFunction = sortOptions[sortConfig.key](sortConfig.direction);
      if (typeof sortFunction === 'function') {
        return [...data].sort(sortFunction);
      }
    }
  
    return data;
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
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
          {sortedData().map(item => renderRow(item))}
        </tbody>
      </table>
    </>
  );
};
