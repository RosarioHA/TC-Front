export const DesplegableEstadoFase2 = ({ title, onButtonClick, isOpen, estado, etapaFinalizada, data}) => {

  console.log("data en desplegable", data)

  const getBadgeClass = (estado) => {
    switch (estado) {
      case "Finalizada":
        return "badge-status-finish";
      case "En Estudio":
        return "badge-status-review";
      case "Aún no puede comenzar":
        return "badge-status-pending";
      default:
        return "";  // Clase por defecto si no hay coincidencias
    }
  };

  return (
    <div className={`p-3 ${isOpen ? 'celeste-container' : 'grey-container'} `}> 
      <div className="d-flex justify-content-between align-items-center gap-3 align-items-center">
          <h4 className="text-sans-h4 mt-0">{title}</h4>
          <div className={`mb-2 ${getBadgeClass(estado)}`}>{estado}</div>
      </div>

      { etapaFinalizada ? (
        <div className="d-flex justify-content-between align-items-center gap-3 align-items-center"  onClick={onButtonClick}>
          <div className="d-flex">
            <div className="text-sans-p">
              Tiempo transcurrido: <b>{data?.tiempo_transcurrido?.dias} días {data?.tiempo_transcurrido?.horas} horas {data?.tiempo_transcurrido?.minutos} minutos </b>
            </div>
            <div className="text-sans-p ms-4">Proceso finalizado en: <b>{data?.fecha_fin}</b></div>
          </div>
            <button className="btn-secundario-s-round p-1 px-3" onClick={onButtonClick}>
              <p className="mb-0">{isOpen ? 'Ocultar sección' : 'Mostrar sección'}</p>
              <span className="material-icons ms-1">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
            </button>
          
        </div>
      ) : (
        <div className="d-flex justify-content-end align-items-center gap-3 align-items-center"  onClick={onButtonClick}>
          <div className="col-3 d-flex justify-content-end mt-3">
            <button className="btn-secundario-s-round p-1 px-3" onClick={onButtonClick}>
              <p className="mb-0">{isOpen ? 'Ocultar sección' : 'Mostrar sección'}</p>
              <span className="material-icons ms-1">{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
            </button>
          </div>
        </div>
      )}

     </div>
  );
};