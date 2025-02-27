import { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/fase1/forms/custom_input";
import {DropdownSelectSimple} from "../../components/fase1/dropdown/selectSimple";
import DropdownSelectBuscador from "../../components/fase1/dropdown/select_buscador";
import DropdownSinSecciones from "../../components/fase1/dropdown/checkbox_sinSecciones_conTabla";
import { RadioButtons } from "../../components/fase1/forms/radio_btns";
import { esquemaCreacionUsuario } from '../../validaciones/fase1/esquemaCrearUsuario_Competencia'
import { useCreateUser } from "../../hooks/usuarios/useCreateUser";
import { useRegion } from "../../hooks/useRegion";
import { useGroups } from "../../hooks/useGroups";
import { useSector } from "../../hooks/useSector";
import { useFiltroCompetencias } from "../../hooks/competencias/useFiltrarCompetencias";
import { useFormContext } from "../../context/FormAlert";
import ModalAbandonoFormulario from "../../components/fase1/commons/modalAbandonoFormulario";
import { DropdownSelectBuscadorUnico } from "../../components/fase1/dropdown/select_buscador_sector";

const initialValues = {
  rut: '',
  nombre: '',
  email: '',
  perfil: '',
  estado: '',
  password: '',
  password2: '',
  sector: "",
};

const CreacionUsuario = () => {
  const { createUser } = useCreateUser();
  const { updateHasChanged } = useFormContext();
  const { dataGroups, loadingGroups } = useGroups();
  const { dataSector } = useSector();
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
  const [ hasChanged, setHasChanged ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [conditionalFieldErrors, setConditionalFieldErrors] = useState({});

  useEffect(() => {
    competenciasSeleccionadas;
  }, [ competenciasSeleccionadas ]);

  const history = useNavigate();
  const handleBackButtonClick = () => {
    if (hasChanged) {
      setIsModalOpen(true);
    } else {
      history(-1);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = useForm({
    resolver: yupResolver(esquemaCreacionUsuario),
    defaultValues: {
      ...initialValues,
      perfil: perfilSeleccionado,
      sector: sectorSeleccionado,
      region: regionSeleccionada,
    },
    shouldUnregister: false,
    mode: 'manual',
  });

  function handleOnChange(event) {
    const data = new FormData(event.currentTarget);
    const formHasChanged = Array.from(data.entries()).some(([ name, value ]) => {
      const initialValue = initialValues[ name ];
      return value !== String(initialValue);
    });
    setHasChanged(formHasChanged);
    updateHasChanged(formHasChanged);
  }
   
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
    setHasChanged(true);
    updateHasChanged(true);
  };

  const opcionesDeRegiones = dataRegiones.map(region => ({
    value: region.id,
    label: region.region
  }));

  const handleRegionChange = (region) => {
    setRegionSeleccionada(region.value);
    setRegionId(region.value);
    setSectorId(null);
    setHasChanged(true);
    updateHasChanged(true);
  }

  //opciones sector
  const opcionesSector = dataSector.map(ministerio => ({
    label: ministerio.nombre,
    options: ministerio.sectores.map(sector => ({
      label: sector.nombre,
      value: sector.id,
      ministerioId: ministerio.id
    }))
  }));

  const handleSectorChange = (sectorId) => {
    setSectorSeleccionado(sectorId.label);
    setSectorId(sectorId);
    setHasChanged(true);
    updateHasChanged(true);
  };

  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado);
    setHasChanged(true);
    updateHasChanged(true);
  };

  //opciones Filtro Competencias
  const opcionesFiltroCompetencias = dataFiltroCompetencias.map(competencia => ({
    value: competencia.id,
    label: competencia.nombre,
  }));

  const handleCompetenciasChange = (selectedOptions) => {
    const competenciasSeleccionadasFormatted = selectedOptions.map(option => {
      const competencia = opcionesFiltroCompetencias.find(c => c.value === parseInt(option, 10));
      return { id: parseInt(option, 10), nombre: competencia ? competencia.label : '' };
    });
    setCompetenciasSeleccionadas(competenciasSeleccionadasFormatted);
    setHasChanged(true);
    updateHasChanged(true);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const onSubmit = async (data) => {
    try {
      // Validación de Región y Sector según el perfil de usuario seleccionado
      let validationErrors = {};
      if (perfilSeleccionado === 'GORE' && !regionSeleccionada) {
        validationErrors.region = "Seleccionar una región para el perfil GORE.";
      }
      if (perfilSeleccionado === 'Usuario Sectorial' && !sectorId) {
        validationErrors.sector = "Seleccionar un sector para el perfil de Usuario Sectorial.";
      }
      setConditionalFieldErrors(validationErrors);
  
      if (Object.keys(validationErrors).length === 0) {
        const payload = {
          ...data,
          nombre_completo: data.nombre,
          perfil: perfilSeleccionado,
          sector: sectorId,
          region: regionSeleccionada,
          password: data.password,
          is_active: estado === 'activo',
          asignar_competencias: competenciasSeleccionadas,
        };
        delete payload.password2;
        delete payload.competenciasSeleccionadas;
  
        const isValid = await trigger();
        if (submitClicked && isValid) {
          await createUser(payload);
          setHasChanged(false);
          updateHasChanged(false);
          history('/home/success_creacion', { state: { origen: "crear_usuario" } });
        } else {
          console.log("El formulario no es válido o no se ha hecho click en 'Crear Usuario'");
        }
      }
    } catch (error) {
      if (error.message && error.message.rut && error.message.rut.length > 0) {
        const mensajeErrorRut = error.message.rut[0];
        setError('rut', { type: 'manual', message: mensajeErrorRut });
      }
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
          <div className="mb-4">
            <Controller
              name="rut"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="RUT (Obligatorio)"
                  placeholder="Escribe el RUT con guión y sin puntos."
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
          <div className="mb-4 col-11">
            <Controller
              name="perfil"
              control={control}
              render={({ field }) => (
                <>
                  {loadingGroups ? (
                    <div>Cargando perfiles...</div>
                  ) : dataGroups && dataGroups.length > 0 ? (
                    <DropdownSelectSimple
                      label="Elige el perfil de usuario (Obligatorio)"
                      placeholder="Elige el perfil de usuario"
                      options={loadingGroups ? [] : opcionesGroups}
                      onSelectionChange={(selectedOption) =>
                      {
                        field.onChange(selectedOption.label);
                        handlePerfilChange(selectedOption);
                      }}
                      {...field} />
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
              <div className="mb-4 col-11">
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DropdownSelectBuscadorUnico
                        label="Elige el sector al que pertenece (Obligatorio)"
                        placeholder="Elige el sector del usuario"
                        options={opcionesSector}
                        onSelectionChange={(value) =>
                        {
                          // Actualiza el campo del formulario con el valor seleccionado
                          field.onChange(value);
                          handleSectorChange(value); // Actualiza el estado local si es necesario
                        }}
                        sectorId={sectorId}
                      />
                      {Object.keys(conditionalFieldErrors).length > 0 && (
                        <div>
                          {Object.entries(conditionalFieldErrors).map(([field, errorMessage]) => (
                            <p key={field} className="text-sans-h6-darkred mt-2 mb-0">{errorMessage}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </>
          )
          }
          {perfilSeleccionado === "GORE" && (
            <>
              <div className="d-flex mb-4 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="">Al usuario GORE debes asignarle una región.</h6>
              </div>
              <div className="mb-4 col-11">
                {loadingRegiones ? (
                  <div>Cargando regiones...</div>
                ) : dataRegiones && dataRegiones.length > 0 ? (
                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <DropdownSelectBuscador
                          label="Elige la región a la que representa (Obligatorio)"
                          placeholder="Elige una región"
                          options={opcionesDeRegiones}
                          onSelectionChange={handleRegionChange}
                          {...field}
                        />
                        {Object.keys(conditionalFieldErrors).length > 0 && (
                        <div>
                          {Object.entries(conditionalFieldErrors).map(([field, errorMessage]) => (
                            <p key={field} className="text-sans-h6-darkred mt-2 mb-0">{errorMessage}</p>
                          ))}
                        </div>
                      )}
                      </div>
                    )} />

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
            <Controller
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
            <div className="my-3 col-11">
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
                        label="Competencias disponibles para asignar (Opcional)"
                        placeholder="Busca el nombre de la competencia"
                        options={opcionesFiltroCompetencias}
                        selectedOptions={field.value.map(val => parseInt(val, 10))}
                        onSelectionChange={(selectedOptions) =>
                        {
                          field.onChange(selectedOptions);
                          handleCompetenciasChange(selectedOptions);
                        }}
                        onClick={handleInputClick}
                        onMouseDown={handleInputClick}
                      />
                    ) : (
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
      {isModalOpen && (
        <ModalAbandonoFormulario
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          goBack={true}
        />
      )}
    </div>
  );
}

export default CreacionUsuario;
