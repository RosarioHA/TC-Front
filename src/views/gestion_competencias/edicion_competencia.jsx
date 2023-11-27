import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";

const EdicionCompetencia = () => {
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
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex  align-items-center justify-content-between mb-5">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver</p>
          </button>
          <h3 className="text-sans-h3 ms-3 mb-0">Competencia: $NombreCompetencia</h3>
        </div>
        <button className="btn-secundario-s" onClick={handleEditClick}>
          <i className="material-symbols-rounded me-2">edit</i>
          <p className="mb-0">Editar</p>
        </button> 
      </div>

      <form>
        <div className="mb-4">
          < CustomInput 
            label="Nombre de la Competencia (Obligatorio)"
            placeholder="Escribe el nombre de la competencia"
            id="nombre"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="mb-4">
          REGION
        </div>

        <div className="mb-4">
          SECTOR
        </div>

        <div className="mb-4">
          <DropdownSelect
            label="Origen de la competencia (Obligatorio)"
            placeholder="Elige el origen de la competencia"
            readOnly={!editMode}
            // options={origenCompetencia}
            // onSelectionChange={(selectedOption) => {
            //   handleOrigenChange(selectedOption);
            //   setValue('origen', selectedOption, { shouldValidate: true });
            // }}
            // selected={origenSeleccionado}
            />
        </div>

        <div className="mb-4">
          <DropdownSelect 
            label="Elige el ámbito de la competencia (Obligatorio)"
            placeholder="Elige el ámbito de la competencia"
            readOnly={!editMode}
            // options={ambitoCompetencia}
            // onSelectionChange={(selectedOption) => {
            //   handleAmbitoChange(selectedOption);
            //   setValue('ambito', selectedOption, { shouldValidate : true})
            // }}
            // selected={ambitoSeleccionado} 
          />
        </div>

        <div className="mb-4">
          USUARIOS
        </div>

        <div className="mb-4">
          OFICIO - puede subir otro archivo? solo puede descargar?
        </div>

        <div className="mb-4">
          PLAZO
        </div>

        <button className="btn-primario-s mb-5" type="submit">
          <i className="material-symbols-rounded me-2">save</i>
          <p className="mb-0">Guardar</p>
        </button>

      </form>
    </div>
  );
}

export default EdicionCompetencia;