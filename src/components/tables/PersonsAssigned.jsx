import { useState } from 'react';
import { Table } from './Table';

export const PersonsAssigned = ({ usuariosSubdere, usuariosDipres, usuariosSectoriales, usuariosGore }) => {

  // Cambiar el estado inicial para que coincida con la primera pestaña en el nuevo orden
  const [selectedTab, setSelectedTab] = useState('Subdere');

  // Reorganizar el array TypeUser para reflejar el nuevo orden de las pestañas
  const TypeUser = [
    { id: 2, tipoUsuario: 'SUBDERE' },
    { id: 3, tipoUsuario: 'Sectorial' },
    { id: 4, tipoUsuario: 'GORE' },
    { id: 1, tipoUsuario: 'DIPRES' },
  ];

  
  const userMappings = {
    DIPRES: usuariosDipres,
    SUBDERE: usuariosSubdere,
    Sectorial: usuariosSectoriales,
    GORE: usuariosGore
  };

  const getUserData = () => userMappings[selectedTab] || [];
  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  return (
    <>
      <ul className="nav nav-underline border-bottom d-flex justify-content-evenly" id="pills-tab" role="tablist">
        {TypeUser.map((user) => (
          <li className="nav-item" role="presentation" key={user.id}>
            <button
              className={`nav-link ${selectedTab === user.tipoUsuario ? 'actived' : ''}`}
              id={`pills-${user.tipoUsuario.toLowerCase()}-tab`}
              data-bs-toggle="pill"
              data-bs-target={`#pills-${user.tipoUsuario.toLowerCase()}`}
              type="button"
              role="tab"
              aria-controls={`pills-${user.tipoUsuario.toLowerCase()}`}
              aria-selected={selectedTab === user.tipoUsuario ? 'true' : 'false'}
              onClick={() => handleTabClick(user.tipoUsuario)}
            >
              {user.tipoUsuario}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content" id="tables">
        {TypeUser.map((user) => (
          <div
            className={`tab-pane fade ${selectedTab === user.tipoUsuario ? 'show active' : ''}`}
            id={`pills-${user.tipoUsuario.toLowerCase()}`}
            role="tabpanel"
            aria-labelledby={`pills-${user.tipoUsuario.toLowerCase()}-tab`}
            tabIndex="0"
            key={user.id}
          >
          <Table userData={getUserData()} userType={selectedTab} />
          </div>
        ))}
      </div>
    </>
  );
};