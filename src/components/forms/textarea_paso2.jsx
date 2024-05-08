import { useState, useRef, useEffect, forwardRef } from "react";

const CustomInputArea = forwardRef(
  ({ loading, saved, label, placeholder, id, maxLength, error, readOnly, onChange, onBlur, initialValue, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    const [lastSavedValue, setLastSavedValue] = useState(initialValue || '');
    const [totalCharacters, setTotalCharacters] = useState(initialValue ? initialValue.length : 0); // Inicializa el contador de caracteres
    const internalRef = useRef(null);
    const effectiveRef = ref || internalRef;

    useEffect(() => {
      const adjustTextareaHeight = () => {
        if (effectiveRef.current) {
          effectiveRef.current.style.height = 'inherit';
          effectiveRef.current.style.height = `${effectiveRef.current.scrollHeight}px`;
        }
      };

      adjustTextareaHeight();
    }, [inputValue, effectiveRef]);

    const handleInputChange = (e) => {
      const value = e.target.value;
      if (maxLength !== null && maxLength !== undefined && value.length > maxLength) {
        setInputValue(value.slice(0, maxLength));
      } else {
        setInputValue(value);
      }
      if (onChange) {
        onChange(value);
      }
      setTotalCharacters(value.length); // Actualiza el contador total de caracteres
    };

    const handleBlur = (e) => {
      if (inputValue.trim() !== lastSavedValue.trim()) {
        setLastSavedValue(inputValue);
        if (onBlur) {
          onBlur(e);
        }
      }
    };

    const counterClass = totalCharacters === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";


    const renderSpinnerOrCheck = () => {
      if (loading) {
        return <div className="spinner-border text-primary" role="status"></div>;
      }
      if (saved) {
        return <i className="material-symbols-outlined text-success">check</i>;
      }
      return null;
    };

    return (
      <div className="d-flex flex-column input-container col-11">
        <div className="d-flex input-container">
          <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
          <textarea
            className={`input-s p-3 input-textarea col-12 ${error ? 'input-error' : ''}`}
            placeholder={readOnly ? placeholder : ''}
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            ref={effectiveRef}
            maxLength={maxLength}
            disabled={readOnly}  // Esto deshabilita el textarea cuando readOnly es true
            {...props}
          />
          <div className="d-flex align-self-end align-items-center mx-2 my-3">
            {renderSpinnerOrCheck()}
          </div>
        </div>
        {!readOnly && maxLength !== null && maxLength !== undefined && (
          <div className="d-flex justify-content-end col-12">
            <div className="mb-0 mt-1">
              <span className={counterClass}>
                {totalCharacters}/{maxLength} caracteres.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomInputArea.displayName = 'CustomInputArea';
export default CustomInputArea;
