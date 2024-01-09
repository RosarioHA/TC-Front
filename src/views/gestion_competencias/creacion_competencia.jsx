import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownCheckbox from "../../components/dropdown/checkbox";
import DropdownSelect from "../../components/dropdown/select";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
import SubirArchivo from "../../components/forms/subir_archivo";
import { esquemaCreacionCompetencia } from "../../validaciones/esquemaValidacion";
import { useCrearCompetencia } from "../../hooks/competencias/useCrearCompetencia";
import { useRegion } from "../../hooks/useRegion";
import { useUsers } from "../../hooks/usuarios/useUsers";
import { useSector } from "../../hooks/useSector";
import { useOrigenes } from "../../hooks/useOrigenes";
import { useAmbitos } from "../../hooks/useAmbitos";

const initialValues = {
  nombre: '',
  regiones: [],
  sectores: [],
  origen: '',
  ambito: '',
  usuarios: '',
  plazoSectorial: undefined,
  plazoGore: undefined,
};

const groupUsersByType = (users) => {
  const grouped = users.reduce((acc, user) => {
    acc[ user.perfil ] = acc[ user.perfil ] || [];
    acc[ user.perfil ].push(user);
    return acc;
  }, {});

  return Object.entries(grouped).map(([ perfil, users ]) => ({
    label: perfil,
    options: users,
  }));
};

const CreacionCompetencia = () => {
  const { createCompetencia } = useCrearCompetencia();
  const { dataRegiones } = useRegion();
  const { users } = useUsers();
  const { dataSector } = useSector();
  const userOptions = groupUsersByType(users);
  const [ regionesSeleccionadas, setRegionesSeleccionadas ] = useState([]);
  const [ sectoresSeleccionados, setSectoresSeleccionados ] = useState([]);
  const [ origenSeleccionado, setOrigenSeleccionado ] = useState('');
  const [ ambitoSeleccionado, setAmbitoSeleccionado ] = useState('');
  const [ usuariosSeleccionados, setUsuariosSeleccionados ] = useState([]);
  const history = useNavigate();

  const handleBackButtonClick = () => {
    history(-1);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaCreacionCompetencia),
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: 'manual',
  });

  const onSubmit = async (data) => {
    const competenciaData = {
      ...data,
      sectores: sectoresSeleccionados.map(s => s.value),
      regiones: regionesSeleccionadas.map(r => r.value),
      usuarios: Object.keys(usuariosSeleccionados),
    };

    try {
      await createCompetencia(competenciaData);
      // Manejar la respuesta, redireccionar o mostrar un mensaje de éxito
    } catch (error)
    {
      // Manejar el error
    }
  };

  //opciones regiones 
  const opcionesRegiones = dataRegiones.map(region => ({
    label: region.region,
    value: region.id,
  }));

  const handleRegionesChange = (selectedOptions) => {
    console.log(selectedOptions);
    setRegionesSeleccionadas(selectedOptions);
    setValue('regiones', selectedOptions);
  };

  //opciones sector 
  const opcionesSectores = dataSector.map(sector => ({
    label: sector.nombre,
    value: sector.id,
  }));

  const handleSectorChange = (selectedOptions) => {
    setSectoresSeleccionados(selectedOptions);
    setValue('sectores', selectedOptions);
  };

  //opciones origen
  const origenes = useOrigenes();

  const handleOrigenChange = (selectedOption) => {
    console.log(selectedOption)
    setOrigenSeleccionado(selectedOption.value);
    setValue('origen', selectedOption.value);
  };
  
  //opciones ambito
  const ambitos = useAmbitos();

  const handleAmbitoChange = (selectedOption) => {
    console.log(selectedOption)
    setAmbitoSeleccionado(selectedOption);
    const ambitoValue = selectedOption ? Number(selectedOption.value) : null;
    setValue('ambito', ambitoValue, { shouldValidate: true });
  };

  const handleUsuariosChange = useCallback((selectedOptions) => {
    const updatedUsuarios = selectedOptions.reduce((acc, usuario) => {
      acc[ usuario.id ] = usuario;
      return acc;
    }, {});
    setUsuariosSeleccionados(updatedUsuarios);
    setValue('usuarios', Object.keys(updatedUsuarios));
  }, [ setValue ]);

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
              render={({ field }) => (
                <CustomInput
                  label="Nombre de la Competencia (Obligatorio)"
                  placeholder="Escribe el nombre de la competencia"
                  id="nombre"
                  maxLength={200} // Configura el maxLength según la API
                  error={errors.nombre?.message}
                  ref={field.ref}
                  {...field} />
              )}
            />
          </div>

          <div className="mb-4">
            <DropdownCheckbox
              label="Región (Obligatorio)"
              placeholder="Elige la o las regiones donde se ejercerá la competencia"
              options={opcionesRegiones}
              onSelectionChange={handleRegionesChange}
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
              options={opcionesSectores}
              onSelectionChange={handleSectorChange}
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
              options={origenes.map(origen => ({ label: origen.descripcion, value: origen.clave }))}
              onSelectionChange={(selectedOption) =>
              {
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
              options={ambitos.map(ambito => ({ label: ambito.nombre, value: ambito.id }))}
              onSelectionChange={(selectedOption) =>
              {
                handleAmbitoChange(selectedOption);
                setValue('ambito', selectedOption, { shouldValidate: true })
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
              <DropdownConSecciones
                label="Asignar Usuarios (Opcional)"
                placeholder="Busca el nombre de la persona"
                options={userOptions}
                selectedOptions={Object.keys(usuariosSeleccionados)
                  .map(id => users.find(user => user.id === id))}
                onSelectionChange={handleUsuariosChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <div>
              <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
              <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            </div>

            <div className="ps-3">
              <div className="d-flex justify-content-between py-3 fw-bold">
                <div className="d-flex mb-2">
                  <div className="ms-4">#</div>
                  <div className="ms-5">Documento</div>
                </div>
                <div className="me-5">Acción</div>
              </div>
              <div className="row neutral-line align-items-center">
                <SubirArchivo
                  index="1"
                  fileType="No seleccionado" />
              </div>
            </div>

          </div>

          <div className="mb-4">
            < Controller
              name="plazoSectorial"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="Plazo para formulario sectorial (Obligatorio)"
                  placeholder="Escribe el número de días corridos"
                  id="plazoSectorial"
                  maxLength={null}
                  error={errors.plazoSecorial?.message}
                  ref={field.ref}
                  {...field} />
              )} />
            <div className="d-flex justify-content-end">
              <h6 className="text-sans-h6-grey mt-1 me-4">Número entre 15 y 30</h6>
            </div>
            <div className="d-flex text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario sectorial a la competencia. </h6>
            </div>
          </div>

          <div className="mb-4">
            < Controller
              name="plazoGORE"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="Plazo para formulario GORE (Obligatorio)"
                  placeholder="Escribe el número de días corridos"
                  id="plazoGORE"
                  maxLength={null}
                  error={errors.plazoGORE?.message}
                  ref={field.ref}
                  {...field} />
              )} />
            <div className="d-flex justify-content-end">
              <h6 className="text-sans-h6-grey mt-1 me-4">Número entre 15 y 30</h6>
            </div>
            <div className="d-flex text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn-primario-s mb-5" type="submit">
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