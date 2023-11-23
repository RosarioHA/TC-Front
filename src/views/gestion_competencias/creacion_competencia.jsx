import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownCheckbox from "../../components/forms/dropdown_checkbox";
import DropdownSelect from "../../components/forms/dropdown_select";
import DropdownCheckboxUsuarios from "../../components/forms/dropdown_checkbox_conSecciones";
import { regiones, opcionesSector, origenCompetencia, ambitoCompetencia } from "../../Data/OpcionesFormulario";
import { userData } from "../../Data/Usuarios";

import { esquemaCreacionCompetencia } from "../../validaciones/esquemaValidacion";

const initialValues = {
  nombre: '',
  regiones: [],
  sectores: [],
  origen: '',
  ambito: '',
  plazo: undefined,
};

const CreacionCompetencia = () => {
  const [regionesSeleccionadas, setRegionesSeleccionadas] = useState([]);
  const [sectoresSeleccionados, setSectoresSeleccionados] = useState([]);
  const [origenSeleccionado, setOrigenSeleccionado] = useState('');
  const [ambitoSeleccionado, setAmbitoSeleccionado] = useState('');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useNavigate();

  // Maneja boton de volver atras.
  const handleBackButtonClick = () => {
    history(-1);
  };

  // Agrupa usuarios por tipo
  const groupUsersByType = (users) => {
    return Array.from(new Set(users.map((user) => user.tipoUsuario))).map((userType) => ({
      label: userType,
      options: users.filter((user) => user.tipoUsuario === userType),
    }));
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(esquemaCreacionCompetencia),
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: 'manual', // Desactiva la validacion automatica
  });

  const onSubmit = async (data) => {
    try {
      if (submitClicked) {
        const isValid = await trigger();
        if (isValid) {
          // Aqui enviaria la data hacia el backend
          console.log('Datos de competencia:', data);
          history('/home/success', { state: { origen: "crear_competencia" } });
        } else {
          console.log('El formulario no es válido');
        }
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };
  
  // Callbacks que manejan la entrega de informacion desde los componentes del formulario
  const handleRegionesChange = (region) => {
    setRegionesSeleccionadas(region);
    setValue('regiones', region, { shouldValidate: true });
    console.log("regiones seleccionadas", regionesSeleccionadas)
  };
  const handleSectorChange = (sector) => {
    setSectoresSeleccionados(sector);
    setValue('sectores', sector, { shouldValidate: true });
    console.log("sectores seleccionados", sectoresSeleccionados)
  };
  const handleOrigenChange = (origen) => {
    setOrigenSeleccionado(origen);
    setValue('origen', origen, { shouldValidate: true });
    console.log("origen seleccionado", origenSeleccionado)
  };
  const handleAmbitoChange = (ambito) => {
    setAmbitoSeleccionado(ambito);
    setValue('ambito', ambito, { shouldValidate: true });
    console.log("ambito seleccionado", ambitoSeleccionado)
  };

  // Callback que maneja usuarios seleccionados y su eliminacion.
  const handleUsuariosChange = useCallback(
    (selectedOptions) => {
      const updatedUsuarios = {};
      selectedOptions.forEach((usuario) => {
        if (usuario && usuario.nombre) {
          updatedUsuarios[usuario.nombre] = true;
        }
      });
      setUsuariosSeleccionados(updatedUsuarios);
    },
    []
  );
  console.log("usuarios seleccionados:", usuariosSeleccionados)
  //FUNCION PARA ELIMINAR USUARIOS DESDE TABLA
  // const handleRemoveUsuario = (usuario) => {
  //   const updatedUsuarios = { ...usuariosSeleccionados };
  //   delete updatedUsuarios[usuario];
  //   setUsuariosSeleccionados(updatedUsuarios);
  // };

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex  align-items-center mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0">Volver</p>
        </button>
        <h3 className="text-sans-h3 ms-3 mb-0">Crear Competencia</h3>
      </div>

      <div className="col-10 ms-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Controller 
              name="nombre"
              control={control}
              render={({field}) => (
                < CustomInput 
                label="Nombre de la Competencia (Obligatorio)"
                placeholder="Escribe el nombre de la competencia"
                id="nombre"
                maxLength={null}
                error={errors.nombre?.message}
                ref={field.ref}
                {...field}/>
              )}
            />
          </div>

          <div className="mb-4">
            <DropdownCheckbox
              label="Región (Obligatorio)" 
              placeholder="Elige la o las regiones donde se ejercerá la competencia" 
              options={regiones}
              onSelectionChange={(selectedOption) => {
                handleRegionesChange(selectedOption);
                setValue('regiones', selectedOption, { shouldValidate: true });
              }}
              selected={regionesSeleccionadas} 
            />
            {errors.regiones && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.regiones.message}</p>
            )}  
          </div>

          <div className="mb-4">
            <DropdownCheckbox
              label="Elige el sector de la competencia (Obligatorio)" 
              placeholder="Elige el sector de la competencia" 
              options={opcionesSector}
              onSelectionChange={(selectedOption) => {
                handleSectorChange(selectedOption);
                setValue('sectores', selectedOption, { shouldValidate: true });
              }}
              selected={sectoresSeleccionados} 
            />
            {errors.sectores && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.sectores.message}</p>
            )} 
          </div>

          <div className="mb-4">
            <DropdownSelect
              label="Origen de la competencia (Obligatorio)"
              placeholder="Elige el origen de la competencia"
              options={origenCompetencia}
              onSelectionChange={(selectedOption) => {
                handleOrigenChange(selectedOption);
                setValue('origen', selectedOption, { shouldValidate: true });
              }}
              selected={origenSeleccionado}
            />
            {errors.origen && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.origen.message}</p>
            )}
          </div>

          <div className="mb-4">
            <DropdownSelect 
              label="Elige el ámbito de la competencia (Obligatorio)"
              placeholder="Elige el ámbito de la competencia"
              options={ambitoCompetencia}
              onSelectionChange={(selectedOption) => {
                handleAmbitoChange(selectedOption);
                setValue('ambito', selectedOption, { shouldValidate : true})
              }}
              selected={ambitoSeleccionado} 
            />
            {errors.ambito && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.ambito.message}</p>
            )}
            <div className="d-flex mt-2 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> editable </h6>
            </div>
          </div>
          <div className="mb-4">
            <div className="">
              < DropdownCheckboxUsuarios 
                label="Asignar Usuarios (Opcional)"
                placeholder="Busca el nombre de la persona"
                options={groupUsersByType(userData)}
                selectedOptions={Object.keys(usuariosSeleccionados)
                  .map(id => userData.find(user => user.id === id))}
                onSelectionChange={handleUsuariosChange}
              />
            </div>

            <div className="d-flex mt-2 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> Si aun no creas los usuarios para esta competencia, puedes crear la competencia y asignarle usuario más tarde. </h6>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
            <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            <div className="">COMPONENTE SUBIR ARCHIVO</div>
          </div>

          <div className="mb-4">
            < Controller 
              name="plazo"
              control={control}
              render={({field}) => (
                < CustomInput 
                label="Plazo para formulario sectorial (Obligatorio)"
                placeholder="Escribe el número de días corridos"
                id="plazo"
                maxLength={null}
                error={errors.plazo?.message}
                ref={field.ref}
                {...field}/>
                )}/>
              <div className="d-flex justify-content-end">
                <h6 className="text-sans-h6-grey mt-1 me-4">Número entre 15 y 30</h6>
              </div>
              <div className="d-flex text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario sectorial a la competencia. </h6>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn-primario-s mb-5" type="submit" onClick={() => setSubmitClicked(true)}>
              <p className="mb-0">Crear Competencia</p>
              <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreacionCompetencia;