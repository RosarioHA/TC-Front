import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
const Sidebar = () =>
{

  const { userData} = useAuth(); 

  const userSubdere = userData?.perfil?.includes('SUBDERE'); 

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
          <NavLink to="/home" className="mx-4 btn-link" aria-current="page" type="button" >
            <i className="material-symbols-outlined mx-3 ">
              home
            </i> <span className="text-link">Inicio</span>
          </NavLink>
        </li>
        <li className="my-1">
          <NavLink to="#" className="mx-4 btn-link">
            <i className="material-symbols-outlined mx-3">
              mail
            </i><u>Notificaciones</u>

            <i className="material-symbols-outlined mx-3"></i>
            <i className="badge badge-notification mx-3">10</i>
          </NavLink>
        </li>
        <hr className="w-85 mx-4" />
        <span className="title-section  ms-4 my-1">Gestión de Usuarios</span>
        { userSubdere && (
        <li className="my-1">
          <NavLink to="/home/crear_usuario" className="btn-sidebar my-1 mx-4" type="button">
            <u>Crear Usuarios </u> <i className="material-symbols-outlined">
              person_add
            </i>
          </NavLink>
        </li>)}
        <li className="my-1">
          <NavLink to="/home/administrar_usuarios" className="mx-4 btn-link" type="button">
            <i className="material-symbols-outlined mx-3">supervised_user_circle</i>
            <u>Administrar Usuarios</u>
          </NavLink>
        </li>
        <hr className="w-85 mx-4" />
        <span className="title-section ms-4 my-2">Gestión de Competencias</span>
        { userSubdere && (
        <li>
          <NavLink to="/home/crear_competencia" className="btn-sidebar my-1 mx-4" >
            <u><strong>Crear Competencia</strong></u><i className="material-symbols-outlined">
              post_add
            </i>
          </NavLink>
        </li>
        )}
        <li className="my-1">
          <NavLink to="/home/listado_competencias" className="mx-4 btn-link" type="button">
            <i className="material-symbols-outlined mx-3">library_books</i>
            <i className="badge badge-notification mx-3">99+</i>
            <u>Listado de Competencias</u>
          </NavLink>
        </li>
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