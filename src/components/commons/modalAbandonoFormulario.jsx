import { forwardRef, useRef, useImperativeHandle } from "react";
import { NavLink, } from 'react-router-dom';
import { useFormContext } from "../../context/FormAlert";

const ModalAbandonoFormulario = forwardRef(function ModalAbandonoFormulario({ isOpen, onClose, direction }, ref) {
  const { updateHasChanged, updateEditMode } = useFormContext();

  const handleClose = () => {
    onClose();
  };

  const handleLinkClick = () => {
    handleClose();
    updateHasChanged(false);
    updateEditMode(false);
  };
  const handleBtnClick = () => {
    handleClose();
    updateHasChanged(false);
    updateEditMode(false);
  }

  const handleCloseRef = useRef(handleClose);

  useImperativeHandle(ref, () => ({
    handleClose: handleCloseRef.current
  }));

  //renderizado condicional para boton de abandono de formulario desde modal
  const renderLinkOrButton = () => {
    if (direction) {
      return (
        <NavLink to={direction} className="mx-4 btn-link-fit px-3" onClick={handleLinkClick}>
          <u>Salir del formulario</u>
        </NavLink>
      );
    } else {
      return (
        <button className="btn-secundario-ghost text-decoration-underline me-3" onClick={handleBtnClick}>
          Salir del formulario
        </button>
      );
    }
  };

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
          {/* <NavLink to={direction} className="mx-4 btn-link-fit px-3" onClick={handleLinkClick}>
            <u>Salir del formulario</u>
          </NavLink> */}
          {renderLinkOrButton()}
          <button className="btn-primario-s text-decoration-underline me-3" onClick={handleCloseRef.current}>Seguir en el formulario</button>
        </div>
      </div>
    </div>
  );
});

export default ModalAbandonoFormulario;