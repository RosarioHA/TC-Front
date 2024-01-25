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
        {/* <button className="mx-4 btn-link" onClick={handleOpenModal}>
          <i className="material-symbols-outlined mx-3">{icon}</i>
          <p>{text}</p>
        </button> */}
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
    <>
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
          {/* <NavLink to="/home" className="mx-4 btn-link" aria-current="page" type="button" >
            <i className="material-symbols-outlined mx-3 ">
              home
            </i> <span className="text-link">Inicio</span>
          </NavLink> */}
          <SidebarLink to="/home" icon="home" text="Inicio" onClick={handleItemClick} />
        </li>
        <li className="my-1">
          {/* <NavLink to="#" className="mx-4 btn-link">
            <i className="material-symbols-outlined mx-3">
              mail
            </i><u>Notificaciones</u>

            <i className="material-symbols-outlined mx-3"></i>
            <i className="badge badge-notification mx-3">10</i>
          </NavLink> */}
          <SidebarLink to="#" icon="mail" text="Notificaciones" badgeCount={10} onClick={handleItemClick} />
        </li>
        {(userSubdere || userObservador) && (
          <>
            <hr className="w-85 mx-4" />
            <span className="title-section  ms-4 my-1">Gestión de Usuarios</span>
          </>
        )}
        {/* {userSubdere && (
          <li className="my-1">
            <NavLink to="/home/crear_usuario" className="btn-sidebar my-1 mx-4" type="button">
              <u>Crear Usuarios </u> <i className="material-symbols-outlined">
                person_add
              </i>
            </NavLink>
          </li>)} */}
          {userSubdere && (
          <SidebarLink to="/home/crear_usuario" icon="person_add" text="Crear Usuarios" onClick={handleItemClick} />
        )}
        {/* {(userSubdere || userObservador) && (
          <li className="my-1">
            <NavLink to="/home/administrar_usuarios" className="mx-4 btn-link" type="button">
              <i className="material-symbols-outlined mx-3">supervised_user_circle</i>
              <u>Administrar Usuarios</u>
            </NavLink>
          </li>
        )} */}
        {(userSubdere || userObservador) && (
          <SidebarLink to="/home/administrar_usuarios" icon="supervised_user_circle" text="Administrar Usuarios" onClick={handleItemClick} />
        )}
        {(userSubdere || userObservador) && (
          <>
            <hr className="w-85 mx-4" />
            <span className="title-section ms-4 my-2">Gestión de Competencias</span>
          </>)}
        {/* {userSubdere && (
          <>
            <li>
              <NavLink to="/home/crear_competencia" className="btn-sidebar my-1 mx-4" >
                <u><strong>Crear Competencia</strong></u><i className="material-symbols-outlined">
                  post_add
                </i>
              </NavLink>
            </li>
          </>
        )} */}
        {userSubdere && (
          <SidebarLink to="/home/crear_competencia" icon="post_add" text="Crear Competencia" onClick={handleItemClick} />
        )}
        {/* {(userSubdere || userObservador) && (
          <li className="my-1">
            <NavLink to="/home/listado_competencias" className="mx-4 btn-link" type="button">
              <i className="material-symbols-outlined mx-3">library_books</i>
              <i className="badge badge-notification mx-3">99+</i>
              <u>Listado de Competencias</u>
            </NavLink>
          </li>
        )} */}
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
    {/* {isModalOpen && <ModalAbandonoFormulario ref={modalRef} onClose={handleCloseModal} />} */}
    </>
  );
};

export default Sidebar;