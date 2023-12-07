import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownSelectBuscador from "../../components/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/dropdown/checkbox_sinSecciones_conTabla";
import RadioButtons from "../../components/forms/radio_btns";
import { useEditUser } from "../../hooks/useEditUser";
import { useUserDetails } from "../../hooks/useUserDetail";
import { useGroups } from "../../hooks/useGroups";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { useCompetenciasList } from "../../hooks/useCompetenciasList";

const EdicionUsuario = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    perfil: null,
    region: null,
    sector: null,
  });
  //const [selectedPerfil, setSelectedPerfil] = useState(null);
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegion();
  const { dataSector, loadingSector } = useSector();
  const { competencias, loading: competenciasLoading, error: competenciasError } = useCompetenciasList();
  const { userDetails } = useUserDetails(id);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: 'manual',
    defaultValues: {
      region: userDetails?.region?.id || null,
    },
  });

  useEffect(() => {
    // Verifica si las competencias se han cargado
    if (!competenciasLoading && !competenciasError) {
      console.log("Competencias en vista Editar usuario:", competencias);
    }
  }, [competenciasLoading, competenciasError, competencias]);

  useEffect(() => {
    if (editMode && userDetails) {
      const rutValue = userDetails.rut || '';
      const nombreValue = userDetails.nombre_completo || '';
      const emailValue = userDetails.email || '';
      const perfilValue = userDetails.perfil || '';
      const regionValue = userDetails.region ? userDetails.region.id : null;
      const sectorValue = userDetails.sector || '';
      const estadoValue = userDetails.estado || '';
      setValue('rut', rutValue);
      setValue('nombre_completo', nombreValue);
      setValue('email', emailValue);
      setValue('perfil', perfilValue);
      setValue('region', regionValue);
      setValue('sector', sectorValue);
      setValue('is_active', estadoValue);

      console.log("Valores del formulario después de la configuración:", watch());
    }
  }, [editMode, setValue, userDetails, watch]);

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  //opciones de perfil 
  const  opcionesGroups = dataGroups.map(group => ({
    value:group.id,
    label: group.name
  }))

  const handlePerfilChange = (fieldName, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.label,
    }));
  };

  // opciones region
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));

  const handleRegionChange = (fieldName, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.id,
    }));
  };
  // const handleRegionChange = (selectedRegion) => {
  //   setValue('region', selectedRegion.id);
  // };

  // opciones sector
  const opcionesSector = dataSector.map(sector => ({
    value:sector.id,
    label:sector.nombre,
  }));

  const handleSectorChange = (fieldName, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.id,
    }));
  };
  // const handleSectorChange = (selectedSector) => {
  //   setValue('sector', selectedSector.value);
  // };

  const handleEstadoChange = (nuevoEstado) => {
    setActiveButton(nuevoEstado);
    // Transformar el string a booleano
    const isActivo = nuevoEstado === 'activo';
    setValue('is_active', isActivo);
  };

  // const handleCompetenciasChange = (selectedCompetencias) => {
  //   setValue('competencias', selectedCompetencias);
  // }
  
  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const onSubmit = async () => {
    try {
      // Combina los valores actuales del formulario con los valores antiguos de userDetails
      const updatedFormData = {
        ...userDetails,
        ...formData,
      };
  
      console.log("Datos que se enviarán al backend:", updatedFormData);
      await editUser(id, updatedFormData); // Envia los datos actualizados al backend
      setEditMode(false); // Desactiva el modo de edicion despues de guardar
    } catch (error) {
      console.error("Error al editar el usuario:", error);
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
        <div className="d-flex align-items-center mb-4">
          < CustomInput
            label="RUT (Obligatorio)"
            placeholder={userDetails ? userDetails.rut : ''}
            id="rut"
            name="rut"
            readOnly={true}
            maxLength={null}
          />
          {editMode ? <i className="col material-symbols-rounded ms-2">lock</i> : '' }
        </div>

        <div className="my-4">
          < CustomInput
            label="Nombre Completo (Obligatorio)"
            placeholder={userDetails ? userDetails.nombre_completo : ''}
            id="nombre_completo"
            name="nombre_completo"
            readOnly={!editMode}
            maxLength={null}
            onChange={(newValue) => handleInputChange('nombre_completo', newValue)}
            initialValue={userDetails ? userDetails.nombre_completo : ''}
          />
        </div>

        <div className="my-4">
          < CustomInput
            label="Correo electrónico"
            placeholder={userDetails ? userDetails.email : ''}
            id="email"
            name="email"
            readOnly={!editMode}
            maxLength={null}
            onChange={(newValue) => handleInputChange('email', newValue)}
            initialValue={userDetails ? userDetails.email : ''}
          />
        </div>

        <div className="my-4">
          < DropdownSelect
            label="Elige el perfil de usuario (Obligatorio)"
            placeholder={userDetails ? userDetails.perfil : ''}
            id="perfil"
            name="perfil"
            options={loadingGroups ? [] : opcionesGroups}
            readOnly={!editMode}
            onSelectionChange={(selectedOption) => handlePerfilChange('perfil', selectedOption)}
            selectedOption={formData.perfil}
            initialValue={userDetails ? userDetails.perfil : ''}
          />
        </div>

        {/* Renderizan de manera condicional segun el tipo de usuario */}
        {userDetails && userDetails.perfil === 'GORE' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige la región a la que representa (Obligatorio)"
              placeholder={userDetails.region || ''}
              id="region"
              name="region"
              readOnly={!editMode}
              options={loadingRegiones ? [] : opcionesDeRegiones}
              onSelectionChange={handleRegionChange}
              initialValue={userDetails ? userDetails.region : ''}
            />
          </div>
        )}
        {userDetails && userDetails.perfil === 'Usuario Sectorial' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige el organismo al que pertenece (Obligatorio)"
              placeholder={userDetails.sector || 'Selecciona un sector'}
              id="sector"
              name="sector"
              readOnly={!editMode}
              options={loadingSector ? []: opcionesSector}
              onSelectionChange={handleSectorChange}
              initialValue={userDetails ? userDetails.sector : ''}
            />
          </div>
        )}

        <div className="my-4">
          < Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <>
                <RadioButtons
                  readOnly={!editMode}
                  id="is_active"
                  initialState={activeButton}
                  handleEstadoChange={handleEstadoChange}
                  field={field}
                  errors={errors}
                  is_active={userDetails ? userDetails.is_active : false}
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
            options={competencias.map((competencia) => ({
              value: competencia.id,
              label: competencia.nombre,
            }))}
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