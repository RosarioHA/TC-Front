import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//import { CompetenciasContext } from "../../context/competencias";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
//import DropdownCheckbox from "../../components/dropdown/checkbox";
//import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
import SubirArchivo from "../../components/forms/subir_archivo";
import { useGroups } from "../../hooks/useGroups";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { useUserDetails } from "../../hooks/usuarios/useUserDetail";


const EdicionCompetencia = () =>
{
  const { id } = useParams();
  const history = useNavigate();
  //const { competenciaDetails, loadingCompetencia, errorCompetencia } = useContext(CompetenciasContext);
  const [ editMode, setEditMode ] = useState(false);


  const { userDetails } = useUserDetails(id);
  const { dataGroups } = useGroups();
  const { dataRegiones } = useRegion();
  const { dataSector } = useSector();

  console.log(dataGroups, dataRegiones, dataSector, userDetails)

  const handleBackButtonClick = () =>
  {
    history(-1);
  };

  const handleEditClick = () =>
  {
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
          <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
        </button>
      </div>

      <form>
        <div className="mb-4">
          <CustomInput
            label="Nombre de la Competencia (Obligatorio)"
            placeholder=''
            id="nombre"
            readOnly=''
          />
        </div>

        <div className="mb-4">
          {/*  <DropdownCheckbox
            label="Región (Obligatorio)"
            placeholder="Elige la o las regiones donde se ejercerá la competencia"
            id="perfil"
            name="perfil"
            options=''
            readOnly=''
            control=''
            onSelectionChange=''
            initialValue=''
          />
        </div>


        <div className="mb-4">
          {/* <DropdownCheckbox
            label="Elige el sector de la competencia (Obligatorio)"
            placeholder='Elige el sector de la competencia'
            id="perfil"
            name="perfil"
            options=''
            readOnly=''
            control=''
            onSelectionChange=''
            initialValue=''
          /> */}
        </div>

        <div className="mb-4">
          <DropdownSelect
            label="Origen de la competencia (Obligatorio)"
            placeholder=''
            id="perfil"
            name="perfil"
            options=''
            readOnly=''
            control=''
            onSelectionChange=''
            initialValue=''
          />
        </div>

        <div className="mb-4">
          <DropdownSelect
            label="Elige el ámbito de la competencia (Obligatorio)"
            placeholder="Elige el ámbito de la competencia"
            id=""
            name=""
            options=''
            readOnly=''
            control=''
            onSelectionChange=''
            initialValue=''
          />
        </div>

        <div className="my-4">
          {/*  < DropdownConSecciones
            label="Asignar Usuarios (Opcional)"
            placeholder="Busca el nombre de la persona"
            readOnly=''
            options=''
            selectedOptions=""
            onSelectionChange=""
        /> */}
        </div>

        <div className="mb-5">
          {editMode ? (
            <div>
              <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
              <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            </div>
          ) : (
            <h5 className="text-sans-h5">Oficio correspondiente a la competencia</h5>
          )}
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-2">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
          <div className="row neutral-line align-items-center">
            <SubirArchivo
              readOnly={!editMode}
              index="1"
              fileType="No seleccionado" />
          </div>
        </div>

        <div className={editMode ? 'mb-3' : 'mb-4'}>
          < CustomInput
            label="Plazo para formulario sectorial (Obligatorio)"
            placeholder="Escribe el número de días corridos"
            id="plazo"
            maxLength={null}
            readOnly={!editMode} />
        </div>
        {editMode && (
          <div className="d-flex text-sans-h6-primary pb-4">
            <i className="material-symbols-rounded me-2">info</i>
            <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
          </div>
        )}

        <div className={editMode ? 'mb-3' : 'mb-4'}>
          < CustomInput
            label="Plazo para formulario GORE (Obligatorio)"
            placeholder="Escribe el número de días corridos"
            id="plazoGORE"
            maxLength={null}
            readOnly={!editMode} />
        </div>
        {editMode && (
          <div className="d-flex text-sans-h6-primary pb-4">
            <i className="material-symbols-rounded me-2">info</i>
            <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
          </div>
        )}

        {editMode ? (
          <button className="btn-primario-s my-5" type="submit">
            <i className="material-symbols-rounded me-2">save</i>
            <p className="mb-0">Guardar</p>
          </button>
        ) : (
          <button className="btn-secundario-s my-5" type="button">
            <p className="mb-0 text-decoration-underline">Ver historial de usuario</p>
            <i className="material-symbols-rounded ms-2">history</i>
          </button>
        )}

      </form>
    </div>
  );
}

export default EdicionCompetencia;