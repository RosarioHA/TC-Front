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
  const [originalData, setOriginalData] = useState({});
  const [currentPerfil, setCurrentPerfil] = useState("");
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegion();
  const { dataSector, loadingSector } = useSector();
  const { competencias, loading: competenciasLoading, error: competenciasError } = useCompetenciasList();
  const { userDetails } = useUserDetails(id);
  console.log("userDetails", userDetails);
  console.log("originalData", originalData)
  console.log("originalData is_active", originalData.is_active);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: "manual",
    defaultValues: {
      perfil: userDetails?.perfil || "",
      region: userDetails?.region?.id || null,
      sector: userDetails?.sector?.id || null,
      is_active: userDetails?.is_active || false,
    },
  });

  useEffect(() => {
    if (userDetails) {
      setOriginalData({
        ...userDetails,
        is_active: userDetails.is_active || false,
      });

      const is_activeValue = userDetails.is_active === "activo";
      setValue("is_active", is_activeValue);
    }
  }, [userDetails, setValue]);

  useEffect(() => {
    // Verifica si las competencias se han cargado
    if (!competenciasLoading && !competenciasError) {
      console.log("Competencias en vista Editar usuario:", competencias);
    }
  }, [competenciasLoading, competenciasError, competencias]);

  useEffect(() => {
    // Define el conjunto de data a utilizar en renderizado condicional de campos Region y Sector.
    if (editMode) {
      setCurrentPerfil(originalData.perfil || '');
    } else {
      setCurrentPerfil(userDetails?.perfil || '');
    }
  }, [editMode, userDetails, originalData]);

  useEffect(() => {
    if (editMode && userDetails) {
      const rutValue = userDetails.rut || '';
      const nombreValue = userDetails.nombre_completo || '';
      const emailValue = userDetails.email || '';
      const perfilValue = userDetails.perfil || '';
      const regionValue = userDetails.region ? userDetails.region.id : null;
      const sectorValue = userDetails.sector ? userDetails.sector.id : null;
      const estadoValue = userDetails.is_active ? 'activo' : 'inactivo';
      
      setOriginalData({
        rut: rutValue,
        nombre_completo: nombreValue,
        email: emailValue,
        perfil: perfilValue,
        region: regionValue,
        sector: sectorValue,
        is_active: estadoValue,
      });

      setValue('rut', rutValue);
      setValue('nombre_completo', nombreValue);
      setValue('email', emailValue);
      setValue('perfil', perfilValue);
      setValue('region', regionValue);
      setValue('sector', sectorValue);
      setValue('is_active', estadoValue);
    }
  }, [editMode, setValue, userDetails, watch]);

  const handleBackButtonClick = () => {
    history(-1);
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleInputChange = (fieldName, value) => {
    setOriginalData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  //opciones de Perfil, Region y Sector 
  const  opcionesGroups = dataGroups.map(group => ({
    value:group.id,
    label: group.name
  }))
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));
  const opcionesSector = dataSector.map(sector => ({
    value:sector.id,
    label:sector.nombre,
  }));

  const handleDdSelectChange = async (fieldName, selectedOption) => {
    try {
      console.log('DropdownChange - fieldName:', fieldName, 'selectedOption:', selectedOption.label);
      if (selectedOption && selectedOption.label) {
        setValue(fieldName, selectedOption.label);
  
        setOriginalData(prevData => {
          const newData = {
            ...prevData,
            [fieldName]: selectedOption.label,
            ...(selectedOption.label === 'Usuario Sectorial' ? { region: null } : {}),
            ...(selectedOption.label === 'GORE' ? { sector: null } : {}),
            ...(selectedOption.label === 'DIPRES' ? { sector: null, region: null } : {}),
            ...(selectedOption.label === 'SUBDERE' ? { sector: null, region: null } : {}),
            ...(selectedOption.label === 'Usuario Observador' ? { sector: null, region: null } : {}),
          };
  
          console.log('Updated originalData:', newData);
          return newData;
        });
      }
    } catch (error) {
      console.error('Error en handleDropdownChange:', error);
    }
  };
  console.log("originalData.perfil", originalData.perfil)
  
  const handleDdSelectBuscadorChange = async (fieldName, selectedOption) => {
    try {
      console.log('DropdownChange - fieldName:', fieldName, 'selectedOption:', selectedOption.value);
      if (selectedOption && selectedOption.value) {
        setValue(fieldName, selectedOption.value);
        // Actualiza el estado originalData con el ID del sector
        setOriginalData((prevData) => ({
          ...prevData,
          [fieldName]: selectedOption.value,
        }));
      }
    } catch (error) {
      console.error('Error en handleDropdownChange:', error);
    }
  }; 
  
  const handleEstadoChange = (selectionName, nuevoEstado) => {
    const isActivo = nuevoEstado === "activo";
    setValue("is_active", isActivo);
    setOriginalData((prevData) => ({
      ...prevData,
      is_active: isActivo,
    }));
  };

  // const handleCompetenciasChange = (selectedCompetencias) => {
  //   setValue('competencias', selectedCompetencias);
  // }

  const onSubmit = async () => {
    try {
      const updatedFormData = {
        ...userDetails,
        ...originalData,
      };

      console.log("Datos que se enviarán al backend:", updatedFormData);
      await editUser(id, updatedFormData);
      setEditMode(false);
      history('/home/success', { state: { origen: "editar_usuario" } });
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
            onSelectionChange={(selectedOption) => handleDdSelectChange('perfil', selectedOption)}
            selectedOption={originalData.perfil}
            initialValue={userDetails ? userDetails.perfil : ''}
          />
        </div>
        
        {/* Renderizan de manera condicional segun el Perfil de usuario */}
        {currentPerfil === 'GORE' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige la región a la que representa (Obligatorio)"
              placeholder={userDetails.region || ''}
              id="region"
              name="region"
              readOnly={!editMode}
              options={loadingRegiones ? [] : opcionesDeRegiones}
              onSelectionChange={(selectedOption) => handleDdSelectBuscadorChange('region', selectedOption)}
              initialValue={userDetails ? userDetails.region : ''}
            />
          </div>
        )}
        {currentPerfil === 'Usuario Sectorial' && (
          <div className="my-4">
            <DropdownSelectBuscador
              label="Elige el organismo al que pertenece (Obligatorio)"
              placeholder={userDetails.sector || 'Selecciona un sector'}
              id="sector"
              name="sector"
              readOnly={!editMode}
              options={loadingSector ? []: opcionesSector}
              onSelectionChange={(selectedOption) => handleDdSelectBuscadorChange('sector', selectedOption)}
              initialValue={userDetails ? userDetails.sector : ''}
            />
          </div>
        )}

        <div className="my-4">
          {!editMode ? (
            <div className="mb-5">
              <h5 className="text-sans-h5">Estado</h5>
              <button
                type="button"
                className="btn-primario-s"
                disabled
              >
                {originalData.is_active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          ) : (
            <div className="mb-5">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <RadioButtons
                    readOnly={!editMode}
                    id="is_active"
                    initialState={originalData.is_active}
                    handleEstadoChange={handleEstadoChange}
                    field={field}
                    errors={errors}
                    is_active={watch('is_active')}
                  />
                )}
              />
              {errors.estado && (
                <p className="text-sans-h6-darkred mt-2 mb-0">{errors.estado.message}</p>
              )}
            </div>
          )}
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