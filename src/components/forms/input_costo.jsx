import { useState, forwardRef } from "react";
import { NumericFormat } from "react-number-format";

const ImputCosto = forwardRef(
  ({ loading, saved, placeholder, id, error, readOnly, onChange, initialValue, ...props }, ref) => {
    const [ inputValue, setInputValue ] = useState(initialValue || '');

    const handleInputChange = (e) => {
      const value = e.target.value;
      const formattedValue = value.replace(/,/g, '');
      setInputValue(formattedValue);
      if (onChange) {
        onChange(formattedValue);
      }
    };
    
    const inputStyle = () => {
      if (loading) {
        return `input-costo p-3 col-12 ${error ? 'costo-error' : ''}`;
      }
      if (saved) {
        return `input-costo costo-saved p-3 col-12 `;
      }
      if (error) {
        return `input-costo  p-3 col-12 costo-error`;
      }
      return null;
    };
    
    return (
      <div className="d-flex flex-column input-container col-11">
        {readOnly ? (
          <>
            <div className={`input-costo p-3 col-12 ${error ? 'costo-error' : ''}`}>
              <p className="text-sans-p-grey mb-0">{placeholder}</p>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex input-container">
              <NumericFormat
                thousandSeparator=","
                className={`input-costo p-3 col-12 ${error ? 'costo-error' : ''} ${inputStyle()}`} 
                type="text"
                placeholder={placeholder}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                ref={ref}
                {...props}
              />
             {/* <div className="d-flex align-self-end ms-1">
                {loading && !saved && <div className="spinner-border text-primary" role="status"></div>}
              </div> */}
            </div>
            <div className="d-flex justify-content-between col-11">
              {error && (
                <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

ImputCosto.displayName = 'ImputCosto';
export default ImputCosto;
