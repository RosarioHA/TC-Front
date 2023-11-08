

const InputSearch = () => {



  return (
      <div className="search-bar input-group border border-2 d-flex" >
        <input
          className="form-control border-0 input-search"
          type="text"
          value=""
          onChange=""
          placeholder= ""
        />
          <button className="btn border border-0" onClick="" id="icon-inputClose">
            <i className="material-symbols-outlined" >close</i>
          </button>
        <span className="input-group-append">
          <button
            className="btn border-0"
            type="button"
            onClick=""
            disabled=""
            id="icon-inputSearch">
            <i className="material-symbols-outlined" >search</i>
          </button>
        </span>
      </div>
  );
};

export default InputSearch;
