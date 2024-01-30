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
import { yupResolver } from '@hookform/resolvers/yup';
import { esquemaEdicionUsuarios } from "../../validaciones/esquemaEditarUsuario";
import { useAuth } from "../../context/AuthContext";
import { useFiltroCompetencias } from "../../hooks/useFiltrarCompetencias";
import { useFormContext } from "../../context/FormAlert";
import ModalAbandonoFormulario from "../../components/commons/modalAbandonoFormulario";

const EdicionUsuario = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [ editMode, setEditMode ] = useState(false);
  const { userDetails } = useUserDetails(id);
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegion();
  const { dataSector, loadingSector } = useSector();
  const [ regionId, setRegionId ] = useState(null);
  const [ sectorId, setSectorId ] = useState(null);
  const { dataFiltroCompetencias, loadingFiltroCompetencias } = useFiltroCompetencias(regionId, sectorId);
  const [ competenciasAsignadas, setCompetenciasAsignadas ] = useState([]);
  const [ competenciasSeleccionadas, setCompetenciasSeleccionadas ] = useState([]);
  const { updateHasChanged } = useFormContext();
  const [ hasChanged, setHasChanged ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);


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
      is_active: userDetails?.is_active !== undefined ? userDetails.is_active === 'activo' : false
    },
  });

  useEffect(() => {
    if (userDetails) {
      setCompetenciasAsignadas(userDetails.competencias_asignadas || []);
      if (userDetails.perfil === 'GORE' && userDetails.regionId) {
        setRegionId(userDetails.regionId);
      } 
      if (userDetails.perfil === 'Usuario Sectorial' && userDetails.sectorId) {
        setSectorId(userDetails.sectorId);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.competencias_asignadas) {
      // Transforma las competencias asignadas en un formato que el componente hijo pueda entender
      const asignadasIds = userDetails.competencias_asignadas.map(competencia => competencia.id);
      setCompetenciasSeleccionadas(asignadasIds);
    }
  }, [userDetails]);

  const perfil = watch('perfil') || '';
  const renderizadoCondicional = editMode ? perfil : userDetails?.perfil;

  useEffect(() => {
    if (editMode && userDetails) {
      // En modo edicion, actualiza los valores iniciales con los valores actuales.
      setValue('nombre_completo', userDetails.nombre_completo || "");
      setValue('email', userDetails.email || "");
      setValue('perfil', userDetails.perfil || "");
      setValue('region', userDetails.region ? userDetails.region.id : null);
      setValue('sector', userDetails.sector ? userDetails.sector.id : null);
      setValue('is_active', userDetails.is_active !== undefined ? userDetails.is_active : false);
    }
  }, [ editMode, userDetails, setValue ]);

  //detecta cambios sin guardar en el formulario
  function handleOnChange(event) {
    const data = new FormData(event.currentTarget);
    // Verifica si hay cambios respecto al valor inicial
    const formHasChanged = Array.from(data.entries()).some(([name, value]) => {
      const initialValue = userDetails[name];
      return value !== String(initialValue);
    });
    setHasChanged(formHasChanged);
    // Actualiza el valor de hasChanged en el contexto
    updateHasChanged(formHasChanged);
  }

  const handleBackButtonClick = () => {
    if (editMode) {
      setEditMode(false);
    } else if (hasChanged) {
      setIsModalOpen(true);
    } else {
      history(-1);
    }
  };

  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

  //opciones de Perfil, Region y Sector 
  const opcionesGroups = Array.isArray(dataGroups) ? dataGroups.map(group => ({
    value: group.id,
    label: group.name
  })) : [];
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));
  const opcionesSector = dataSector.map(sector => ({
    value: sector.id,
    label: sector.nombre,
  }));
   //opciones Filtro Competencias
   const opcionesFiltroCompetencias = dataFiltroCompetencias.map(competencia => ({
    value: competencia.id,
    label: competencia.nombre,
  }));


  const handleInputClick = (e) => {
    // Previene que el evento se propague al boton
    e.stopPropagation();
  }

  const handleDdSelectChange = (fieldName, selectedOption) => {
    try {
      if (selectedOption && selectedOption.label) {
        setValue(fieldName, selectedOption.label);
        setSectorId('');
        setRegionId('');
      }
    } catch (error) {
      console.error('Error en handleDdSelectChange:', error);
    }
  };

  const handleDdSelectBuscadorChange = (fieldName, selectedOption) => {
    try {
      if (selectedOption && selectedOption.value) {
        setValue(fieldName, selectedOption.value);
        if (fieldName === 'region') {
          setRegionId(selectedOption.value); // Actualiza regionId cuando se selecciona una nueva región
        }
        if (fieldName === 'sector') {
          setSectorId(selectedOption.value); // Actualiza sectorId cuando se selecciona un nuevo sector
        }
        
      }
    } catch (error) {
      console.error('Error en handleDdSelectBuscadorChange:', error);
    }
  };

  const handleEstadoChange = (selectionName, nuevoEstado) => {
    const isActivo = nuevoEstado === "activo";
    setValue("is_active", isActivo);
  };


  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      competencias_asignadas: competenciasSeleccionadas,
    };

      try {
      await editUser(id, payload);
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
          <h3 className="text-sans-h3 ms-3 mb-0">Perfil de: {userDetails?.nombre_completo} </h3>
        </div>
        {userIsSubdere && (
          <button className="btn-secundario-s" onClick={handleEditClick}>
            <i className="material-symbols-rounded me-2">edit</i>
            <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
        <div className="d-flex align-items-center mb-4">
          <CustomInput
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

        <div className="my-4 col-11">
          {loadingGroups ? (
            <div>Cargando perfiles...</div>
          ) : dataGroups && dataGroups.length > 0 ? (
            <DropdownSelect
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
        <div className="my-4 ">
          {/* Renderizan de manera condicional según el Perfil de usuario */}
          {renderizadoCondicional === 'GORE' && (
            <div className="my-4 col-11 ">
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
                />) : (
                <input type="text" value="No hay regiones para mostrar" readOnly />
              )}
            </div>
          )}
          {renderizadoCondicional === 'Usuario Sectorial' && (
            <div className="my-4 col-11 ">
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
                />) : (
                <input type="text" value="No hay organismos para mostrar" readOnly />
              )}
            </div>
          )}

        </div>
        <div className="my-4 col-11">
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
                    label="Estado"
                  />
                )}
              />
              {errors.is_active && (
                <p className="text-sans-h6-darkred mt-2 mb-0">{errors.is_active.message}</p>
              )}
            </div>
          )}
        </div>

        {!editMode && (
          <div className="mb-5 mt-5">
            {competenciasAsignadas.length > 0 ? (
              <table>
                <thead className="">
                  <tr className="">
                    <th className="col-1">
                      <p className="ms-4">#</p>
                    </th>
                    <th className="col-5">
                      <p>{competenciasAsignadas.length > 1 ? "Competencias Asignadas" : "Competencia Asignada"}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competenciasAsignadas.map((competencia, index) => (
                    <tr key={competencia.id} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                      <td>
                        <p className="ms-4 my-3">{index + 1}</p>
                      </td>
                      <td>
                        <p className="my-3">{competencia.nombre}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <p>No hay Competencias asignadas</p>
              </div>
            )}
          </div>
        )}


        {/* input Filtro Competencias */}
        <div className="mb-5">
          <div className="my-3 col-11">
            {loadingFiltroCompetencias ? (
              <div>Cargando competencias...</div>
            ) : editMode && dataFiltroCompetencias && dataFiltroCompetencias.length > 0 ? (
              <DropdownSinSecciones
                label="Competencias disponibles para asignar (Opcional)"
                placeholder="Busca el nombre de la competencia"
                options={opcionesFiltroCompetencias}
                selectedOptions={competenciasSeleccionadas}
                onSelectionChange={setCompetenciasSeleccionadas}
                onClick={handleInputClick}
                onMouseDown={handleInputClick}
              />
            ) : editMode && (
              <>
                <label className="text-sans-h5 input-label ms-3 ms-sm-0">Competencia</label>
                <input
                  className="input-s p-3 input-textarea"
                  type="text"
                  value="No hay Competencias para mostrar"
                  readOnly
                />
              </>
            )}
          </div>
        </div>

        {!editMode && (
          <div className="d-flex align-items-center mb-4 col-11">
          <CustomInput
            label="Fecha de Creación"
            placeholder={userDetails ? userDetails.created : ''}
            readOnly={true}
            maxLength={null}
          />
          {editMode ? <i className="col material-symbols-rounded ms-2">lock</i> : ''}
        </div>
        )}

        {!editMode && (
          <div className="d-flex align-items-center mb-4 col-11">
          <CustomInput
            label="Fecha último inicio de sesión"
            placeholder={userDetails ? userDetails.last_login_display : ''}
            readOnly={true}
            maxLength={null}
          />
          {editMode ? <i className="col material-symbols-rounded ms-2">lock</i> : ''}
        </div>
        )}
        

        {editMode && (
          <button className="btn-primario-s mb-5" type="submit">
            <i className="material-symbols-rounded me-2">save</i>
            <p className="mb-0">Guardar</p>
          </button>
        )}

      </form>
      {editUserLoading && <p>Cargando...</p>}
      {editUserError && <p>Error al editar el usuario: {editUserError.message}</p>}

      {isModalOpen && (
        <ModalAbandonoFormulario
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          direction='-1'
          goBack={true}
        />
      )}
    </div>
  );
}

export default EdicionUsuario;