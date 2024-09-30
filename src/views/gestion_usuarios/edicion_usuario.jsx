import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
import CustomInput from "../../components/fase1/forms/custom_input";
import { DropdownSelectSimple } from "../../components/fase1/dropdown/selectSimple";
import DropdownSelectBuscador from "../../components/fase1/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/fase1/dropdown/checkbox_sinSecciones_conTabla";
import { OpcionesAB } from "../../components/fase1/forms/opciones_AB";
import { useEditUser } from "../../hooks/usuarios/useEditUser";
import { useUserDetails } from "../../hooks/usuarios/useUserDetail";
import { useGroups } from "../../hooks/useGroups";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { yupResolver } from '@hookform/resolvers/yup';
import { esquemaEdicionUsuarios } from "../../validaciones/fase1/esquemaEditarUsuario-Competencia";
import { useAuth } from "../../context/AuthContext";
import { useFiltroCompetencias } from "../../hooks/competencias/useFiltrarCompetencias";
import { useFormContext } from "../../context/FormAlert";
import ModalAbandonoFormulario from "../../components/fase1/commons/modalAbandonoFormulario";
import { DropdownSelectBuscadorUnico } from "../../components/fase1/dropdown/select_buscador_sector";

const EdicionUsuario = () =>
{
  const { id } = useParams();
  const history = useNavigate();
  const { userDetails } = useUserDetails(id);
  const { editUser, isLoading: editUserLoading, error: editUserError } = useEditUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataRegiones, loadingRegiones } = useRegion();
  const { dataSector, loadingSector } = useSector();
  const [ regionId, setRegionId ] = useState(null);
  const [ sectorId, setSectorId ] = useState(null);
  const { dataFiltroCompetencias } = useFiltroCompetencias(regionId, sectorId);
  const [ competenciasAsignadas, setCompetenciasAsignadas ] = useState([]);
  const [ competenciasSeleccionadas, setCompetenciasSeleccionadas ] = useState([]);
  const { editMode, updateEditMode, hasChanged, updateHasChanged } = useFormContext();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ conditionalFieldErrors, setConditionalFieldErrors ] = useState({});
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
      region: userDetails?.region || null,
      sector: userDetails?.sector|| null,
      is_active: userDetails?.is_active !== undefined ? userDetails.is_active === 'activo' : false,
    },
  });

  useEffect(() =>
  {
    if (userDetails)
    {
      setCompetenciasAsignadas(userDetails.competencias_asignadas || []);
      if (userDetails.perfil === 'GORE' && userDetails.regionId)
      {
        setRegionId(userDetails.regionId);
      }
      if (userDetails.perfil === 'Usuario Sectorial' && userDetails.sector)
      {
        setSectorId(userDetails.sector);
      }
    }
  }, [ userDetails ]);

  useEffect(() =>
  {
    if (userDetails && userDetails.competencias_asignadas)
    {
      // Transforma las competencias asignadas en un formato que el componente hijo pueda entender
      const asignadasIds = userDetails.competencias_asignadas.map(competencia => competencia.id);
      setCompetenciasSeleccionadas(asignadasIds);
    }
  }, [ userDetails ]);

  const perfil = watch('perfil') || '';
  const renderizadoCondicional = editMode ? perfil : userDetails?.perfil;

  useEffect(() =>
  {
    if (editMode && userDetails)
    {
      // En modo edicion, actualiza los valores iniciales con los valores actuales.
      setValue('nombre_completo', userDetails.nombre_completo || "");
      setValue('email', userDetails.email || "");
      setValue('perfil', userDetails.perfil || "");
      setValue('region', userDetails.region ? userDetails.region : null);
      setValue('sector', userDetails.sector ? userDetails.sector : null);
      setValue('is_active', userDetails.is_active !== undefined ? userDetails.is_active : false);
    }
  }, [ editMode, userDetails, setValue ]);

  //detecta cambios sin guardar en el formulario
  function handleOnChange(event)
  {
    const data = new FormData(event.currentTarget);
    const formEntries = Array.from(data.entries());

    // Verifica si hay cambios respecto al valor inicial
    const formHasChanged = Array.from(data.entries()).some(([ name, value ]) =>
    {
      const initialValue = userDetails[ name ];
      return value !== String(initialValue);
    });

    // Verificar cambios específicos
    const perfilChanged = watch('perfil') !== userDetails?.perfil;
    const regionChanged = watch('region') !== userDetails?.region?.id;
    const sectorChanged = watch('sector') !== userDetails?.sector;
    const estadoChanged = watch('is_active') !== (userDetails?.is_active === 'activo');

    // Establecer hasChanged si hay algún cambio
    updateHasChanged(formHasChanged || perfilChanged || regionChanged || sectorChanged || estadoChanged);
  }

  const handleBackButtonClick = () =>
  {
    if (editMode)
    {
      if (hasChanged)
      {
        setIsModalOpen(true);
      } else
      {
        updateEditMode(false);
      }
    } else
    {
      history(-1);
    }
  };

  const handleEditClick = () =>
  {
    if (!editMode)
    {
      // Si no está en modo edición, simplemente cambia a modo edición
      updateEditMode(true);
    } else if (hasChanged)
    {
      // Si está en modo edición y hay cambios, mostrar el modal de advertencia
      setIsModalOpen(true);
    } else
    {
      // Si está en modo edición y no hay cambios, cambia a modo visualización
      updateEditMode(false);
    }
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
  const opcionesSector = useMemo(() => dataSector.map(ministerio => ({
    label: ministerio.nombre,
    options: ministerio.sectores.map(sector => ({
      label: sector.nombre,
      value: sector.id,
      ministerioId: ministerio.id
    }))
  })), [ dataSector ]);
  //opciones Filtro Competencias
  const opcionesFiltroCompetencias = dataFiltroCompetencias.map(competencia => ({
    value: competencia.id,
    label: competencia.nombre,
  }));

  const handleInputClick = (e) =>
  {
    // Previene que el evento se propague al boton
    e.stopPropagation();
  }

  const handleDdSelectChange = (fieldName, selectedOption) => {
    try {
      if (selectedOption && selectedOption.label) {
        setValue(fieldName, selectedOption.label);
        setRegionId('');
      }
      updateHasChanged(true);
    } catch (error) {
      console.error('Error en handleDdSelectChange:', error);
    }
  };

  const handleSectorSelectionChange = (selectedSectorValue) => {
    setSectorId(selectedSectorValue); // Actualiza sectorId cuando se selecciona un nuevo sector
    setValue('sector', selectedSectorValue, { shouldValidate: true });
  
    if (selectedSectorValue === null) {
      setSectorId(null); // Limpia sectorId si la selección es nula
    }
  };


  const handleDdSelectBuscadorChange = (fieldName, selectedOption) => {
    try {
      if (selectedOption && selectedOption.value) {
        setValue(fieldName, selectedOption.value);
        if (fieldName === 'region') {
          setRegionId(selectedOption.value); 
        }
        if (fieldName === 'sector') {
          setSectorId(selectedOption.value);
        }
      } else {
        setValue(fieldName, null); // Limpia el valor si la selección es null
        if (fieldName === 'sector') {
          setSectorId(null); // Limpia sectorId si la selección es nula
        }
      }
      updateHasChanged(true);
    } catch (error) {
      console.error('Error en handleDdSelectBuscadorChange:', error);
    }
  };
  const handleEstadoChange = (nuevoEstado) =>
  {
    const isActivo = nuevoEstado === "activo";
    setValue("is_active", isActivo);
    updateHasChanged(true);
  };

  const onSubmit = async (formData) =>
  {
    // Validaciones adicionales para campos condicionales
    let validationErrors = {};
    if (formData.perfil === 'GORE' && !formData.region)
    {
      validationErrors.region = "Seleccionar una región para el perfil GORE.";
    }
    if (formData.perfil === 'Usuario Sectorial' && !formData.sector)
    {
      validationErrors.sector = "Seleccionar un sector para el perfil de Usuario Sectorial.";
    }
    // Actualizar el estado de los errores
    setConditionalFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0)
    {
      const payload = {
        ...formData,
        region: regionId, 
        competencias_asignadas: competenciasSeleccionadas,
      };
      try
      {
        await editUser(id, payload);
        updateEditMode(false);
        updateHasChanged(false);
        history('/home/success_edicion', { state: { origen: "editar_usuario", id } });
      } catch (error)
      {
        console.error("Error al editar el usuario:", error);
      }
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
          {dataGroups && dataGroups.length > 0 ? (
            <Controller
              name="perfil"
              control={control}
              render={({ field }) => (
                <DropdownSelectSimple
                  label="Elige el perfil de usuario (Obligatorio)"
                  placeholder={userDetails ? userDetails.perfil : ''}
                  id="perfil"
                  name="perfil"
                  options={loadingGroups ? [] : opcionesGroups}
                  readOnly={!editMode}
                  control={control}
                  onSelectionChange={(selectedOption) =>
                  {
                    field.onChange(selectedOption.label);
                    handleDdSelectChange('perfil', selectedOption);
                  }}
                  initialValue={userDetails ? userDetails.perfil : ''}
                />
              )} />
          ) : (
            <input type="text" value="No hay perfiles para mostrar" readOnly />
          )}
        </div>
        <div className="my-4 ">
          {/* Renderizan de manera condicional según el Perfil de usuario */}
          {renderizadoCondicional === 'GORE' && (
            <div className="my-4 col-11 ">
              {dataRegiones && dataRegiones.length > 0 ? (
                <Controller
                  name="region"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DropdownSelectBuscador
                      label="Elige la región a la que representa (Obligatorio)"
                      placeholder={userDetails.region || ''}
                      id="region"
                      name="region"
                      readOnly={!editMode}
                      options={loadingRegiones ? [] : opcionesDeRegiones}
                      control={control}
                      initialValue={userDetails?.region?.id}
                      onSelectionChange={(selectedOption) =>
                      {
                        field.onChange(selectedOption.value);
                        handleDdSelectBuscadorChange('region', selectedOption);
                      }}
                    />
                      {conditionalFieldErrors.region && (
                        <p className="text-sans-h6-darkred mt-2 mb-0">{conditionalFieldErrors.region}</p>
                      )}
                    </div>
                  )}
                />
              ) : (
                <input type="text" value="No hay regiones para mostrar" readOnly />
              )}
            </div>
          )}

          {renderizadoCondicional === 'Usuario Sectorial' && (
            <div className="my-4 col-11 ">
              {dataSector && dataSector.length > 0 ? (
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DropdownSelectBuscadorUnico
                        label="Elige el sector al que pertenece (Obligatorio)"
                        placeholder="Elige el sector de la competencia"
                        id="sector"
                        name="sector"
                        readOnly={!editMode}
                        options={loadingSector ? [] : opcionesSector}
                        control={control}
                        onSelectionChange={handleSectorSelectionChange}
                        sectorId={userDetails.sector || ''}
                        {...field}
                      />
                      {conditionalFieldErrors.sector && (
                        <p className="text-sans-h6-darkred mt-2 mb-0">{conditionalFieldErrors.sector}</p>
                      )}
                    </div>
                  )}
                />
              ) : (
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
                  <OpcionesAB
                    readOnly={!editMode}
                    id="is_active"
                    initialState={userDetails?.is_active}
                    handleEstadoChange={handleEstadoChange}
                    field={field}
                    errors={errors}
                    //is_active={watch('is_active')}
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
          <div className="mb-5 mt-5 col-11">
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
            {editMode && dataFiltroCompetencias && dataFiltroCompetencias.length > 0 ? (
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
        />
      )}
    </div>
  );
}

export default EdicionUsuario;