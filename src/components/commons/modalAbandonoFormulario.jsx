import { forwardRef, useRef, useImperativeHandle } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormContext } from "../../context/FormAlert";

const ModalAbandonoFormulario = forwardRef(function ModalAbandonoFormulario({ isOpen, onClose, direction, goBack }, ref) {
  const { updateHasChanged } = useFormContext();

  const history = useNavigate();
  const handleBackButtonClick = () => {
    updateHasChanged(false);
    history(-1);
  };

  const handleClose = () => {
    onClose();
  };

  const handleLinkClick = () => {
    handleClose();
    updateHasChanged(false);
    return <NavLink to={direction} />
  };

  const handleCloseRef = useRef(handleClose);

  useImperativeHandle(ref, () => ({
    handleClose: handleCloseRef.current
  }));

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content p-3">
        <div className="d-flex justify-content-between">
          <p className="text-sans-m-semibold mb-0 mt-2 ms-3">Estás saliendo del formulario</p>
          <button onClick={handleCloseRef.current} className="btn-close mt-2 me-3"></button>
        </div>
        <hr/>
        <p className="text-sans-p mb-0 ms-3">--**** mensaje con las consecuencias de salir *****---</p>
        <hr/>
        <div className="d-flex justify-content-between">
          {!goBack && <NavLink to={direction} className="mx-4 btn-link" onClick={handleLinkClick}>
            <u>Salir del formulario</u>
          </NavLink>}
          {goBack && <button className="btn-secundario-ghost" onClick={handleBackButtonClick}> Salir del formulario</button>}
          <button className="btn-primario-s text-decoration-underline me-3" onClick={handleCloseRef.current}>Seguir en el formulario</button>
        </div>
      </div>
    </div>
  );
});

export default ModalAbandonoFormulario;