import { useState, forwardRef } from "react";
import { NumericFormat } from "react-number-format";

const InputCosto = forwardRef(
  ({ loading, saved, placeholder, id, error, readOnly, onChange, initialValue, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(initialValue || '');

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
          <div className={`input-costo p-3 col-12 ${error ? 'costo-error' : ''}`}>
            <p className="text-sans-p-grey mb-0">{placeholder}</p>
          </div>
        ) : (
          <div className="d-flex input-container">
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              className={`input-costo p-3 col-12 ${error ? 'costo-error' : ''} ${inputStyle()}`}
              type="text"
              placeholder={placeholder}
              id={id}
              value={inputValue}
              onValueChange={(values) => {
                const { value } = values;
                setInputValue(value);
                if (onChange) {
                  onChange(value);
                }
              }}
              ref={ref}
              {...props}
            />
          </div>
        )}
        <div className="d-flex justify-content-between col-11">
          {error && (
            <p className="text-sans-h6-darkred mt-1 mb-0">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

InputCosto.displayName = 'InputCosto';
export default InputCosto;
