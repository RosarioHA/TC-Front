import { useState, useRef, useEffect } from "react";

const CustomTextarea = ({ label, placeholder, id, maxLength }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (maxLength !== null && maxLength !== undefined && value.length > maxLength) {
      setInputValue(value.slice(0, maxLength));
    } else {
      setInputValue(value);
    }
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Ajusta la altura inicialmente y cuando se cambie el valor
  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  const counterClass = inputValue.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

  return (
    <div className="d-flex flex-column input-container">
      <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
      <textarea 
        ref={textareaRef}
        className="input-s p-3" 
        type="text"
        placeholder={placeholder}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        style={{ overflow: 'hidden' }}
      />
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
