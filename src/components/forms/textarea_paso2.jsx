import { useState, forwardRef , useEffect} from "react";

const CustomInputArea = forwardRef(
  ({ loading, saved, label, placeholder, id, maxLength, error, readOnly, onChange, onBlur, initialValue, ...props }, ref) => {
    
    const [inputValue, setInputValue] = useState(initialValue || '');

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
    };

    // Añade aquí cualquier lógica adicional que desees ejecutar cuando el textarea pierda el foco
    const handleBlur = (e) => {
      if (onBlur) {
        onBlur(e);
      }
    };

    const counterClass = inputValue.length === maxLength ? "text-sans-h6-darkred" : "text-sans-h6";

    const renderSpinnerOrCheck = () => {
      if (loading) {
        return <div className="spinner-border text-primary" role="status"></div>;
      }
      if (saved) {
        return <i className="material-symbols-outlined text-success">check</i>; // Reemplaza esto con tu ícono de check real
      }
      return null;
    };


    return (
      <div className="d-flex flex-column input-container col-11">
        {readOnly ? (
          <div className="my-3">
            <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
            <div className={`input-s p-3 input-textarea ${error ? 'input-error' : ''}`}>
              <p className="text-sans-p-grey mb-0">{placeholder}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex input-container">
              <label className="text-sans-h5 input-label ms-3 ms-sm-0">{label}</label>
              <textarea
                className={`input-s p-3 input-textarea col-12 ${error ? 'input-error' : ''}`}
                type="text"
                placeholder={placeholder}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur} // Aplica aquí el evento onBlur
                ref={ref}
                {...props}
              />
              <div className=" d-flex align-self-end align-items-center mx-2 my-3">
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

CustomInputArea.displayName = 'CustomInputArea';
export default CustomInputArea;
