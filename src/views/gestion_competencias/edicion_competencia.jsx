import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownCheckbox from "../../components/dropdown/checkbox";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
// temporales
import { userData } from "../../Data/Usuarios";

const EdicionCompetencia = () => {
  const history = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);

  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleUsuariosChange = useCallback(
    (selectedOptions) => {
      const updatedUsuarios = {};
      selectedOptions.forEach((usuario) => {
        if (usuario && usuario.id) {
          updatedUsuarios[usuario.id] = true;
        }
      });
      setUsuariosSeleccionados(updatedUsuarios);
    },
    []
  );
  console.log("usuarios seleccionados:", usuariosSeleccionados)

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
          <DropdownCheckbox
            label="Región (Obligatorio)" 
            placeholder="Elige la o las regiones donde se ejercerá la competencia" 
            options={['opcion 1', 'opcion 2', 'opcion 3']}
            readOnly={!editMode}
            // onSelectionChange={(selectedOption) => {
            //   handleRegionesChange(selectedOption);
            //   setValue('regiones', selectedOption, { shouldValidate: true });
            // }}
            // selected={regionesSeleccionadas} 
          />
        </div>

        <div className="mb-4">
          <DropdownCheckbox
            label="Elige el sector de la competencia (Obligatorio)" 
            placeholder="Elige el sector de la competencia" 
            options={['opcion 1', 'opcion 2', 'opcion 3']}
            readOnly={!editMode}
            // onSelectionChange={(selectedOption) => {
            //   handleSectorChange(selectedOption);
            //   setValue('sectores', selectedOption, { shouldValidate: true });
            // }}
            // selected={sectoresSeleccionados} 
            />
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
          < DropdownConSecciones 
            label="Asignar Usuarios (Opcional)"
            placeholder="Busca el nombre de la persona"
            readOnly={!editMode}
            options={['opcion 1', 'opcion 2', 'opcion 3']}
            selectedOptions={Object.keys(usuariosSeleccionados)
            .map(id => userData.find(user => user.id === id))}
            onSelectionChange={handleUsuariosChange}
          />
        </div>

        <div className="mb-4 border">
          OFICIO - No se puede editar, solo descargar.
        </div>

        <div className="mb-4">
          < CustomInput 
            label="Plazo para formulario sectorial (Obligatorio)"
            placeholder="Escribe el número de días corridos"
            id="plazo"
            maxLength={null}
            readOnly={!editMode} />
        </div>

        <div className="mb-4">
        < CustomInput 
          label="Plazo para formulario GORE (Obligatorio)"
          placeholder="Escribe el número de días corridos"
          id="plazoGORE"
          maxLength={null}
          readOnly={!editMode} />        
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