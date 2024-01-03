import { useState, useRef, useEffect} from "react";

const CustomTextarea = ({ label, placeholder, id, maxLength, rows, value = "", onChange, onBlur, readOnly, name }) =>
{
  const [ inputValue, setInputValue ] = useState(value); // Inicialización segura de inputValue
  const textareaRef = useRef(null);

  useEffect(() =>
  {
    adjustHeight();
  }, [ inputValue ]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onChange(event); // Pasa el evento completo
};
  const handleBlur = (e) => {
    console.log("Input Blurred");
    if (onBlur) onBlur(e); // Propaga el evento onBlur al componente padre
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  useEffect(() => {
    adjustHeight();
  }, [inputValue]); 


  useEffect(() => {
    setInputValue(value); // Actualiza el inputValue cuando el prop 'value' cambia
  }, [value]);

  const counterClass = maxLength !== undefined && inputValue.length === maxLength
    ? "text-sans-h6-darkred"
    : "text-sans-h6";

  return (
    <div>
      {readOnly ? (
        <div className="d-flex flex-column textarea-container">
          <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
          <textarea
            ref={textareaRef}
            className="input-textarea p-3"
            placeholder={placeholder}
            id={id}
            value={inputValue}
            onChange={handleChange}
            rows={rows}
            style={{ overflow: 'hidden' }}
            name={name}
          />
        </div>
      ) : (
        <div className="d-flex flex-column input-container">
          <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
          <textarea
            ref={textareaRef}
            className="input-s p-3"
            type="text"
            placeholder={placeholder}
            id={id}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ overflow: 'hidden' }}
            name={name}
          />
          {maxLength !== null && maxLength !== undefined && (
            <div className="d-flex justify-content-end mb-0">
              <span className={counterClass}>
                {inputValue.length}/{maxLength} caracteres.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;
