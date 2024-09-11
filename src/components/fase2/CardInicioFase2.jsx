export const CardInicioFase2 = ({ onButtonClick }) => {

    return (
      <div className="lightgreen-container p-3">
        <h2 className="text-sans-h3-success mt-0 mb-3">Ya puedes iniciar la etapa de pre-implementación.</h2>
        <hr className="success-border-top"></hr>
        <div className="d-flex justify-content-between align-items-center gap-3 align-items-center">
            <p className="text-sans-p-sueccess">Para entrar a la etapa de pre-implementación debes ingresar a la nueva instancia. Todos los archivos y formularios del levantamiento de información seguirán estando disponibles.</p>
            <div className="col-2 d-flex justify-content-end">
                <button className="text-decoration-underline btn-secundario-s-success" onClick={onButtonClick}>
                    Iniciar etapa
                </button>
            </div>
            {/* <button className="text-decoration-underline btn-secundario-s-success" onClick={onButtonClick}>
                Iniciar etapa
            </button> */}

        </div>
      </div>
    );
  };
