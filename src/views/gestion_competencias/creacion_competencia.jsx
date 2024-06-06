import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from "../../components/forms/custom_input";
import { CheckboxRegion } from "../../components/dropdown/checkboxRegion";
import { DropdownSelectSimple } from "../../components/dropdown/selectSimple";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
import { DropdownSelectBuscadorCheck } from "../../components/dropdown/select_buscador_checkbox";
import { esquemaCreacionCompetencia } from "../../validaciones/esquemaCrearUsuario_Competencia";
import { useCrearCompetencia } from "../../hooks/competencias/useCrearCompetencia";
import { useCrearCompetenciaAgrupada } from "../../hooks/competencias/useCrearCompetenciaAgrupada";
import { useRegion } from "../../hooks/useRegion";
import { useFiltroUsuarios } from "../../hooks/usuarios/useFiltroUsuarios";
import { useSector } from "../../hooks/useSector";
import { useOrigenes } from "../../hooks/useOrigenes";
import { useAmbitos } from "../../hooks/useAmbitos";
import { useFormContext } from "../../context/FormAlert";
import { BtnRadio } from "../../components/forms/btnRadio";
import ModalAbandonoFormulario from "../../components/commons/modalAbandonoFormulario";
import { ListaNombres } from "../../components/tables/ListaNombres";


const initialValues = {
  nombre: '',
  regiones: [],
  sectores: [],
  origen: '',
  ambito_competencia: null,
  usuarios_subdere: [],
  usuarios_dipres: [],
  usuarios_sectoriales: [],
  usuarios_gore: [],
  fecha_inicio: '',
  oficio_origen: '',
  plazo_formulario_sectorial: undefined,
  plazo_formulario_gore: undefined,
  agrupada: null,
  competencias_agrupadas: [],
};

const groupUsersByType = (usuarios) => {
  if (!usuarios || usuarios.length === 0) {
    return [];
  }

  const grouped = usuarios.reduce((acc, user) => {
    const perfil = user.perfil;
    acc[perfil] = acc[perfil] || [];
    acc[perfil].push(user);
    return acc;
  }, {});

  return Object.entries(grouped).map(([perfil, users]) => ({
    label: perfil,
    options: users,
  }));
};

