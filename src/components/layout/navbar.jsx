import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { useFormContext } from '../../context/FormAlert';
import ModalAbandonoFormulario from '../commons/modalAbandonoFormulario';

const Navbar = () => {
  const { userData, logout } = useAuth();
  const { hasChanged } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    if (hasChanged) {
      handleOpenModal();
    } else {
      logout();
    }
  };

  return (
    <>
      <nav className="d-flex bg-white border-bottom justify-content-end me-5 w-100 sticky-top mt-1 py-1">
        <div className="align-self-center mx-2 text-sans-h5">
          <span>Hola, {userData.nombre_completo || userData.rut}</span>
        </div>
        <button className="btn-logout mx-2 my-2" type="button" onClick={handleLogout}>
          <u>Cerrar Sesión</u><i className="material-symbols-outlined">logout</i>
        </button>
      </nav>
      {isModalOpen && <ModalAbandonoFormulario isOpen={isModalOpen} onClose={handleCloseModal} direction="/" />}
    </>
  );
};

export default Navbar;