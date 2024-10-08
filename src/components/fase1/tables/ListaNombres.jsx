import { useState, useEffect } from 'react';
import CustomInput from '../forms/custom_input';

export const ListaNombres = ({ readOnly, setValue, competenciasAgrupadas, onDelete }) => {
  const initialRows = competenciasAgrupadas?.map((comp) => ({ id: comp.id, nombre: comp.nombre })) || [
    { id: 1, nombre: '' },
    { id: 2, nombre: '' },
  ];

  const [rows, setRows] = useState(initialRows);
  const [errors, setErrors] = useState({});

  const handleNombreChange = (id, value) => {
    setRows(rows => rows?.map(row => (row.id === id ? { ...row, nombre: value } : row)));
  };

  const handleBlur = async (id) => {
    const newErrors = { ...errors };

    const row = rows.find(row => row.id === id);
    if (row.nombre.trim() === '') {
      newErrors[id] = 'El nombre de la competencia agrupada es obligatorio';
    } else if (row.nombre.trim().length < 3) {
      newErrors[id] = 'El nombre debe tener al menos 3 caracteres';
    } else {
      delete newErrors[id];
    }

    // Check if any nombre is empty
    const emptyCount = rows.filter(row => row.nombre.trim() === '').length;
    if (emptyCount > 1) {
      delete newErrors.global;
    } else {
      // Check for duplicate names
      const nombres = rows?.map(row => row.nombre.trim().toLowerCase());
      const hasDuplicates = nombres.some((nombre, index) => nombres.indexOf(nombre) !== index);

      if (hasDuplicates) {
        newErrors.global = 'No se permiten nombres duplicados';
      } else {
        delete newErrors.global;
      }
    }

    setErrors(newErrors);
  };

  const handleFocus = (id) => {
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleAddRow = () => {
    const nombres = rows?.map(row => row.nombre.trim().toLowerCase());
  
    // Verificar si hay nombres duplicados
    if (nombres.some((nombre, index) => nombres.indexOf(nombre) !== index)) {
      setErrors({ global: 'No se permiten nombres duplicados' });
      return;
    }

    // Generar un identificador único para la nueva fila
    const newId = Math.max(...rows.map(row => row.id), 0) + 1;

    // Agregar una nueva fila
    setRows([...rows, { id: newId, nombre: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
      if (rows[index].id) {
        onDelete(rows[index].id);
      }
    }
  };

  useEffect(() => {
    const formattedRows = rows.map(row => (
      competenciasAgrupadas && initialRows.some(initialRow => initialRow.id === row.id)
        ? { id: row.id, nombre: row.nombre }
        : { nombre: row.nombre }
    ));
    setValue('competencias_agrupadas', formattedRows);
  }, [rows, setValue, competenciasAgrupadas, initialRows]);

  return (
    <>
      {rows?.map((row, index) => (
        <div key={row.id} className={`row ${index % 2 === 0 ? 'white-line' : 'neutral-line'} py-4 col-11`}>
          <span className="mx-3 fw-bold mb-auto"></span>
          <CustomInput
            label={`Nombre de la Competencia (Obligatorio)`}
            placeholder={row.nombre || "Escribe el nombre de la competencia"}
            id={`nombre-${row.id}`}
            maxLength={200}
            initialValue={row.nombre}
            onChange={(value) => handleNombreChange(row.id, value)}
            onBlur={() => handleBlur(row.id)}
            onFocus={() => handleFocus(row.id)}
            readOnly={readOnly}
          />
          {errors[row.id] && <div className="text-sans-h6-darkred mb-0">{errors[row.id]}</div>}
          {rows.length > 2 && !readOnly && (
            <div className="d-flex justify-content-end col-12 me-5 pe-4">
              <button type="button" className="btn-terciario-ghost" onClick={() => handleRemoveRow(index)}>
                <i className="material-symbols-rounded mx-1">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar</p>
              </button>
            </div>
          )}
        </div>
      ))}
      {errors.global && <div className="text-sans-h6-darkred mb-0">{errors.global}</div>}
      {!readOnly && (
        <button type="button" className="btn-secundario-s d-flex my-3" onClick={handleAddRow}>
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar Competencia</p>
        </button>
      )}
    </>
  );
};
