import { useState, forwardRef } from "react";

const InputCosto = forwardRef(
  ({ loading, saved, label, placeholder, id, maxLength, error, readOnly, onChange, initialValue, ...props }, ref) => {
    
    const formatNumberWithCommas = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
  
    const removeCommas = (value) => {
      return value.replace(/,/g, '');
    };
  
    const addCommasToValue = (value) => {
      const rawValue = removeCommas(value);
      const formattedValue = formatNumberWithCommas(rawValue);
      return formattedValue;
    };
    const [inputValue, setInputValue] = useState(addCommasToValue(initialValue || ''));

    const handleInputChange = (e) => {
      let value = e.target.value;
      const rawValue = removeCommas(value);

      if (maxLength !== null && maxLength !== undefined && rawValue.length > maxLength) {
        setInputValue(addCommasToValue(rawValue.slice(0, maxLength)));
      } else {
        setInputValue(addCommasToValue(value));
      }

      if (onChange) {
        onChange(rawValue);
      }
    };

    const counterClass = inputValue.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

    const renderSpinnerOrCheck = () => {
      if (loading) {
        return <div className="spinner-border text-primary" role="status"></div>;
      }
      if (saved) {
        return <i className="material-symbols-outlined">check</i>; // Reemplaza esto con tu ícono de check real
      }
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
              <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
              <input
                className={`input-s p-3 input-textarea col-12 ${error ? 'input-error' : ''}`}
                type="text"
                placeholder={placeholder}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                ref={ref}
                {...props}
              />
              <div className=" d-flex align-self-end ms-1">
                {renderSpinnerOrCheck()}
              </div>
            </div>
            <div className="d-flex justify-content-between col-11">
              {error && (
                <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
              )}
              {maxLength !== null && maxLength !== undefined && (
                <div className="mb-0  mt-1 ms-auto ">
                  <span className={counterClass}>
                    {inputValue.length}/{maxLength} caracteres.
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

InputCosto.displayName = 'InputCosto';
export default InputCosto;
