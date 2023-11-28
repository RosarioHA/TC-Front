import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownSelectBuscador from "../../components/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/dropdown/checkbox_sinSecciones_conTabla";

const EdicionUsuario = () => {
  const history = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
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
          <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
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
          < DropdownSelect
            label="Elige el perfil de usuario (Obligatorio)"
            placeholder="Elige el perfil de usuario"
            options={['opcion 1', 'opcion 2']}
            readOnly={!editMode}
          />
        </div>
        <div className="mb-4">
          <DropdownSelectBuscador
            label="Elige la región a la que representa (Obligatorio)"
            placeholder="Elige una región"
            readOnly={!editMode}
            options={['opcion 1', 'opcion 2']}
            //onSelectionChange={handleRegionChange}
          />
        </div>
        <div className="mb-4">
          <DropdownSelectBuscador
            label="Elige el organismo al que pertenece (Obligatorio)"
            placeholder="Elige un organismo"
            readOnly={!editMode}
            options={['opcion 1', 'opcion 2']}
            // onSelectionChange={handleSectorChange} 
          />
        </div>

        <div className="my-4">
          ESTADO - no es componente, deberia serlo?
        </div>

        <div className="mb-4">
          <DropdownSinSecciones
            label="Competencia Asignada (Opcional)"
            placeholder="Busca el nombre de la competencia"
            readOnly={!editMode}
            options={['opcion 1', 'opcion 2', 'opcion 3']}
            selectedOptions={['opcion 1', 'opcion 2']}
            // onSelectionChange={(selectedOptions) => {
            //   field.onChange(selectedOptions);
            //   handleCompetenciasChange(selectedOptions);
            //   }}
            // onClick={handleInputClick}
            // onMouseDown={handleInputClick}
          />
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