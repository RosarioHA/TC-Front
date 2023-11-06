import { useState } from "react";

const CustomInput = ({label, placeholder, id, maxLength}) => {
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
      <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
      <input 
        className="input-s p-3 text-sans-p"
        type="text"
        placeholder={placeholder}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
      />
      {/* si no se ha entregado un maxLength, no muestra el contador */}
      {maxLength !== null && maxLength !== undefined && (
        <div className="d-flex justify-content-end mt-1">
          <p className={counterClass}>
            {inputValue.length}/{maxLength} caracteres.
          </p>
        </div>
      )}
    </div>
    );
  };
  
  export default CustomInput;