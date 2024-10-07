export const DesplegableEstadoFase2 = ({ title, onButtonClick, isOpen}) => {

  return (
    <div className={`p-3 ${isOpen ? 'celeste-container' : 'grey-container'} `}> 
      <div className="d-flex justify-content-between align-items-center gap-3 align-items-center">
          <h4 className="text-sans-h4 mt-0">{title}</h4>
          <div className="badge-tipo mb-2">BADGE</div>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-3 align-items-center"  onClick={onButtonClick}>
          <div className="col-3 d-flex justify-content-end">
              <button className="btn-secundario-s-round" onClick={onButtonClick}>
                  <p className="text-decoration-underline mb-0">{isOpen ? 'Ocultar sección' : 'Mostrar sección'}</p>
                  <span className="material-icons ms-1">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
              </button>
          </div>
       </div>
     </div>
  );
};