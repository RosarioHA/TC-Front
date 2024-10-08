import { forwardRef, useImperativeHandle } from 'react';



export const ModalAdvertencia = forwardRef(function ModalAdvertencia({ isOpen, onClose, onConfirm }, ref) {
  const handleClose = () => {
    onClose();
  };

  useImperativeHandle(ref, () => ({
    handleClose
  }));

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content p-3">
        <div className="d-flex justify-content-between">
          <p className="mb-0 mt-2 text-sans-m-semibold">Estás guardando la selección de regiones y recomendación de transferencia</p>
          <button onClick={handleClose} className="btn-close mt-2"></button>
        </div>
        <hr />
        <p className="mb-0">Si editas esta selección una vez que hayas avanzado en el proceso, es posible que pierdas información.</p>
        <hr />
        <div className="d-flex justify-content-between">
        <button className="btn-secundario-ghost text-decoration-underline me-3" onClick={handleClose}  >
          Seguir Modificando 
        </button>
          <button className="btn-primario-s" onClick={onConfirm}>Guardar selección</button>
        </div>
      </div>
    </div>
  );
});
