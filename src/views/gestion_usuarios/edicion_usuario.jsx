import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";

const EdicionUsuario = () => {
  const history = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Administrar Usuarios</h2>
      <div className="d-flex  align-items-center justify-content-between mb-5">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver</p>
          </button>
          <h3 className="text-sans-h3 ms-3 mb-0">Perfil de: $NombreUsuario</h3>
        </div>
        <button className="btn-secundario-s" onClick={handleEditClick}>
          <i className="material-symbols-rounded me-2">edit</i>
          <p className="mb-0">Editar</p>
        </button> 
      </div>

      <form>
        <div className="mb-4">
          < CustomInput
            label="RUT (Obligatorio)"
            placeholder="Escribe el RUT con guión sin puntos."
            id="rut"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="mb-4">
          < CustomInput
            label="Nombre Completo (Obligatorio)"
            placeholder="Escribe el nombre completo."
            id="nombre"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="mb-4">
          < CustomInput
            label="Correo electrónico"
            placeholder="Escribe el correo electrónico del usuario."
            id="mail"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="mb-4">
          PERFIL - DopdownSelect
        </div>
        <div>
          Regiones GORE - DropdownSelectBuscador
        </div>
        <div>
          Organismos Sectorial - DropdownSelectBuscador
        </div>

        <div className="mb-4">
          ESTADO - 
        </div>

        <div className="mb-4">
          COMPETENCIAS - DropdownSinSecciones
        </div>

        <button className="btn-primario-s mb-5" type="submit">
          <i className="material-symbols-rounded me-2">save</i>
          <p className="mb-0">Guardar</p>
        </button>

      </form>
    </div>
  );
}

export default EdicionUsuario;