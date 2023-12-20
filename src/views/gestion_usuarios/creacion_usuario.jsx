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


const initialValues = {
  rut: '',
  nombre: '',
  email: '',
  perfil: '',
  estado: '',
  password: '',
};

const CreacionUsuario = () =>
{
  const { createUser, isLoading, error } = useCreateUser();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataSector, loadingSector } = useSector();
  const [ estado, setEstado ] = useState('inactivo');
  const [ activeButton, setActiveButton ] = useState(null);
  const [ competenciasSeleccionadas, setCompetenciasSeleccionadas ] = useState({});
  const [ perfilSeleccionado, setPerfilSeleccionado ] = useState(null);
  const [ sectorSeleccionado, setSectorSeleccionado ] = useState(null);
  const [ regionSeleccionada, setRegionSeleccionada ] = useState(null);
  const [ submitClicked, setSubmitClicked ] = useState(false);
  const { dataRegiones, loadingRegiones } = useRegion();

  console.log(dataSector);

  useEffect(() =>
  {
    console.log("competencias seleccionadas en vista", competenciasSeleccionadas);
  }, [ competenciasSeleccionadas ]);


  // Maneja boton de volver atras.
  const history = useNavigate();
  const handleBackButtonClick = () =>
  {
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

  useEffect(() =>
  {
    console.log("competencias seleccionadas en vista", competenciasSeleccionadas);
  }, [ competenciasSeleccionadas ]);

  //opciones de perfil 
  const opcionesGroups = dataGroups.map(group => ({
    value: group.id,
    label: group.name
  }))

  // const handlePerfilChange = ( selectedValue) => {
  //   console.log("selectedValue", selectedValue);
  //   const selectedProfile = opcionesGroups.find(option => option.value === selectedValue.label)
  //   console.log("selectedPRofile", selectedProfile);
  //   if(selectedProfile) {
  //     setPerfilSeleccionado(selectedProfile.label);
  //   }else { 
  //     setPerfilSeleccionado(null); 
  // }}
  // console.log("perfilSeleccionado", perfilSeleccionado)
  const handlePerfilChange = (selectedValue) =>
  {
    console.log("selectedValue", selectedValue);
    console.log("selectedValue.label", selectedValue.label);
    const selectedProfile = opcionesGroups.find((option) => option.value === selectedValue.value);
    console.log("selectedProfile", selectedProfile);

    if (selectedProfile)
    {
      setPerfilSeleccionado(selectedProfile.label); // Cambiado a selectedProfile.label
    } else
    {
      setPerfilSeleccionado(null);
    }
  };
  console.log("perfilSeleccionado", perfilSeleccionado)


  //opciones de regiones
  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));

  const handleRegionChange = (region) =>
  {
    setRegionSeleccionada(region);
  }

  //opciones sector 
  const opcionesSector = dataSector.map(sector => ({
    value: sector.id,
    label: sector.nombre,
  }));

  console.log(opcionesSector);

  const handleSectorChange = (sector) =>
  {
    setSectorSeleccionado(sector.value);
  }

  const handleEstadoChange = (nuevoEstado) =>
  {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado);
  };

  const handleInputClick = (e) =>
  {
    // Previene que el evento se propague al boton
    e.stopPropagation();
    console.log("propagacion detenida en vista Crear usuario")
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCompetenciasChange = useCallback(
    (selectedOptions) =>
    {
      const updatedCompetencias = {};
      selectedOptions.forEach((competencia) =>
      {
        updatedCompetencias[ competencia ] = true;
        selectedOptions.forEach((competenciaId) =>
        {
          updatedCompetencias[ competenciaId ] = true;
        });
        setCompetenciasSeleccionadas(updatedCompetencias);
      }, []);
    });

  const onSubmit = async (data) =>
  {
    try
    {
      const userData = {
        ...data,
        nombre_completo: data.nombre,
        perfil: perfilSeleccionado,
        sector: sectorSeleccionado,
        region: regionSeleccionada,
        password: data.password,
        is_active: estado === 'activo',
        competencias: Object.keys(competenciasSeleccionadas)
      };

      const isValid = await trigger();
      if (submitClicked && isValid)
      {
        await createUser(userData);
        console.log("Usuario creado con éxito");
        history('/home/success', { state: { origen: "crear_usuario" } });
      } else
      {
        console.log("El formulario no es válido o no se ha hecho click en 'Crear Usuario'");
      }
    } catch (error)
    {
      console.error('Error al enviar el formulario:', error);
    }
  };
  if (isLoading)
  {
    return <div>Cargando...</div>; // O tu componente personalizado de carga
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
                  label="Correo electrónico"
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
                < DropdownSelect
                  label="Elige el perfil de usuario (Obligatorio)"
                  placeholder="Elige el perfil de usuario"
                  options={loadingGroups ? [] : opcionesGroups}
                  onSelectionChange={(selectedOption) =>
                  {
                    field.onChange(selectedOption.label);
                    handlePerfilChange(selectedOption);
                  }} />
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
                <h6 className="">Al usuario Sectorial debes asignarle un organismo. </h6>
              </div>
              <div className="mb-4">
                <DropdownSelectBuscador
                  label="Elige el organismo al que pertenece (Obligatorio)"
                  placeholder="Elige un organismo"
                  options={loadingSector ? [] : opcionesSector}
                  onSelectionChange={handleSectorChange} />
              </div>
            </>
          )}
          {perfilSeleccionado === "GORE" && (
            <>
              <div className="d-flex mb-4 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="">Al usuario GORE debes asignarle una región. </h6>
              </div>
              <div className="mb-4">
                <DropdownSelectBuscador
                  label="Elige la región a la que representa (Obligatorio)"
                  placeholder="Elige una región"
                  options={loadingRegiones ? [] : opcionesDeRegiones}
                  onSelectionChange={handleRegionChange}
                />
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
                  />
                </>
              )} />
          </div>

          <div className="mb-5">
            <div className="my-3">
              <Controller
                name="competenciasSeleccionadas"
                control={control}
                //defaultValue={{}}
                defaultValue={Object.keys(competenciasSeleccionadas)}
                render={({ field }) => (
                  <DropdownSinSecciones
                    label="Competencia Asignada (Opcional)"
                    placeholder="Busca el nombre de la competencia"
                    options={competencias}
                    selectedOptions={field.value}
                    onSelectionChange={(selectedOptions) =>
                    {
                      field.onChange(selectedOptions);
                      handleCompetenciasChange(selectedOptions);
                    }}
                    onClick={handleInputClick}
                    onMouseDown={handleInputClick}
                  />
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
