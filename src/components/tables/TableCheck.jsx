import { useState } from 'react';
export const TableCheckbox = ({ columnTitles, renderRow, data = [], sortableColumns, sortOptions }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'original' });


  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const newSelectedIds = new Set(data.map(item => item.id));
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
    setSelectAll(newSelectedItems.size === data.length);
  };

  const sortedData = () => {
    let sorted = data;
    if (sortConfig.key && sortOptions[sortConfig.key]) {
      sorted = [...data].sort(sortOptions[sortConfig.key](sortConfig.direction));
    }
    return sorted;
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
              const columnStyle = index !== 0  ? { width: '230px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {};

              return (
                <th
                  key={index}
                  scope="col"
                  onClick={() => isSortable && requestSort(title)}
                  style={{ cursor: isSortable ? 'pointer' : 'default', ...columnStyle }}
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
        {sortedData().map(item => renderRow(item, selectedItems.has(item.id), handleRowCheckboxChange))}

        </tbody>
      </table>
    </>
  );
};