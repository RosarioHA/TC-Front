export const ModalAbandonoFormulario = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content p-3">
        <div className="d-flex justify-content-between">
          <p className="text-sans-m-semibold mb-0 mt-2 ms-3">Estás saliendo del formulario</p>
          <button onClick={handleClose} className="btn-close mt-2 me-3"></button>
        </div>
        <hr/>
        <p className="text-sans-p mb-0 ms-3">--**** mensaje con las consecuencias de salir *****---</p>
        <hr/>
        <div className="d-flex justify-content-between">
          <button className="btn-secundario-ghost text-decoration-underline ms-3">Salir del formulario</button>
          <button className="btn-primario-s text-decoration-underline me-3" onClick={handleClose}>Seguir en el formulario</button>
        </div>
      </div>
    </div>
  );
};