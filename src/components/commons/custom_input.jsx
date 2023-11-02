const CustomInput = ({label, placeholder, id}) => {
    return (
      <div>
        <label>{label}</label>
        <input 
        className=""
        type="text"
        placeholder={placeholder}
        id={id}
        />
      </div>
    );
  };
  
  export default CustomInput;