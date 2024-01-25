import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import DropdownCheckbox from "../../components/dropdown/checkbox";
import DropdownSelect from "../../components/dropdown/select";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
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
  ambito_competencia: '',
  usuarios_subdere: [],
  usuarios_dipres: [],
  usuarios_sectoriales: [],
  usuarios_gore: [],
  plazo_formulario_sectorial: undefined,
  plazo_formulario_gore: undefined,
};

const groupUsersByType = (users) =>
{
  const grouped = users.reduce((acc, user) =>
  {
    acc[ user.perfil ] = acc[ user.perfil ] || [];
    acc[ user.perfil ].push(user);
    return acc;
  }, {});

  return Object.entries(grouped).map(([ perfil, users ]) => ({
    label: perfil,
    options: users,
  }));
};

const CreacionCompetencia = () =>
{
  const { createCompetencia } = useCrearCompetencia();
  const { dataRegiones } = useRegion();
  const { users } = useUsers();
  const { dataSector } = useSector();
  const { origenes } = useOrigenes();
  const { ambitos } = useAmbitos();
  const userOptions = groupUsersByType(users);
  const [ errorGeneral, setErrorGeneral ] = useState('');
  const [ regionesSeleccionadas, setRegionesSeleccionadas ] = useState([]);
  const [ sectoresSeleccionados, setSectoresSeleccionados ] = useState([]);
  const [ origenSeleccionado, setOrigenSeleccionado ] = useState('');
  const [ ambitoSeleccionado, setAmbitoSeleccionado ] = useState('');
  const [ usuariosSeleccionados, setUsuariosSeleccionados ] = useState(initialValues);
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ buttonText, setButtonText ] = useState('Subir archivo');
  const [ fechaInicio, setFechaInicio ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState("");


  const history = useNavigate();

  const handleBackButtonClick = () =>
  {
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
    mode: 'onBlur',
  });

  const onSubmit = async (data) =>
  {


    const competenciaData = {
      ...data,
      sectores: sectoresSeleccionados.map(s => s.value),
      regiones: regionesSeleccionadas.map(r => r.value),
      ambito_competencia: ambitoSeleccionado,
      origen: origenSeleccionado,
      usuarios_subdere: usuariosSeleccionados.usuarios_subdere,
      usuarios_dipres: usuariosSeleccionados.usuarios_dipres,
      usuarios_sectoriales: usuariosSeleccionados.usuarios_sectoriales,
      usuarios_gore: usuariosSeleccionados.usuarios_gore,
      plazo_formulario_sectorial: data.plazo_formulario_sectorial,
      plazo_formulario_gore: data.plazo_formulario_gore,
      fecha_inicio: formatFechaInicio(),
      oficio_origen: selectedFile 
    };
    try
    {
      await createCompetencia(competenciaData);
      history('/home/success', { state: { origen: "crear_competencia" } });
      setErrorGeneral('');
    } catch (error)
    {
      if (error.response && error.response.data)
      {
        const errores = error.response.data;
        const primerCampoError = Object.keys(errores)[ 0 ];
        const primerMensajeError = errores[ primerCampoError ][ 0 ];
        setErrorGeneral(primerMensajeError);
      } else
      {
        setErrorGeneral('Error al conectarse con el servidor.');
      }
    }
  };


  //opciones regiones 
  const opcionesRegiones = dataRegiones.map(region => ({
    label: region.region,
    value: region.id,
  }));
  const handleRegionesChange = (selectedOptions) =>
  {
    setRegionesSeleccionadas(selectedOptions);
    setValue('regiones', selectedOptions);
  };

  //opciones sector 
  const opcionesSectores = dataSector.map(sector => ({
    label: sector.nombre,
    value: sector.id,
  }));
  const handleSectorChange = (selectedOptions) =>
  {
    setSectoresSeleccionados(selectedOptions);
    setValue('sectores', selectedOptions);
  };

  //opciones origen
  const opcionesOrigen = origenes.map(origen => ({
    label: origen.descripcion,
    value: origen.clave,
  }));
  const handleOrigenChange = (selectedOption) =>
  {
    setOrigenSeleccionado(selectedOption.value);
    setValue('origen', selectedOption.value);
  };

  //opciones ambito
  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));
  const handleAmbitoChange = (selectedOption) =>
  {
    const ambitoId = selectedOption ? selectedOption.value : null;
    setAmbitoSeleccionado(ambitoId);
    setValue('ambito_competencia', ambitoId, { shouldValidate: true });
  };

  const handleUsuariosTransformed = useCallback((nuevosUsuarios) =>
  {
    setUsuariosSeleccionados(nuevosUsuarios);
  }, []);
  console.log('com', usuariosSeleccionados)


  const handleFileChange = (event) =>
  {
    const file = event.target.files[ 0 ];
    if (file)
    {
      if (file.size > 20971520)
      { // 20 MB en bytes
        setErrorMessage("Archivo no cumple con el peso permitido");
        setSelectedFile(null);
      } else
      {
        setSelectedFile(file);
        setButtonText('Modificar');
        setErrorMessage(""); // Limpiar el mensaje de error si el archivo es válido
      }
    }
  };


  const handleDelete = () =>
  {
    setSelectedFile(null);
    setButtonText('Subir archivo');
  };

  const handleUploadClick = () =>
  {
    document.getElementById('fileUploadInput').click();
  };

  const handleFechaInicioChange = (event) =>
  {
    setFechaInicio(event.target.value);
  };

  const formatFechaInicio = () =>
  {
    if (!fechaInicio) return '';

    return new Date(fechaInicio).toISOString();
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
              render={({ field }) => (
                <CustomInput
                  label="Nombre de la Competencia (Obligatorio)"
                  placeholder="Escribe el nombre de la competencia"
                  id="nombre"
                  maxLength={30}
                  error={errors.nombre?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="mb-4 ">
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

          <div className="mb-4 ">
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
              options={opcionesOrigen}
              onSelectionChange={handleOrigenChange}
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
              name="ambito_competencia"
              options={opcionesAmbito}
              onSelectionChange={handleAmbitoChange}
              selected={ambitoSeleccionado}
              error={errors.ambito?.message}
            />
            {errors.ambito_competencia && (
              <p className="text-sans-h6-darkred mt-2 mb-0">{errors.ambito_competencia.message}</p>
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
                onUsuariosTransformed={handleUsuariosTransformed}
              />
            </div>
          </div>

          <div className="mb-5 col-12">
            <div>
              <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
              <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            </div>

            <div className="col-11 mt-3">
              <table className="table table-striped table align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" htmlFor="fileUploadInput" className="form-label">Documento</th>
                    <th scope="col"></th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>{selectedFile ? selectedFile.name : "No seleccionado"}</td>
                    <td className="w-20 px-0 mx-0">{errorMessage && <div className="text-sans-h6-darkred">{errorMessage}</div>}</td>
                    <td>
                      <div className="d-flex">
                        <input
                          id="fileUploadInput"
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          accept=".pdf"
                        />
                        <button className="btn-secundario-s d-flex" onClick={handleUploadClick}>
                          <i className="material-symbols-outlined">upgrade</i>
                          <u className="align-self-center text-sans-b-white">{buttonText}</u>
                        </button>
                        {selectedFile && (
                          <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                            <span className="text-sans-b-red">Borrar</span>
                            <i className="material-symbols-rounded">delete</i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="my-4 py-3 col-12">
                <span className="text-sans-h5 ">Elige la fecha del oficio (Obligatorio)</span>
                <input
                  id="dateInput"
                  type="datetime-local"
                  className="form-control py-3 my-2 input-textarea border-dark-subtle"
                  onChange={handleFechaInicioChange}
                  value={fechaInicio}
                />
                <div className="d-flex text-sans-h6-primary">
                  <i className="material-symbols-rounded me-2">info</i>
                  <h6>La fecha del oficio debe coincidir con la fecha en que el sector recibió la información, así los plazos previamente establecidos para el llenado del formulario sectorial  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Controller
              name="plazo_formulario_sectorial"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Plazo para formulario sectorial (Obligatorio)"
                  placeholder="Escribe el número de días corridos"
                  id="plazo_formulario_sectorial"
                  maxLength={null}
                  error={errors.plazo_formulario_sectorial?.message}
                  {...field} />
              )}
            />
            <div className="d-flex justify-content-end col-11">
              <h6 className="text-sans-h6-grey mt-1 me-4">Número entre 15 y 30</h6>
            </div>
            <div className="d-flex text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario sectorial a la competencia. </h6>
            </div>
          </div>

          <div className="my-4">
            < Controller
              name="plazo_formulario_gore"
              control={control}
              render={({ field }) => (
                < CustomInput
                  label="Plazo para formulario GORE (Obligatorio)"
                  placeholder="Escribe el número de días corridos"
                  id="plazo_formulario_gore"
                  maxLength={null}
                  error={errors.plazo_formulario_gore?.message}
                  ref={field.ref}
                  {...field} />
              )} />
            <div className="d-flex justify-content-end col-11">
              <h6 className="text-sans-h6-grey mt-1 me-4 ">Número entre 15 y 30</h6>
            </div>
            <div className="d-flex text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
            </div>
          </div>
          {errorGeneral && (
            <p className="text-sans-h6-darkred mt-2 mb-0">{errorGeneral}</p>
          )}
          <div className="d-flex justify-content-end col-11">
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