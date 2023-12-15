import { useState } from "react";

const CustomTextarea = ({label, placeholder, id, maxLength}) => {
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
      <textarea 
        className="input-s p-3"
        type="text"
        placeholder={placeholder}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
      />
      {/* si no se ha entregado un maxLength, no muestra el contador */}
      {maxLength !== null && maxLength !== undefined && (
        <div className="d-flex justify-content-end mb-0">
          <span className={counterClass}>
            {inputValue.length}/{maxLength} caracteres.
          </span>
        </div>
      )}
    </div>
    );
  };
  
  export default CustomTextarea;