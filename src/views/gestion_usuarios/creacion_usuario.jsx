import { useState, useCallback } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/forms/dropdown_select";
import DropdownCheckboxSinSecciones from "../../components/forms/dropdown_checkbox_sinSecciones";
import DropdownSelectBuscador from "../../components/forms/dropdown_select_buscador";
import TablaSelecciones from "../../components/forms/tabla_selecciones";
import { competencias } from "../../Data/Competencias";
import { opcionesPerfilUsuario, opcionesSector, regiones } from "../../Data/OpcionesFormulario";
import { esquemaCreacionUsuario } from "../../validaciones/esquemaValidacion";

const initialValues = {
  rut: '',
  nombre: '',
  email: '',
  perfil: '',
  estado: '',
};

const CreacionUsuario = () => {
  const [estado, setEstado] = useState('inactivo');
  const [activeButton, setActiveButton] = useState(null);
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState({});
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [sectorSeleccionado, setSectorSeleccionado] = useState(null);
  const [regionSeleccionada, setRegionSeleccionada] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);

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
    mode: 'manual', // Desactiva la validacion automatica
  });

  const onSubmit = async (data) => {
    try {
      data.organismo = sectorSeleccionado;
      data.region = regionSeleccionada;
      data.competencias = competenciasSeleccionadas;
      // Realiza la validacion manualmente
      const isValid = await trigger();
  
      if (submitClicked && isValid) {
        // Aqui la logica de envio del formulario
        console.log("datos enviados", data);
        console.log("location state desde vista creacion de usuario", location.state);
        history('/home/success', { state: { origen: "crear_usuario" } });
      } else {
        console.log("El formulario no es válido o no se ha hecho click en 'Crear Usuario'");
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Callback que recibe las opciones de DropdownCheckbox de Perfil.
  const handlePerfilChange = (perfil) => {
    setPerfilSeleccionado(perfil);
  };

  // Callback que recibe las opciones de DropdownSelectBuscador de Sector
  const handleSectorChange = (sector) => {
    setSectorSeleccionado(sector);
    console.log("sector seleccionado", sectorSeleccionado)
  }

  // Callback que recibe las opciones de DropdownSelectBuscador de Sector
  const handleRegionChange = (region) => {
    setRegionSeleccionada(region);
    console.log("region seleccionada", regionSeleccionada)
  }

  // Maneja cambio de Estado del usuario.
  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado);
    console.log("estado seleccionado", estado)
  };

  // Callback que maneja competencias seleccionadas y su eliminacion.
  const handleCompetenciasChange = useCallback(
    (selectedOptions) => {
      const updatedCompetencias = {};
      selectedOptions.forEach((competencia) => {
        updatedCompetencias[competencia] = true;
      });
      setCompetenciasSeleccionadas(updatedCompetencias);
    },
    []
  );
  const handleRemoveCompetencia = (competencia) => {
    const updatedCompetencias = { ...competenciasSeleccionadas };
    delete updatedCompetencias[competencia];
    setCompetenciasSeleccionadas(updatedCompetencias);
  };

  const handleInputClick = (e) => {
    // Previene que el evento se propague al boton
    e.stopPropagation();
    console.log("propagacion detenida en vista Crear usuario")
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Controller
            name="rut"
            control={control}
            render={({field}) => (
              < CustomInput 
              label="RUT (Obligatorio)"
              placeholder="Escribe el RUT con guión sin puntos."
              id="rut"
              maxLength={null}
              error={errors.rut?.message}
              ref={field.ref}
              {...field} />
            )} />
          </div>
          <div className="mb-4">
            <Controller 
            name="nombre"
            control={control}
            render={({field}) => (
              < CustomInput 
              label="Nombre Completo (Obligatorio)"
              placeholder="Escribe el nombre completo."
              id="nombre"
              maxLength={null}
              error={errors.nombre?.message}
              ref={field.ref}
              {...field} />
            )}/>
          </div>
          <div className="mb-4">
            <Controller 
            name="email"
            control={control}
            render={({field}) => (
              < CustomInput 
              label="Correo electrónico"
              placeholder="Escribe el correo electrónico del usuario."
              id="mail"
              maxLength={null}
              error={errors.email?.message}
              ref={field.ref}
              {...field} />
            )}/>
          </div>
          <div className="mb-4">
            < Controller 
            name="perfil"
            control={control}
            render={({field}) => (
              < DropdownSelect 
            label="Elige el perfil de usuario (Obligatorio)"
            placeholder="Elige el perfil de usuario"
            options={opcionesPerfilUsuario}
            onSelectionChange={(selectedOption) => {
              field.onChange(selectedOption);
              handlePerfilChange(selectedOption);
            }} />
            )}/>
            {errors.perfil && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.perfil.message}</p>
            )}
          </div>

          {/* Se generan condicionalmente nuevos componentes para el detalle de usuarios GORE y Sectorial */}
          {perfilSeleccionado === "Sectorial" && (
            <>
              <div className="d-flex mb-4 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="">Al usuario Sectorial debes asignarle un organismo. </h6>
              </div>
              <div className="mb-4">
                <DropdownSelectBuscador
                  label="Elige el organismo al que pertenece (Obligatorio)"
                  placeholder="Elige un organismo"
                  options={opcionesSector}
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
                  options={regiones}
                  onSelectionChange={handleRegionChange} />
              </div>
            </>
          )}

          <div className="mb-5">
            < Controller 
            name="estado"
            control={control}
            render={({field}) => (
              <>
              <h5 className="text-sans-h5">Estado</h5>
              <div className="d-flex mb-2">
                <button
                  className={` ${activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
                  onClick={() => {
                    handleEstadoChange('activo');
                    field.onChange('activo');
                  }}>
                    <p className="mb-0 text-decoration-underline">Activo</p>
                    {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
                </button>
                <button
                  className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
                  onClick={() => {
                    handleEstadoChange('inactivo');
                    field.onChange('inactivo');
                  }}>
                    <p className="mb-0 text-decoration-underline">Inactivo</p>
                    {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
                </button>
              </div>
              {errors.estado && (
                <p className="text-sans-h6-darkred mt-2 mb-0">{errors.estado.message}</p>
              )}
              </>
            )}/>
          </div>

          <div className="mb-5">
            <div className="my-3">
            <Controller
              name="competenciasSeleccionadas"
              control={control}
              defaultValue={Object.keys(competenciasSeleccionadas)}
              render={({ field }) => (
                <DropdownCheckboxSinSecciones
                  label="Competencia Asignada (Opcional)"
                  placeholder="Busca el nombre de la competencia"
                  options={competencias}
                  selectedOptions={field.value}
                  onSelectionChange={(selectedOptions) => {
                    field.onChange(selectedOptions);
                    handleCompetenciasChange(selectedOptions);
                  }}
                  onClick={handleInputClick}
                  onMouseDown={handleInputClick}
                />
              )}
            />
            </div> 

            <div className="d-flex mt-1 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="">Si la competencia no está creada, debes crearla primero y luego asociarle un usuario. </h6>
            </div>
          </div>

          {Object.keys(competenciasSeleccionadas).length > 0 && (
            < TablaSelecciones
            data={competencias}
            selecciones={competenciasSeleccionadas}
            onRemove={handleRemoveCompetencia}
            colTitle="Competencia"/>
          )}
          
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