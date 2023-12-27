import { useRef, useEffect } from "react";

const CustomTextarea = ({ label, placeholder, id, maxLength, rows, value, onChange }) => {
  const textareaRef = useRef(null);
  const inputValue = value || '';  // Asegura que inputValue nunca sea undefined

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (maxLength !== null && maxLength !== undefined && newValue.length > maxLength) {
      onChange(newValue.slice(0, maxLength));
    } else {
      onChange(newValue);
    }
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Ajusta la altura inicialmente y cuando se cambie el valor externo
  useEffect(() => {
    adjustHeight();
  }, [inputValue]);  // Usa inputValue aquí

  const counterClass = inputValue.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

  return (
    <div className="d-flex flex-column textarea-container">
      <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
      <textarea 
        ref={textareaRef}
        className="input-textarea p-3" 
        placeholder={placeholder}
        id={id}
        value={inputValue}  // Usa inputValue aquí
        onChange={handleInputChange}
        rows={rows}
        style={{ overflow: 'hidden' }}
      />
      {maxLength !== null && maxLength !== undefined && (
        <div className="d-flex justify-content-end mb-0">
          <span className={counterClass}>
            {inputValue.length}/{maxLength} caracteres.  // Usa inputValue aquí
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;