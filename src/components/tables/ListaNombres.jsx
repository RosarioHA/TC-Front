import { useState, useEffect } from 'react';
import CustomInput from '../forms/custom_input';

export const ListaNombres = ({ readOnly, setValue, competenciasAgrupadas }) =>
{
  const [rows, setRows] = useState([
    { id: 1, nombre: '' },
    { id: 2, nombre: '' },
    ...competenciasAgrupadas?.map((comp, index) => ({ id: index + 3, nombre: comp.nombre })) || [],
  ]);
  const [ errors, setErrors ] = useState({});

  const handleNombreChange = (id, value) =>
  {
    setRows(rows => rows?.map(row => (row.id === id ? { ...row, nombre: value } : row)));
  };

  const handleBlur = async (id) =>
  {
    const newErrors = { ...errors };

    if (rows[ id - 1 ].nombre.trim() === '')
    {
      newErrors[ id ] = 'El nombre de la competencia agrupada es obligatorio';
    } else if (rows[ id - 1 ].nombre.trim().length < 3)
    {
      newErrors[ id ] = 'El nombre debe tener al menos 3 caracteres';
    } else
    {
      delete newErrors[ id ];
    }

    // Check if any nombre is empty
    const emptyCount = rows.filter(row => row.nombre.trim() === '').length;
    if (emptyCount > 1)
    {
      delete newErrors.global;
    } else
    {
      // Check for duplicate names
      const nombres = rows?.map(row => row.nombre.trim().toLowerCase());
      const hasDuplicates = nombres.some((nombre, index) => nombres.indexOf(nombre) !== index);

      if (hasDuplicates)
      {
        newErrors.global = 'No se permiten nombres duplicados';
      } else
      {
        delete newErrors.global;
      }
    }

    setErrors(newErrors);
  };

  const handleFocus = (id) =>
  {
    const newErrors = { ...errors };
    delete newErrors[ id ];
    setErrors(newErrors);
  };

  const handleAddRow = () =>
  {
    const nombres = rows?.map(row => row.nombre.trim().toLowerCase());
    if (nombres.some((nombre, index) => nombres.indexOf(nombre) !== index))
    {
      setErrors({ global: 'No se permiten nombres duplicados' });
      return;
    }

    const newRowId = rows.length + 1;
    setRows([ ...rows, { id: newRowId, nombre: '' } ]);
  };

  const handleRemoveRow = (index) =>
  {
    if (rows.length > 1)
    {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  useEffect(() =>
  {
    setValue('competencias_agrupadas', rows);
  }, [ rows, setValue ]);

  return (
    <>
      {rows?.map((row, index) => (
        <div key={index} className={`row ${index % 2 === 0 ? 'white-line' : 'neutral-line'} py-4 col-11`}>
          <span className="mx-3 fw-bold mb-auto"></span>
          <CustomInput
            label={`Nombre de la Competencia (Obligatorio)`}
            placeholder={row.nombre || "Escribe el nombre de la competencia"}
            id={`nombre-${row.id}`}
            maxLength={200}
            value={row.nombre}
            onChange={(value) => handleNombreChange(row.id, value)}
            onBlur={() => handleBlur(row.id)}
            onFocus={() => handleFocus(row.id)}
            readOnly={readOnly}
          />
          {errors[ row.id ] && <div className="text-danger">{errors[ row.id ]}</div>}
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
      {errors.global && <div className="text-danger mb-2">{errors.global}</div>}
      {!readOnly && (
        <button type="button" className="btn-secundario-s d-flex my-3" onClick={handleAddRow}>
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar Competencia</p>
        </button>
      )}
    </>
  );
};
