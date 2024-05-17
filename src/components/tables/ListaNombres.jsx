import { useState } from 'react';
import CustomInput from '../forms/custom_input';
import { Controller } from 'react-hook-form';

export const ListaNombres = ({ control, errors, setValue }) => {
    // Estado inicial con dos filas vacías
    const [rows, setRows] = useState([{ name: '' }, { name: '' }]);

    const handleAddRow = () => {
        const newRow = { name: '' };
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (index) => {
        // Ensure at least two rows remain
        if (rows.length > 2) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
        }
    };

    const handleChange = (index, event) => {
      const updatedRows = rows.map((row, i) => {
        if (i === index) {
          const updatedValue = event.target.value;
          setValue(`nombres[${index}].name`, updatedValue);  // Update the form state
          return { ...row, name: updatedValue };
        }
        return row;
      });
      setRows(updatedRows);
    };

    return (
        <>
            {rows.map((row, index) => (
                <div key={index} className={`row ${index % 2 === 0 ? 'white-line' : 'neutral-line'} pt-4 col-11`}>
                    <div className="d-flex align-items-center mb-2 mt-2">
                        <span className="mx-3 fw-bold mb-auto">{index + 1}</span>
                        <Controller
                            control={control}
                            name={`nombres[${index}].name`}
                            render={({ field }) => (
                                <CustomInput
                                    label='Nombre de la Competencia (Obligatorio)'
                                    placeholder="Escribe el nombre de la competencia"
                                    id={`nombre-${index}`}
                                    maxLength={200}
                                    error={errors?.nombres?.[index]?.name?.message}
                                    value={field.value ?? ''}  // Ensure value is never undefined
                                    onChange={(event) => handleChange(index, event)}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    {/* Show delete button if three or more rows exist */}
                    {rows.length >= 3 && (
                        <div className="d-flex justify-content-end col-12 me-5 pe-4">
                            <button className="btn-terciario-ghost" onClick={() => handleRemoveRow(index)}>
                                <i className="material-symbols-rounded mx-1">delete</i>
                                <p className="mb-0 text-decoration-underline">Borrar</p>
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <button className="btn-secundario-s d-flex my-3" onClick={handleAddRow}>
                <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">Agregar Competencia</p>
            </button>
        </>
    );
};