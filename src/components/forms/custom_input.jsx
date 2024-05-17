import { useState, forwardRef, useEffect } from "react";

const CustomInput = forwardRef(
  ({ loading, saved, label, placeholder, id, maxLength, error, readOnly, onChange, initialValue, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    const [totalCharacters, setTotalCharacters] = useState(initialValue ? initialValue.length : 0);

    useEffect(() => {
      setInputValue(initialValue || '');
      setTotalCharacters(initialValue?.length || 0);
    }, [initialValue]);

    const handleInputChange = (e) => {
      let value = e.target.value;  // Use `let` instead of `const` to allow reassignment
      if (maxLength !== null && maxLength !== undefined && value.length > maxLength) {
          value = value.slice(0, maxLength);  // Now this reassignment is valid
      }
      setInputValue(value);
      setTotalCharacters(value.length);
      if (onChange) {
          onChange(value);
      }
  };

    const counterClass = totalCharacters === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";
    const renderSpinnerOrCheck = () => {
      if (loading) return <div className="spinner-border text-primary" role="status"></div>;
      if (saved) return <i className="material-symbols-outlined text-success">check</i>;
      return null;
    };

    return (
      <div className="d-flex flex-column input-container col-11">
        {readOnly ? (
          <>
            <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
            <div className={`input-s p-3 input-textarea ${error ? 'input-error' : ''}`}>
              <p className="text-sans-p-grey mb-0">{placeholder}</p>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex input-container">
              <label className="text-sans-h5 input-label ms-3 ms-sm-0" htmlFor={id}>{label}</label>
              <input
                className={`input-s p-3 input-textarea col-12 ${error ? 'input-error' : ''}`}
                type="text"
                placeholder={placeholder}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                maxLength={maxLength}
                ref={ref}
                {...props}
              />
              <div className="d-flex align-self-end ms-1">
                {renderSpinnerOrCheck()}
              </div>
            </div>
            <div className="d-flex justify-content-between col-12">
              {error && <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>}
              {maxLength !== null && (
                <div className="mb-0 mt-1 ms-auto">
                  <span className={counterClass}>{totalCharacters}/{maxLength} caracteres.</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
export default CustomInput;
