import { useState } from 'react';
import { Table } from './Table';

export const PersonsAssigned = ({ usuariosSubdere, usuariosDipres, usuariosSectoriales, usuariosGore, usuariosSeguimiento }) => {
  const [selectedTab, setSelectedTab] = useState('SUBDERE');

  const TypeUser = [
    { id: 2, tipoUsuario: 'SUBDERE' },
    { id: 3, tipoUsuario: 'Sectorial' },
    { id: 4, tipoUsuario: 'Gore' },
    { id: 1, tipoUsuario: 'DIPRES' },
    { id: 5, tipoUsuario: 'Seguimiento'}
  ];

  const userMappings = {
    DIPRES: usuariosDipres,
    SUBDERE: usuariosSubdere,
    Sectorial: usuariosSectoriales,
    Gore: usuariosGore,
    Seguimiento: usuariosSeguimiento
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
              {user.tipoUsuario.toUpperCase()}
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
