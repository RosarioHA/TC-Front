import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';
//import { esquemaCreacionUsuario } from "../../validaciones/esquemaValidacion";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownSelectBuscador from "../../components/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/dropdown/checkbox_sinSecciones_conTabla";
import RadioButtons from "../../components/forms/radio_btns";
import { useEditUser } from "../../hooks/useEditUser";
import { useUserDetails } from "../../hooks/useUserDetail";
import { useGroups } from "../../hooks/useGroups";
import { useRegionComuna } from "../../hooks/useRegionComuna";
import { useSector } from "../../hooks/useSector";

const useFetchUserDetails = (id) => {
  const { userDetails, loading, error } = useUserDetails(id);
  console.log("User Details Hook:", userDetails, loading, error);
  return { details: userDetails, loading, error };
};

const EdicionUsuario = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [ activeButton, setActiveButton ] = useState(null);
  //const [ perfilSeleccionado, setPerfilSeleccionado ] = useState(null);
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegionComuna();
  const { dataSector, loadingSector} = useSector(); 
  const { details } = useFetchUserDetails(id);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: 'manual',
  });

  useEffect(() => {
    if (editMode && details) {
      const rutValue = details.rut || '';
      const nombreValue = details.nombre_completo || '';
      setValue('rut', rutValue);
      setValue('nombre', nombreValue);
      // ... Establecer otros valores según sea necesario
    }
  }, [editMode, setValue, details]);

  //opciones de perfil 
  const  opcionesGroups = dataGroups.map(group => ({
    value:group.id,
    label: group.name
  }))

  // const handlePerfilChange = ( selectedValue) => {
  //   const selectedProfile = opcionesGroups.find(option => option.value === selectedValue)
  //   if(selectedProfile) {
  //     setPerfilSeleccionado(selectedProfile.label);
  //   }else { 
  //     setPerfilSeleccionado(null); 
  // }}

  // opciones region
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));

  // const handleRegionChange = (region) => {
  //   setRegionSeleccionada(region);
  // }

  // opciones sector
  const opcionesSector = dataSector.map(sector => ({
    value:sector.id,
    label:sector.nombre,
  }));

  // const handleSectorChange = (sector) => {
  //   setSectorSeleccionado(sector);
  // }
  
  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleEstadoChange = (nuevoEstado) => {
    setActiveButton(nuevoEstado);
  };

  const onSubmit = async (data) => {
    try {
      await editUser(id, data); // Envia los datos actualizados al backend
      setEditMode(false); // Desactiva el modo de edicion después de guardar
    } catch (editUserError) {
      console.error("Error al editar el usuario:", editUserError);
    }
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          < CustomInput
            label="RUT (Obligatorio)"
            placeholder={details ? details.rut : ''}
            id="rut"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="my-4">
          < CustomInput
            label="Nombre Completo (Obligatorio)"
            placeholder={details ? details.nombre_completo : ''}
            id="nombre"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="my-4">
          < CustomInput
            label="Correo electrónico"
            placeholder={details ? details.email : ''}
            id="mail"
            readOnly={!editMode}
            maxLength={null}
          />
        </div>

        <div className="my-4">
          < DropdownSelect
            label="Elige el perfil de usuario (Obligatorio)"
            placeholder={details ? details.perfil : ''}
            options={loadingGroups ? [] : opcionesGroups}
            readOnly={!editMode}
            // onSelectionChange={(selectedOption) =>
            //   {
            //     field.onChange(selectedOption);
            //     handlePerfilChange(selectedOption);
            //   }}
          />
        </div>

        {/* Renderizan de manera condicional segun el tipo de usuario */}
        {details && details.perfil === 'GORE' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige la región a la que representa (Obligatorio)"
              placeholder={details.region || ''}
              readOnly={!editMode}
              options={loadingRegiones ? [] : opcionesDeRegiones}
              //onSelectionChange={handleRegionChange}
            />
          </div>
        )}
        {details && details.perfil === 'Usuario Sectorial' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige el organismo al que pertenece (Obligatorio)"
              placeholder={details.sector || 'Selecciona un sector'}
              readOnly={!editMode}
              options={loadingSector ? []: opcionesSector}
              // onSelectionChange={handleSectorChange}
            />
          </div>
        )}

        <div className="my-4">
          < Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <>
                <RadioButtons
                  readOnly={!editMode}
                  initialState={activeButton}
                  handleEstadoChange={handleEstadoChange}
                  field={field}
                  errors={errors}
                  is_active={details ? details.is_active : false}
                />
                {errors.estado && (
                  <p className="text-sans-h6-darkred mt-2 mb-0">{errors.estado.message}</p>
                )}
              </>
            )} />
        </div>

        <div className="my-4">
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

        {editMode && (
        <button className="btn-primario-s mb-5" type="submit">
          <i className="material-symbols-rounded me-2">save</i>
          <p className="mb-0">Guardar</p>
        </button>
        )}
       
      </form>
      {editUserLoading && <p>Cargando...</p>}
      {editUserError && <p>Error al editar el usuario: {editUserError.message}</p>}
    </div>
  );
}

export default EdicionUsuario;