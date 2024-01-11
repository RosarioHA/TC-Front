import { useState, forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, placeholder, id, maxLength, error, readOnly, onChange, value, ...props }, ref) => {
    
    const handleInputChange = (e) => {
      const value = e.target.value;
      if (maxLength !== null && maxLength !== undefined && value.length > maxLength) {
        onChange(value.slice(0, maxLength));
      } else {
        onChange(e);
      }
    };

    const counterClass = value.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

    return (
      <div className="d-flex flex-column input-container">
        {readOnly ? (
          <>
            <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
            <input
              className={`input-s p-3 input-textarea ${error ? 'input-error' : ''}`}
              type="text"
              placeholder={placeholder}
              id={id}
              value={value}
              onChange={handleInputChange}
              ref={ref}
              disabled
              {...props}
            />
          </>
        ) : (
          <>
            <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
            <input
              className={`input-s p-3 input-textarea ${error ? 'input-error' : ''}`}
              type="text"
              placeholder={placeholder}
              id={id}
              value={value}
              onChange={handleInputChange}
              ref={ref}
              {...props}
            />
            {maxLength !== null && maxLength !== undefined && (
              <div className="d-flex justify-content-end mb-0">
                <span className={counterClass}>
                  {value.length}/{maxLength} caracteres.
                </span>
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
