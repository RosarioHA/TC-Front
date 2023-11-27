import { useState, forwardRef } from "react";

const CustomInput = forwardRef (
  ({ label, placeholder, id, maxLength, error, readOnly, ...props }, ref) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Si hay maxLenght, verifica que no sobrepase ese maximo.
    if (maxLength !== null && maxLength !== undefined && value.length > maxLength) {
      setInputValue(value.slice(0, maxLength));
    } else {
      setInputValue(value);
    }
  };

  // Clase condicional para el contador
  const counterClass = inputValue.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

  return (
    <div className="d-flex flex-column input-container">
      {readOnly ? (
        <>
          <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
          <p className="text-sans-p mt-4 ms-3">Valor del input: {inputValue}</p>
        </>
      ) : (
        <>
          <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
          <input
            className={`input-s p-3 text-sans-p ${error ? 'input-error' : ''}`}
            type="text"
            placeholder={placeholder}
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            ref={ref}
            {...props}
          />
          {/* si no se ha entregado un maxLength, no muestra el contador */}
          {maxLength !== null && maxLength !== undefined && (
            <div className="d-flex justify-content-end mt-1">
              <p className={counterClass}>
                {inputValue.length}/{maxLength} caracteres.
              </p>
            </div>
          )}
          {error && (
            <p className="text-sans-h6-darkred mt-2 mb-0">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
);

CustomInput.displayName = 'CustomInput';
export default CustomInput;