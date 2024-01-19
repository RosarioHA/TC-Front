import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownSelectBuscador from "../../components/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/dropdown/checkbox_sinSecciones_conTabla";
import { RadioButtons } from "../../components/forms/radio_btns";
import { competencias } from "../../Data/Competencias";
import { esquemaCreacionUsuario } from "../../validaciones/esquemaValidacion";
import { useCreateUser } from "../../hooks/usuarios/useCreateUser";
import { useRegion } from "../../hooks/useRegion";
import { useGroups } from "../../hooks/useGroups";
import { useSector } from "../../hooks/useSector";
import { useFiltroCompetencias } from "../../hooks/useFiltrarCompetencias";

const initialValues = {
  rut: '',
  nombre: '',
  email: '',
  perfil: '',
  estado: '',
  password: '',
  password2: '',
};

const CreacionUsuario = () => {
  const { createUser, isLoading, error } = useCreateUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataSector, loadingSector } = useSector();
  const [ estado, setEstado ] = useState('inactivo');
  const [ activeButton, setActiveButton ] = useState(null);
  const [ competenciasSeleccionadas, setCompetenciasSeleccionadas ] = useState([]);
  const [ perfilSeleccionado, setPerfilSeleccionado ] = useState(null);
  const [ sectorSeleccionado, setSectorSeleccionado ] = useState(null);
  const [ regionSeleccionada, setRegionSeleccionada ] = useState(null);
  const [ submitClicked, setSubmitClicked ] = useState(false);
  const { dataRegiones, loadingRegiones } = useRegion();
  const [ regionId, setRegionId ] = useState(null);
  const [ sectorId, setSectorId ] = useState(null);
  const { dataFiltroCompetencias, loadingFiltroCompetencias } = useFiltroCompetencias(regionId, sectorId);

  useEffect(() => {
    console.log("competencias seleccionadas en vista", competenciasSeleccionadas);
  }, [ competenciasSeleccionadas ]);


  // Maneja boton de volver atras.
  const history = useNavigate();
  const handleBackButtonClick = () => {
    history(-1);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(esquemaCreacionUsuario),
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: 'manual',
  });

  //opciones de perfil 
  const opcionesGroups = dataGroups.map(group => ({
    value: group.id,
    label: group.name
  }))
  const handlePerfilChange = (selectedValue) => {
    const selectedProfile = opcionesGroups.find((option) => option.value === selectedValue.value);
    if (selectedProfile) {
      setPerfilSeleccionado(selectedProfile.label);
    } else {
      setPerfilSeleccionado(null);
    }
  };

  //opciones de regiones
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));
  const handleRegionChange = (region) => {
    setRegionSeleccionada(region.value);
    setRegionId(region.value);
    setSectorId(null);
  }

  //opciones sector 
  const opcionesSector = dataSector.map(sector => ({
    value: sector.id,
    label: sector.nombre,
  }));
  const handleSectorChange = (sector) => {
    setSectorSeleccionado(sector.value);
    setSectorId(sector.value);
    setRegionId(null);
  }

  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado);
  };

  //opciones Filtro Competencias
  const opcionesFiltroCompetencias = dataFiltroCompetencias.map(competencia => ({
    value: competencia.id,
    label: competencia.nombre,
  }));

  const handleCompetenciasChange = (selectedOptions) => {
    setCompetenciasSeleccionadas(selectedOptions);
  }; 

  

  const handleInputClick = (e) => {
    // Previene que el evento se propague al boton
    e.stopPropagation();
  };

  const onSubmit = async (data) => {
    try {
      // Transformar competenciasSeleccionadas
      const competenciasModificar = competenciasSeleccionadas.map(id => ({
        id: parseInt(id, 10),
        action: 'add'
      }));

      // Construir el payload con el nuevo campo
      const payload = {
        ...data,
        nombre_completo: data.nombre,
        perfil: perfilSeleccionado,
        sector: sectorSeleccionado,
        region: regionSeleccionada,
        password: data.password,
        is_active: estado === 'activo',
        competencias_modificar: competenciasModificar,
      };
  
      // Eliminar campos que no se necesitan enviar
      delete payload.competenciasSeleccionadas;
  
      // Realizar la solicitud de creación de usuario con el payload actualizado
      const isValid = await trigger();
      if (submitClicked && isValid) {
        await createUser(payload);
        history('/home/success', { state: { origen: "crear_usuario" } });
      } else {
        console.log("El formulario no es válido o no se ha hecho click en 'Crear Usuario'");
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  { error && <div className="error-message">Error al crear el usuario: {error.message}</div> }

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Administrar Usuarios</h2>
      <div className="d-flex  align-items-center mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0">Volver</p>
        </button>
        <h3 className="text-sans-h3 ms-3 mb-0">Crear Usuario</h3>
      </div>

      <div className="col-10 ms-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Controller
              name="rut"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="RUT (Obligatorio)"
                  placeholder="Escribe el RUT con guión sin puntos."
                  id="rut"
                  maxLength={null}
                  error={errors.rut?.message}
                  ref={field.ref}
                  onBlur={() => field.onBlur()}
                  {...field} />
              )} />
          </div>
          <div className="mb-4">
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="Nombre Completo (Obligatorio)"
                  placeholder="Escribe el nombre completo."
                  id="nombre"
                  maxLength={null}
                  error={errors.nombre?.message}
                  ref={field.ref}
                  {...field} />
              )} />
          </div>
          <div className="mb-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="Correo electrónico (Obligatorio)"
                  placeholder="Escribe el correo electrónico del usuario."
                  id="mail"
                  maxLength={null}
                  error={errors.email?.message}
                  ref={field.ref}
                  {...field} />
              )} />
          </div>
          <div className="mb-4">
            < Controller
              name="perfil"
              control={control}
              render={({ field }) => (
                <>
                  {loadingGroups ? (
                    <div>Cargando perfiles...</div>
                  ) : dataGroups && dataGroups.length > 0 ? (
                    < DropdownSelect
                      label="Elige el perfil de usuario (Obligatorio)"
                      placeholder="Elige el perfil de usuario"
                      options={loadingGroups ? [] : opcionesGroups}
                      onSelectionChange={(selectedOption) =>
                      {
                        field.onChange(selectedOption.label);
                        handlePerfilChange(selectedOption);
                      }} />
                  ) : (
                    <input type="text" value="No hay perfiles para mostrar" readOnly />
                  )}
                </>
              )} />
            {errors.perfil && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.perfil.message}</p>
            )}
          </div>
          {/* Se generan condicionalmente nuevos componentes para el detalle de usuarios GORE y Sectorial */}
          {perfilSeleccionado === "Usuario Sectorial" && (
            <>
              <div className="d-flex mb-4 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="">Al usuario Sectorial debes asignarle un organismo.</h6>
              </div>
              <div className="mb-4">
                {loadingSector ? (
                  <div>Cargando organismos...</div>
                ) : dataSector && dataSector.length > 0 ? (
                  <DropdownSelectBuscador
                    label="Elige el organismo al que pertenece (Obligatorio)"
                    placeholder="Elige un organismo"
                    options={opcionesSector}
                    onSelectionChange={handleSectorChange}
                  />
                ) : (
                  <input type="text" value="No hay organismos para mostrar" readOnly />
                )}
              </div>
            </>
          )}
          {perfilSeleccionado === "GORE" && (
            <>
              <div className="d-flex mb-4 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="">Al usuario GORE debes asignarle una región.</h6>
              </div>
              <div className="mb-4">
                {loadingRegiones ? (
                  <div>Cargando regiones...</div>
                ) : dataRegiones && dataRegiones.length > 0 ? (
                  <DropdownSelectBuscador
                    label="Elige la región a la que representa (Obligatorio)"
                    placeholder="Elige una región"
                    options={opcionesDeRegiones}
                    onSelectionChange={handleRegionChange}
                  />
                ) : (
                  <input type="text" value="No hay regiones para mostrar" readOnly />
                )}
              </div>
            </>
          )}
          {/* input provisorio contraseña */}
          <div className="mb-4">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CustomInput
                  type="password"
                  label="Contraseña (Obligatorio)"
                  placeholder="Escribe la contraseña."
                  id="password"
                  maxLength={null}
                  error={errors.password?.message}
                  ref={field.ref}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mb-4">
            <Controller
              name="password2"
              control={control}
              render={({ field }) => (
                <CustomInput
                  type="password"
                  label="Reingresar Contraseña (Obligatorio)"
                  placeholder="Reingresa la contraseña."
                  id="password2"
                  maxLength={null}
                  error={errors.password2?.message}
                  ref={field.ref}
                  {...field}
                />
              )}
            />
          </div>

          {/* input estado */}
          <div className="mb-5">
            < Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <>
                  <RadioButtons
                    initialState={activeButton}
                    handleEstadoChange={handleEstadoChange}
                    field={field}
                    errors={errors}
                    altA="Activo"
                    altB="Inactivo"
                    label="Estado"
                  />
                </>
              )} />
          </div>

          {/* input Filtro Competencias */}
          <div className="mb-5">
            <div className="my-3">
              <Controller
                name="competenciasSeleccionadas"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    {loadingFiltroCompetencias ? (
                      <div>Cargando competencias...</div>
                    ) : dataFiltroCompetencias && dataFiltroCompetencias.length > 0 ? (
                      <DropdownSinSecciones
                        label="Competencia Asignada (Opcional)"
                        placeholder="Busca el nombre de la competencia"
                        options={opcionesFiltroCompetencias}
                        selectedOptions={field.value.map(val => parseInt(val, 10))}
                        onSelectionChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                          handleCompetenciasChange(selectedOptions);
                        }}
                        onClick={handleInputClick}
                        onMouseDown={handleInputClick}
                      />
                    ) : (
                      <input type="text" value="No hay competencias para mostrar" readOnly />
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <button className="btn-primario-s mb-5" type="submit" onClick={() => setSubmitClicked(true)}>
            <p className="mb-0">Crear Usuario</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </form>

      </div>
    </div>
  );
}

export default CreacionUsuario;
