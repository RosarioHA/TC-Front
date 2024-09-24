export const DesplegableEstadoFase2 = ({ title, onButtonClick, isOpen}) => {

  return (
    <div className={`p-3 ${isOpen ? 'celeste-container' : 'grey-container'} `}> 
      <div className="d-flex justify-content-between align-items-center gap-3 align-items-center">
          <h2 className="text-sans-h3 mt-0 mb-3">{title}</h2>
          <div>BADGE</div>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-3 align-items-center">
          <p className="text-sans-p">Para entrar a la etapa de pre-implementación debes ingresar a la nueva instancia. Todos los archivos y formularios del levantamiento de información seguirán estando disponibles.</p>
          <div className="col-3 col-xxl-2 d-flex justify-content-end">
              <button className="btn-secundario-s-round" onClick={onButtonClick}>
                  <p className="text-decoration-underline mb-0">{isOpen ? 'Ocultar sección' : 'Mostrar sección'}</p>
                  <span className="material-icons ms-1">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
              </button>
          </div>
       </div>
     </div>
  );
};