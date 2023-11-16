import { useState } from 'react'; // Importa el hook useState
import { TypeUser } from './../../Data/Usuarios';
import { Table } from './Table';

export const PersonsAssigned = () => {
  const [selectedTab, setSelectedTab] = useState(TypeUser[0].tipoUsuario); // Estado para rastrear la pestaña/tab activa

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  return (
    <>
      <ul className="nav nav-underline border-bottom d-flex justify-content-evenly" id="pills-tab" role="tablist">
        {TypeUser.map((user) => (
          <li className="nav-item" role="presentation" key={user.id}>
            <button
              className={`nav-link ${selectedTab === user.tipoUsuario ? 'active' : ''}`}
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
            <Table filterTypeId={String(user.id)} />
          </div>
        ))}
      </div>
    </>
  );
};