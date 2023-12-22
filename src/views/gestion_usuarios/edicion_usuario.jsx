import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownSelectBuscador from "../../components/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/dropdown/checkbox_sinSecciones_conTabla";
import { RadioButtons } from "../../components/forms/radio_btns";
import { useEditUser } from "../../hooks/usuarios/useEditUser";
import { useUserDetails } from "../../hooks/usuarios/useUserDetail";
import { useGroups } from "../../hooks/useGroups";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { useCompetenciasList } from "../../hooks/competencias/useCompetenciasList";
import { yupResolver } from '@hookform/resolvers/yup';
import { esquemaEdicionUsuarios } from "../../validaciones/esquemaEditarUsuario";
import { useAuth } from "../../context/AuthContext";

const EdicionUsuario = () =>
{
  const { id } = useParams();
  const history = useNavigate();
  const [ editMode, setEditMode ] = useState(false);
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegion();
  const { dataSector, loadingSector } = useSector();
  const { competencias, loading: competenciasLoading, error: competenciasError } = useCompetenciasList();
  const { userDetails } = useUserDetails(id);
  //const [currentPerfil, setCurrentPerfil] = useState("");

  const { userData } = useAuth();
  const userIsSubdere = userData?.perfil?.includes('SUBDERE');

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: "onSubmit",
    resolver: yupResolver(esquemaEdicionUsuarios),
    defaultValues: {
      nombre_completo: userDetails?.nombre_completo || "",
      email: userDetails?.email || "",
      perfil: userDetails?.perfil || "",
      region: userDetails?.region?.id || null,
      sector: userDetails?.sector?.id || null,
      is_active: userDetails?.is_active !== undefined ? userDetails.is_active === 'activo' : false,
    },
  });

  const perfil = watch('perfil') || '';
  const renderizadoCondicional = editMode ? perfil : userDetails?.perfil;

  useEffect(() =>
  {
    if (editMode && userDetails)
    {
      // En modo edición, actualiza los valores iniciales con los valores actuales.
      setValue('nombre_completo', userDetails.nombre_completo || "");
      setValue('email', userDetails.email || "");
      setValue('perfil', userDetails.perfil || "");
      setValue('region', userDetails.region ? userDetails.region.id : null);
      setValue('sector', userDetails.sector ? userDetails.sector.id : null);
      setValue('is_active', userDetails.is_active !== undefined ? userDetails.is_active : false);
    }
  }, [ editMode, userDetails, setValue ]);

  useEffect(() =>
  {
    // Verifica si las competencias se han cargado
    if (!competenciasLoading && !competenciasError)
    {
      console.log("Competencias en vista Editar usuario:", competencias);
    }
  }, [ competenciasLoading, competenciasError, competencias ]);

  const handleBackButtonClick = () =>
  {
    history(-1);
  };

  const handleEditClick = () =>
  {
    setEditMode((prevMode) => !prevMode);
  };

  //opciones de Perfil, Region y Sector 
  const opcionesGroups = dataGroups.map(group => ({
    value: group.id,
    label: group.name
  }))
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));
  const opcionesSector = dataSector.map(sector => ({
    value: sector.id,
    label: sector.nombre,
  }));

  const handleDdSelectChange = (fieldName, selectedOption) =>
  {
    try
    {
      if (selectedOption && selectedOption.label)
      {
        setValue(fieldName, selectedOption.label);
      }
    } catch (error)
    {
      console.error('Error en handleDdSelectChange:', error);
    }
  };

  const handleDdSelectBuscadorChange = (fieldName, selectedOption) =>
  {
    try
    {
      if (selectedOption && selectedOption.value)
      {
        setValue(fieldName, selectedOption.value);
      }
    } catch (error)
    {
      console.error('Error en handleDdSelectBuscadorChange:', error);
    }
  };

  const handleEstadoChange = (selectionName, nuevoEstado) =>
  {
    const isActivo = nuevoEstado === "activo";
    setValue("is_active", isActivo);
  };

  // const handleCompetenciasChange = (selectedCompetencias) => {
  //   setValue('competencias', selectedCompetencias);
  // }

  const onSubmit = async (formData) =>
  {
    try
    {
      await editUser(id, formData);
      setEditMode(false);
      history('/home/success', { state: { origen: "editar_usuario" } });
    } catch (error)
    {
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
          <h3 className="text-sans-h3 ms-3 mb-0">Perfil de: {userDetails?.nombre_completo} </h3>
        </div>
        {userIsSubdere && (
          <button className="btn-secundario-s" onClick={handleEditClick}>
            <i className="material-symbols-rounded me-2">edit</i>
            <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
          </button>
        )}
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
          {editMode ? <i className="col material-symbols-rounded ms-2">lock</i> : ''}
        </div>

        <div className="my-4">
          <Controller
            name="nombre_completo"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Nombre Completo (Obligatorio)"
                placeholder={userDetails ? userDetails.nombre_completo : ''}
                id="nombre_completo"
                readOnly={!editMode}
                maxLength={null}
                error={errors.nombre_completo?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="my-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Correo electrónico"
                placeholder={userDetails ? userDetails.email : ''}
                id="email"
                readOnly={!editMode}
                maxLength={null}
                error={errors.email?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="my-4">
          {loadingGroups ? (
            <div>Cargando perfiles...</div>
          ) : dataGroups && dataGroups.length > 0 ? (
            < DropdownSelect
              label="Elige el perfil de usuario (Obligatorio)"
              placeholder={userDetails ? userDetails.perfil : ''}
              id="perfil"
              name="perfil"
              options={loadingGroups ? [] : opcionesGroups}
              readOnly={!editMode}
              control={control}
              onSelectionChange={(selectedOption) => handleDdSelectChange('perfil', selectedOption)}
              initialValue={userDetails ? userDetails.perfil : ''}
            />) : (
            <input type="text" value="No hay perfiles para mostrar" readOnly />
          )}
        </div>

        {/* Renderizan de manera condicional según el Perfil de usuario */}
        {renderizadoCondicional === 'GORE' && (
          <div className="my-4">
            {loadingRegiones ? (
                  <div>Cargando regiones...</div>
                ) : dataRegiones && dataRegiones.length > 0 ? (
            <DropdownSelectBuscador
              label="Elige la región a la que representa (Obligatorio)"
              placeholder={userDetails.region || ''}
              id="region"
              name="region"
              readOnly={!editMode}
              options={loadingRegiones ? [] : opcionesDeRegiones}
              control={control}
              onSelectionChange={(selectedOption) => handleDdSelectBuscadorChange('region', selectedOption)}
              initialValue={userDetails ? userDetails.region : ''}
            />  ) : (
              <input type="text" value="No hay regiones para mostrar" readOnly />
            )}
          </div>
        )}
        {renderizadoCondicional === 'Usuario Sectorial' && (
          <div className="my-4">
            {loadingSector ? (
                  <div>Cargando organismos...</div>
                ) : dataSector && dataSector.length > 0 ? (
            <DropdownSelectBuscador
              label="Elige el organismo al que pertenece (Obligatorio)"
              placeholder={userDetails.sector || 'Selecciona un sector'}
              id="sector"
              name="sector"
              readOnly={!editMode}
              options={loadingSector ? [] : opcionesSector}
              control={control}
              onSelectionChange={(selectedOption) => handleDdSelectBuscadorChange('sector', selectedOption)}
              initialValue={userDetails ? userDetails.sector : ''}
            />  ) : (
              <input type="text" value="No hay organismos para mostrar" readOnly />
            )}
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
                {userDetails?.is_active ? 'Activo' : 'Inactivo'}
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
                    initialState={watch('is_active')}
                    handleEstadoChange={handleEstadoChange}
                    field={field}
                    errors={errors}
                    is_active={watch('is_active')}
                    altA="Activo"
                    altB="Inactivo"
                  />
                )}
              />
              {errors.is_active && (
                <p className="text-sans-h6-darkred mt-2 mb-0">{errors.is_active.message}</p>
              )}
            </div>
          )}
        </div>


        <div className="my-4">
        {competencias && competencias.length > 0 ? (
          <DropdownSinSecciones
            label="Competencia Asignada (Opcional)"
            placeholder="Busca el nombre de la competencia"
            readOnly={!editMode}
            options={competencias.map((competencia) => ({
              value: competencia.id,
              label: competencia.nombre,
            }))}
            selectedOptions={[ 'opcion 1', 'opcion 2' ]}
          // onSelectionChange={(selectedOptions) => {
          //   field.onChange(selectedOptions);
          //   handleCompetenciasChange(selectedOptions);
          //   }}
          // onClick={handleInputClick}
          // onMouseDown={handleInputClick}
          /> ) : (
            <input type="text" value="No hay competencias" readOnly />
          )}
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