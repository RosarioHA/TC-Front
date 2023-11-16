

const InputSearch = ({ value, onChange, placeholder, onSearch }) => {
  const handleInputChange = (event) => {
    const query = event.target.value;
    onChange(query);
  };

  const handleSearchClick = () => {
    onSearch(); 
  };

  return (
    <div className="search-bar input-group border border-2 d-flex">
      <input
          className="form-control border-0 input-search"
          type="text"
          value={value} 
          onChange={handleInputChange} // Vincula la función de cambio
          placeholder={placeholder} 
      />
      <button className="btn border border-0" onClick={() => onChange('')} id="icon-inputClose">
        <i className="material-symbols-outlined">close</i>
      </button>
      <span className="input-group-append">
        <button
          className="btn border-0"
          type="button"
          onClick={handleSearchClick}
          id="icon-inputSearch"
        >
          <i className="material-symbols-outlined">search</i>
        </button>
      </span>
    </div>
  );
};

export default InputSearch;