const CreacionCompetencia = () => {
  const { createCompetencia } = useCrearCompetencia();
  const { createCompetenciaAgrupada } = useCrearCompetenciaAgrupada();
  const { dataRegiones } = useRegion();
  const { dataSector } = useSector();
  const { origenes } = useOrigenes();
  const { ambitos } = useAmbitos();
  const [errorGeneral, setErrorGeneral] = useState('');
  const [regionesSeleccionadas, setRegionesSeleccionadas] = useState([]);
  const [sectoresIds, setSectoresIds] = useState([]);
  const [origenSeleccionado, setOrigenSeleccionado] = useState('');
  const [ambitoSeleccionado, setAmbitoSeleccionado] = useState('');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonText, setButtonText] = useState('Subir archivo');
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageDate, setErrorMessageDate] = useState("");
  const { updateHasChanged } = useFormContext();
  const [hasChanged, setHasChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectorSeleccionado, setSectorSeleccionado] = useState(null);
  const [regionSeleccionada, setRegionSeleccionada] = useState(null);
  const { usuarios } = useFiltroUsuarios(sectorSeleccionado, regionSeleccionada);
  const [fechaMaxima, setFechaMaxima] = useState('');
  const [errorArchivo, setErrorArchivo] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [estado, setEstado] = useState(null);

  const history = useNavigate();
  const handleBackButtonClick = () => {
    if (hasChanged) {
      // Muestra el modal
      setIsModalOpen(true);
    } else {
      // Retrocede solo si no hay cambios
      history(-1);
    }
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

  //detecta cambios sin guardar en el formulario
  function handleOnChange(event) {
    const data = new FormData(event.currentTarget);
    const formHasChanged = Array.from(data.entries()).some(([name, value]) => {
      const initialValue = initialValues[name];
      return value !== String(initialValue);
    });
    setHasChanged(formHasChanged);
    updateHasChanged(formHasChanged);
  }

  useEffect(() => {
    // Establece la fecha máxima permitida como la fecha actual
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
    setFechaMaxima(fechaActual);
  }, []);

  const onSubmit = async (data) => {

    if (!selectedFile) {
      setErrorArchivo("Debes adjuntar un archivo antes de enviar el formulario.");
      return;
    }

    const competenciaData = {
      ...data,
      nombre: data.nombre,
      sectores: sectoresIds,
      regiones: regionesSeleccionadas.map(r => r.value),
      ambito_competencia: ambitoSeleccionado,
      origen: origenSeleccionado,
      usuarios_subdere: usuariosSeleccionados.usuarios_subdere,
      usuarios_dipres: usuariosSeleccionados.usuarios_dipres,
      usuarios_sectoriales: usuariosSeleccionados.usuarios_sectoriales,
      usuarios_gore: usuariosSeleccionados.usuarios_gore,
      fecha_inicio: data.fecha_inicio,
      oficio_origen: selectedFile,
      agrupada: estado,
      plazo_formulario_sectorial: data.plazo_formulario_sectorial,
      plazo_formulario_gore: data.plazo_formulario_gore,
    };

    try {
      const createdCompetencia = await createCompetencia(competenciaData);

      if (data.agrupada && data.competencias_agrupadas && data.competencias_agrupadas.length > 0) {
        const competenciasAgrupadasData = data.competencias_agrupadas.map(item => ({
          nombre: item.nombre,  // Asegúrate de que este campo está siendo recogido correctamente
          competencias: createdCompetencia.id
        }));

        // Envía todas las competencias agrupadas en un solo llamado si es posible
        await createCompetenciaAgrupada(competenciasAgrupadasData);
      }

      updateHasChanged(false);
      setHasChanged(false);
      history('/home/success_creacion', { state: { origen: "crear_competencia" } });
      setErrorGeneral('');

    } catch (error) {
      console.error('Error durante la creación de competencias:', error);
      if (error.response && error.response.data) {
        const errores = error.response.data;
        const primerCampoError = Object.keys(errores)[0];
        const primerMensajeError = errores[primerCampoError][0];
        setErrorGeneral(primerMensajeError);
      } else {
        setErrorGeneral('Error al conectarse con el servidor.');
      }
    }
  };

  //opciones regiones 
  const opcionesRegiones = dataRegiones.map(region => ({
    label: region.region,
    value: region.id,
  }));

  const handleRegionesChange = useCallback((selectedOptions) => {
    const regionIds = selectedOptions.map(option => option.value);
    setRegionesSeleccionadas(selectedOptions);
    setRegionSeleccionada(regionIds); // Asegúrate de que esta línea actualiza correctamente el estado
    setValue('regiones', regionIds);
  }, [setValue]);

  //opciones sector 
  const opcionesSectores = dataSector.map(ministerio => ({
    label: ministerio.nombre,
    options: ministerio.sectores.map(sector => ({
      label: sector.nombre,
      value: sector.id,
      ministerioId: ministerio.id
    }))
  }));

  const handleSectorSelectionChange = (selectedSectorValues) => {
    // Transforma y actualiza el estado con solo los IDs de los sectores
    const sectoresIds = selectedSectorValues.map(sector => sector.value);
    setSectoresIds(sectoresIds);
    setSectorSeleccionado(sectoresIds);
    setValue('sectores', selectedSectorValues, { shouldValidate: true });
  };

  //opciones origen
  const opcionesOrigen = origenes.map(origen => ({
    label: origen.descripcion,
    value: origen.clave,
  }));
  const handleOrigenChange = (selectedOption) => {
    setOrigenSeleccionado(selectedOption.value);
    setValue('origen', selectedOption.value);
  };

  //opciones ambito
  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));
  const handleAmbitoChange = (selectedOption) => {
    setAmbitoSeleccionado(selectedOption.value);
    setValue('ambito_competencia', selectedOption.value);
  };

  const handleUsuariosTransformed = useCallback((nuevosUsuarios) => {
    setUsuariosSeleccionados(nuevosUsuarios);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20971520) { // 20 MB en bytes
        setErrorMessage("Archivo no cumple con el peso permitido");
        setSelectedFile(null);
      } else if (file.type !== 'application/pdf') {
        setErrorMessage("El archivo debe ser de tipo PDF.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setButtonText('Modificar');
        setErrorMessage("");
      }
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setButtonText('Subir archivo');
  };

  const handleUploadClick = () => {
    document.getElementById('fileUploadInput').click();
  };

  const dateInputRef = useRef(null);

  const handleFechaInicioChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    if (selectedDate > formattedToday) {
      setErrorMessageDate("La fecha no puede ser posterior a la fecha actual.");
      event.target.value = formattedToday;
      setValue('fecha_inicio', formattedToday);  // Actualiza el valor en react-hook-form
    } else {
      setErrorMessageDate("");
      setValue('fecha_inicio', selectedDate);  // Actualiza el valor en react-hook-form
    }

    // Log the selected date
    console.log('Selected Date:', selectedDate);
  };

  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado ? 'agrupada' : 'individual'); // Ajusta la UI de los botones según el estado
    setHasChanged(true);
    updateHasChanged(true);
  };

  const userOptions = usuarios ? groupUsersByType(usuarios) : [];

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0"><u>Volver</u></p>
        </button>
        <h3 className="text-sans-h3 ms-3 mb-0">Crear Competencia</h3>
      </div>

      <div className="col-10 ms-5">
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
          <div className="col-12 ">
            <span className="text-sans-h5 mt-5">¿Que tipo de competencia quieres crear?</span>
            <div className=" my-5 " >
              <Controller
                name="agrupada"
                control={control}
                render={({ field }) => (
                  <BtnRadio
                    initialState={activeButton}
                    handleEstadoChange={handleEstadoChange}
                    field={field}
                    errors={errors}
                    altA="Individual"
                    altB="Agrupada"
                  />
                )}
              />
            </div>
            <div className="d-flex text-sans-h6-primary col-11">
              <i className="material-symbols-rounded me-2">info</i>
              <h6>Una competencia individual tiene un nombre para todo el proceso. Una competencia agrupada,
                tiene un alias y varios nombres para visibilizar que incluye varias competencias en un solo proceso.
              </h6>
            </div>
            <span className="d-flex text-sans-h6-primary mx-4 px-2">
              <h6>Esta elección no puede ser cambiada una vez creada la competencia.
              </h6>
            </span>
          </div>
          {estado !== null && (
            <>
              {estado === true && (
                <div className=" mt-5 mb-5 col-12">
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label="Alias del grupo de competencias (Obligatorio)"
                        placeholder="Escribe el alias del grupo de competencias"
                        id="nombre"
                        maxLength={200}
                        error={errors.nombre?.message}
                        {...field}
                      />
                    )}
                  />
                  <div className="my-4">
                    <div className="pb-4">Lista de competencias del grupo</div>
                    <Controller
                      name="competencias_agrupadas"
                      control={control}
                      render={({ field }) => (
                        <ListaNombres
                          control={control}
                          name="competencias_agrupadas"
                          errors={errors}
                          setValue={setValue}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {estado === false && (
                <div className=" mt-5 mb-4 col-12">
                  {/* Componentes visibles solo para competencias individuales */}
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label="Nombre de la Competencia (Obligatorio)"
                        placeholder="Escribe el nombre de la competencia"
                        id="nombre"
                        maxLength={200}
                        error={errors.nombre?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              )}

              <div className="mb-4 col-11 ">
                <CheckboxRegion
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

              <div className="mb-4 col-11">
                <DropdownSelectBuscadorCheck
                  label="Elige el sector de la competencia (Obligatorio)"
                  placeholder="Elige el sector de la competencia"
                  options={opcionesSectores}
                  onSelectionChange={handleSectorSelectionChange}
                  readOnly={false}
                />
                {errors.sectores && (
                  <p className="text-sans-h6-darkred mt-2 mb-0">{errors.sectores.message}</p>
                )}
              </div>

              <div className="mb-4 col-11">
                <DropdownSelectSimple
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

              <div className="mb-4 col-11">
                <DropdownSelectSimple
                  label="Elige el ámbito de la competencia (Obligatorio)"
                  placeholder="Elige el ámbito de la competencia"
                  name="ambito_competencia"
                  options={opcionesAmbito}
                  onSelectionChange={handleAmbitoChange}
                  selected={ambitoSeleccionado}
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
                <div >
                  <DropdownConSecciones
                    key={sectorSeleccionado + '-' + regionSeleccionada}
                    label="Asignar Usuarios (Opcional)"
                    placeholder="Busca el nombre de la persona"
                    options={userOptions}
                    onUsuariosTransformed={handleUsuariosTransformed}
                  />
                  <div className="d-flex mt-3 text-sans-h6-primary col-11">
                    <i className="material-symbols-rounded me-2">info</i>
                    <h6>
                      Esta seccion filtra usuarios de acuerdo a la/las regiones y sectores seleccionado en la parte superior.
                      Para seleccionar usuario Sectorial y GORE, primero debe seleccionar la region y el sector.
                      <br />
                      Si aún no creas los usuarios para esta competencia, puedes crear
                      la competencia y asignarle usuario más tarde.
                    </h6>
                  </div>
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
                              name="oficio_origen"
                              type="file"
                              className="form-control"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              accept=".pdf"
                            />
                            <button type="button" className="btn-secundario-s d-flex" onClick={handleUploadClick}>
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
                  {errorArchivo && (
                    <p className="text-sans-h6-darkred mt-1 mb-0">{errorArchivo}</p>
                  )}

                  <div className="my-4 py-3 col-12">
                    <div className="fecha-oficio-contenedor col-4  ">
                      <span className="text-sans-h5">
                        Elige la fecha del oficio (Obligatorio)
                      </span>
                      <Controller
                        name="fecha_inicio"
                        control={control}
                        render={({ field }) => (
                          <input
                            ref={dateInputRef}
                            onClick={() => dateInputRef.current?.click()}
                            id="dateInput"
                            type="date"
                            className="form-control py-3 my-2 border rounded border-dark-subtle"
                            onChange={(e) => {
                              handleFechaInicioChange(e);
                              field.onChange(e.target.value); // Asegúrate de que el valor también se está enviando a react-hook-form
                            }}
                            value={field.value} // Usa el valor de react-hook-form
                            max={fechaMaxima}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    {errorMessageDate && (
                      <p className="text-sans-h6-darkred mt-1 mb-0">{errorMessageDate}</p>
                    )}
                    {errors.fecha_inicio && (
                      <p className="text-sans-h6-darkred mt-1 mb-0">{errors.fecha_inicio.message}</p>
                    )}
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
                      {...field} />
                  )}
                />
                <div className="d-flex justify-content-between col-11">
                  {errors.plazo_formulario_sectorial && (
                    <p className="text-sans-h6-darkred mt-1 mb-0">{errors.plazo_formulario_sectorial.message}</p>
                  )}
                  <h6 className="text-sans-h6-grey mt-1 ms-auto">Número entre 15 y 30</h6>
                </div>
                <div className="d-flex text-sans-h6-primary col-11 mt-1">
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
                      ref={field.ref}
                      {...field} />
                  )} />
                <div className="d-flex justify-content-between col-11">
                  {errors.plazo_formulario_gore && (
                    <p className="text-sans-h6-darkred mt-1 mb-0">{errors.plazo_formulario_gore.message}</p>
                  )}
                  <h6 className="text-sans-h6-grey mt-1 ms-auto">Número entre 15 y 30</h6>
                </div>

                <div className="d-flex text-sans-h6-primary mt-1">
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
            </>
          )}
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

export default CreacionCompetencia;
