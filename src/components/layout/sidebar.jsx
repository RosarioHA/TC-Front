import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFormContext } from '../../context/FormAlert';
import ModalAbandonoFormulario from '../commons/modalAbandonoFormulario';

const SidebarLink = ({ to, icon, text, badgeCount, onClick }) => {
  const { hasChanged } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleLinkClick = (e) => {
    if (hasChanged) {
      e.preventDefault();
      handleOpenModal();
    } else {
      onClick && onClick(e);
    }
  };
  return (
    <>
    {!hasChanged ? (
      <NavLink to={to} className="mx-4 btn-link" onClick={handleLinkClick}>
        <i className="material-symbols-outlined mx-3">{icon}</i>
        {badgeCount && <i className="badge badge-notification mx-3">{badgeCount}</i>}
        <u>{text}</u>
      </NavLink>
    ) : (
      <>
        <NavLink  className="mx-4 btn-link" onClick={handleOpenModal}>
          <i className="material-symbols-outlined mx-3">{icon}</i>
          {badgeCount && <i className="badge badge-notification mx-3">{badgeCount}</i>}
          <u>{text}</u>
        </NavLink>
        {isModalOpen && <ModalAbandonoFormulario onClose={handleCloseModal} isOpen={isModalOpen} direction={to}/>}
      </>
    )}
    </>
  );
};

const Sidebar = () => {
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userObservador = userData?.perfil?.includes('Observador');

  const handleItemClick = (e) => {
    // Puedes personalizar esta función según tus necesidades
    console.log('Item clicked', e);
  };

  return (
    <div className="sidebar  fixed-top  d-flex flex-column flex-shrink-0  border-end ">
      <div className="my-0 text-start">
        <div className="line-container row ">
          <div id="lineBlue" />
          <div id="lineRed" />
        </div>
        <div className="d-flex justify-content-start">
          <span className="text-serif-title mb-1"><u>Plataforma de Gestión de <br /> Transferencia de <br /> Competencias</u></span>
        </div>
        <hr className="w-100 mt-0" />
      </div>
      <ul className="nav nav-pills flex-column mb-auto mt-0">
        <li className="my-1">
          <SidebarLink to="/home" icon="home" text="Inicio" onClick={handleItemClick} />
        </li>
        <li className="my-1">
          <SidebarLink to="#" icon="mail" text="Notificaciones" badgeCount={10} onClick={handleItemClick} />
        </li>
        {(userSubdere || userObservador) && (
          <>
            <hr className="w-85 mx-4" />
            <span className="title-section  ms-4 my-1">Gestión de Usuarios</span>
          </>
        )}
          {userSubdere && (
          <SidebarLink to="/home/crear_usuario" icon="person_add" text="Crear Usuarios" onClick={handleItemClick} />
        )}
        {(userSubdere || userObservador) && (
          <SidebarLink to="/home/administrar_usuarios" icon="supervised_user_circle" text="Administrar Usuarios" onClick={handleItemClick} />
        )}
        {(userSubdere || userObservador) && (
          <>
            <hr className="w-85 mx-4" />
            <span className="title-section ms-4 my-2">Gestión de Competencias</span>
          </>)}
        {userSubdere && (
          <SidebarLink to="/home/crear_competencia" icon="post_add" text="Crear Competencia" onClick={handleItemClick} />
        )}
        {(userSubdere || userObservador) && (
          <SidebarLink to="/home/listado_competencias" icon="library_books" text="Listado de Competencias" badgeCount={99} onClick={handleItemClick} />
        )}
        <hr className="w-85 mx-4" />

      </ul >
      <div className="d-flex justify-content-between  border-top w-100 " >
        <div className="circle-user" id="icon-user">
          <span className="material-symbols-outlined my-auto">
            person
          </span>
        </div>
        <span className="my-auto me-auto">Mi Perfil</span>
        <div className="dropdown">
          <a className="" data-bs-toggle="dropdown" aria-expanded="false" id="icon-setting">
            <span className="material-symbols-outlined">
              settings
            </span>
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li><a className="dropdown-item" href="/">New project...</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;