import { forwardRef, useRef, useImperativeHandle } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormContext } from "../../context/FormAlert";

const ModalAbandonoFormulario = forwardRef(function ModalAbandonoFormulario({ isOpen, onClose, direction, goBack }, ref) {
  const { updateHasChanged, updateEditMode } = useFormContext();
  const history = useNavigate();

  const handleClose = () => {
    onClose();
  };

  //cuando se entrega una direccion en parametro 'direction'
  const handleLinkClick = () => {
    handleClose();
    updateHasChanged(false);
    updateEditMode(false);
  };
  //cuando se entrega el parametro 'goBack={true}'
  const handleBtnClick = () => {
    handleClose();
    updateHasChanged(false);
    updateEditMode(false);
  };
  //cuando no se le entregan ninguno de los anteriores.
  const handleBackClick = () => {
    handleClose();
    updateHasChanged(false);
    updateEditMode(false);
    history(-1);
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
    } else if (goBack) {
      return (
        <button className="btn-secundario-ghost text-decoration-underline me-3" onClick={handleBackClick}>
          Salir del formulario
        </button>
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
        <p className="text-sans-p mb-0 ms-3">Si sales del formulario sin guardarlo, perderás los cambios que hayas realizado.</p>
        <hr/>
        <div className="d-flex justify-content-between">
          {renderLinkOrButton()}
          <button className="btn-primario-s text-decoration-underline me-3" onClick={handleCloseRef.current}>Seguir en el formulario</button>
        </div>
      </div>
    </div>
  );
});

export default ModalAbandonoFormulario;