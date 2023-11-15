import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownCheckbox from "../../components/forms/dropdown_checkbox";
import DropdownSelect from "../../components/forms/dropdown_select";

const initialValues = {
  nombre: '',
  regiones: [],
  sectores: [],
  origen: '',
  ambito: '',
  plazo: 0,
};

// Expresiones regulares para validaciones
const nombreRegex = /^[A-Za-záéíóúüÜñÑ\s']+$/;

// Esquema de validacion
const schema = yup.object().shape({
  nombre: yup
  .string()
  .required('El nombre de la competencia es obligatorio')
  .matches(nombreRegex, 'Formato de nombre inválido')
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(30, 'El nombre no debe exceder los 30 caracteres'),
  regiones: yup.array().min(1, 'Debes seleccionar al menos una región'),
  sectores: yup.array().min(1, 'Debes seleccionar al menos un sector'),
  origen: yup.string().required('El origen de la competencia es obligatorio'),
  ambito: yup.string().required('El ámbito de la competencia es obligatorio'),
  plazo: yup
  .number()
  .required('El plazo para el formulario sectorial es obligatorio')
  .integer('El plazo debe ser un número entero')
  .min(15, 'El plazo mínimo es de 15 días.')
  .max(30, 'El plazo máximo es de 30 días.'),
});

const CreacionCompetencia = () => {
  const [regionesSeleccionadas, setRegionesSeleccionadas] = useState([]);
  const [sectoresSeleccionados, setSectoresSeleccionados] = useState([]);
  const [origenSeleccionado, setOrigenSeleccionado] = useState('');
  const [ambitoSeleccionado, setAmbitoSeleccionado] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useNavigate();

  // Opciones selectores y checkboxes, luego vendran desde el backend
  const regiones = ['Arica y Parinacota', 'Magallanes', 'Metropolitana de Santiago', 'O`Higgins'];
  const sectores = ['Organismo 1', 'Organismo 2', 'Organismo 3', 'Organismo 4'];
  const origen = ['Oficio Presidencial', 'Solicitud GORE'];
  const ambito = ['Fomento de las Actividades Productivas', 'Ordenamiento Territorial', 'Desarrollo Social y Cultural'];

  // Maneja boton de volver atras.
  const handleBackButtonClick = () => {
    history(-1);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
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
          history('/home/success');
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
            <Controller 
              name="regiones"
              control={control}
              render={({field}) => (
                <DropdownCheckbox
                label="Región (Obligatorio)" 
                placeholder="Elige la o las regiones donde se ejercerá la competencia" 
                options={regiones}
                onSelectionChange={(selectedOption) => {
                  handleRegionesChange(selectedOption);
                  field.onChange(selectedOption);
                }}
                selected={field.value} />
              )}
            />
          </div>

          <div className="mb-4">
            <Controller 
              name="sectores"
              control={control}
              render={({field}) => (
                <DropdownCheckbox
                label="Elige el sector de la competencia (Obligatorio)" 
                placeholder="Elige el sector de la competencia" 
                options={sectores}
                onSelectionChange={(selectedOption) => {
                  handleSectorChange(selectedOption);
                  field.onChange(selectedOption);
                }}
                selected={field.value} />
              )}
            />
          </div>

          <div className="mb-4">
            <Controller 
              name="origen"
              control={control}
              render={({field}) => (
                <DropdownSelect 
                label="Origen de la competencia (Obligatorio)"
                placeholder="Elige el origen de la competencia"
                options={origen}
                onSelectionChange={(selectedOption) => {
                  handleOrigenChange(selectedOption);
                  field.onChange(selectedOption);
                }}
                selected={field.value} />
              )}
            />
          </div>

          <div className="mb-4">
            <Controller 
              name="ambito"
              control={control}
              render={({field}) => (
                <DropdownSelect 
                label="Elige el ámbito de la competencia (Obligatorio)"
                placeholder="Elige el ámbito de la competencia"
                options={ambito}
                onSelectionChange={(selectedOption) => {
                  handleAmbitoChange(selectedOption);
                  field.onChange(selectedOption);
                }}
                selected={field.value} />
              )}
            />
            <div className="d-flex mt-2 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> editable </h6>
            </div>
          </div>
          <div className="mb-4">
            <div className="">COMPONENTE BUSCADOR - VER SI SIRVE LO QUE HIZO VERO</div>
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