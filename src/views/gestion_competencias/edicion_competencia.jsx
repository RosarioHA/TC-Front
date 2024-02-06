import { useState, useEffect, useCallback ,useMemo} from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownCheckbox from "../../components/dropdown/checkbox";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
import { useOrigenes } from "../../hooks/useOrigenes";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { useAmbitos } from "../../hooks/useAmbitos";
import { useEditCompetencia } from "../../hooks/competencias/useEditCompetencia"
import { useFormContext } from "../../context/FormAlert";
import ModalAbandonoFormulario from "../../components/commons/modalAbandonoFormulario";
import { DropdownSelectBuscadorCheck } from "../../components/dropdown/select_buscador_checkbox";
import { useFiltroUsuarios } from "../../hooks/usuarios/useFiltroUsuarios";

const groupUsersByType = (usuarios) => {
  if (!usuarios || usuarios.length === 0) {
    return [];
  }
  const grouped = usuarios.reduce((acc, user) => {
    const perfil = user.perfil;
    acc[ perfil ] = acc[ perfil ] || [];
    acc[ perfil ].push(user);
    return acc;
  }, {});

  return Object.entries(grouped).map(([ perfil, users ]) => ({
    label: perfil,
    options: users,
  }));
};

const EdicionCompetencia = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [ editMode, setEditMode ] = useState(false);
  const [ readOnly, setReadOnly ] = useState(false);
  const { dataRegiones } = useRegion();
  const { dataSector } = useSector();
  const { origenes } = useOrigenes();
  const { ambitos } = useAmbitos();
  const { competencia, updateCompetencia } = useEditCompetencia(id);
  const [ usuariosSeleccionados, setUsuariosSeleccionados ] = useState();
  const { updateHasChanged } = useFormContext();
  const [ hasChanged, setHasChanged ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ sectoresSeleccionados, setSectoresSeleccionados ] = useState([]);
  const [ selectedReadOnlyOptions, setSelectedReadOnlyOptions ] = useState([]);
  const [ sectorSeleccionado, setSectorSeleccionado ] = useState(null);
  const [ regionSeleccionada, setRegionSeleccionada ] = useState(null);
  const { usuarios } = useFiltroUsuarios(sectorSeleccionado, regionSeleccionada);

  //opciones selectores
  const opcionesRegiones = useMemo(() => dataRegiones.map(region => ({
    label: region.region,
    value: region.id,
  })), [dataRegiones]); 
  const opcionesOrigen = origenes.map(origen => ({
    label: origen.descripcion,
    value: origen.clave,
  }));
  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));

  //data competencia
  const regionesSeleccionadas = competencia ? competencia.regiones.map(regionId => {
    const region = dataRegiones.find(region => region.id === regionId);
    return {
      label: region.region,
      value: region.id,
    };
  }) : [];
  const ambitoSeleccionado = ambitos.find(ambito => ambito.id === competencia?.ambito_competencia);
  const origenSeleccionado = origenes.find(origen => origen.clave === competencia?.origen)

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onSubmit",
    defaultValues: {
      nombre: "",
      regiones: regionesSeleccionadas,
      sectores: sectoresSeleccionados,
      ambito_competencia: null,
      origen: null,
      plazo_formulario_sectorial: "",
      plazo_formulario_gore: "",
      usuarios_subdere: [],
      usuarios_dipres: [],
      usuarios_sectoriales: [],
      usuarios_gore: [],
    },
  });

  useEffect(() => {
    if (editMode && competencia) {
      // Inicializar el formulario con los detalles de la competencia
      setValue("nombre", competencia.nombre || "");
      setValue("regiones", competencia.regiones || null);
      setValue("ambito_competencia", competencia.ambito_competencia || null);
      setValue("origen", competencia.origen || null);
      setValue("sectores", competencia.sectores || null);
      setValue("plazo_formulario_sectorial", competencia.plazo_formulario_sectorial || "");
      setValue("plazo_formulario_gore", competencia.plazo_formulario_gore || "");
      setValue("usuarios_dipres", competencia.usuarios_dipres || null);
      setValue("usuarios_gore", competencia.usuarios_gore || null);
      setValue("usuarios_sectoriales", competencia.usuarios_sectoriales || null);
      setValue("usuarios_subdere", competencia.usuarios_subdere || null);
    }
  }, [ editMode, competencia, setValue ]);

  //detecta cambios sin guardar en el formulario
  function handleOnChange(event) {
    const data = new FormData(event.currentTarget);
    // Verifica si hay cambios respecto al valor inicial
    const formHasChanged = Array.from(data.entries()).some(([ name, value ]) => {
      const initialValue = competencia[ name ];
      return value !== String(initialValue);
    });
    setHasChanged(formHasChanged);
    // Actualiza el valor de hasChanged en el contexto
    updateHasChanged(formHasChanged);
  }

  useEffect(() => {
    if (editMode && competencia) {
      // Resto de la inicialización del formulario...
      const sectorInicial = competencia.sectores?.[ 0 ]?.id; // Asumiendo que competencia.sectores es un array
      setSectorSeleccionado(sectorInicial);
      // Transforma el sector inicial en el formato adecuado para el selector si es necesario
      const sectoresFormateados = competencia.sectores?.map(sector => ({
        label: sector.nombre,
        value: sector.id,
      }));
      setSectoresSeleccionados(sectoresFormateados);
    }
  }, [ editMode, competencia ]);

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
    const sectorId = selectedSectorValues.map(sector => sector.value);
    setSectorSeleccionado(sectorId);
    setSectoresSeleccionados(selectedSectorValues);
    setValue('sectores', selectedSectorValues, { shouldValidate: true });
    updateHasChanged(true);
    setHasChanged(true);
  };

  const handleRegionesChange = useCallback((selectedRegiones) => {
    const regionId = selectedRegiones.map(region => region.value);
    setRegionSeleccionada(regionId);
    setValue("regiones", regionId, { shouldValidate: true });
    updateHasChanged(true);
    setHasChanged(true);
  }, [setValue, updateHasChanged]);

  function handleAmbitoChange(selectedAmbito) {
    setValue("ambito_competencia", selectedAmbito.value);
    updateHasChanged(true);
    setHasChanged(true);
  }

  const handleOrigenChange = (selectedOrigen) => {
    setValue("origen", selectedOrigen.value);
    updateHasChanged(true);
    setHasChanged(true);
  };

  const onSubmit = async (formData) => {
    try {
      const sectorIds = sectoresSeleccionados.map(sector => sector.value);
      const dataToSend = {
        ...formData,
        sectores: sectorIds,
        ...usuariosSeleccionados
      };

      await updateCompetencia(dataToSend);
      setEditMode(false);
      updateHasChanged(false);
      setHasChanged(false);
      history('/home/success_edicion', { state: { origen: "editar_competencia", id } });
    } catch (error) {
      console.error("Error al guardar la competencia:", error);
    }
  };

  const handleUsuariosTransformed = useCallback((nuevosUsuarios) => {
    setUsuariosSeleccionados(nuevosUsuarios);
  }, []);

  const handleBackButtonClick = () => {
    if (editMode) {
      setEditMode(false);
    } else if (hasChanged) {
      setIsModalOpen(true);
    } else {
      history(-1);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setReadOnly(!editMode);
  };

  useEffect(() => {
    if (competencia) {
      const sectoresPreseleccionados = competencia.sectores.map(sector => ({
        label: sector.nombre,
        value: sector.id,
      }));
      setSectoresSeleccionados(sectoresPreseleccionados);
      setSectoresSeleccionados(sectoresPreseleccionados);
      setSelectedReadOnlyOptions(sectoresPreseleccionados);
    }
  }, [ competencia ]);

  const extractFileName = (url) => {
    return url.split('/').pop();
  };

  // manejo de usuario 
  const userOptions = usuarios ? groupUsersByType(usuarios) : [];
  const [ combinedUsers, setCombinedUsers ] = useState([]);

  const combineUsers = (competencia) => {
    const { usuarios_dipres, usuarios_gore, usuarios_sectoriales, usuarios_subdere } = competencia;
  
    // Función para agregar el nombre del perfil a cada usuario
    const addProfileToUsers = (users, profile) => {
      return users.map(user => ({ ...user, perfil: profile }));
    };
  
    // Combina los usuarios de todos los perfiles, añadiendo la información del perfil
    return [
      ...addProfileToUsers(usuarios_dipres, 'DIPRES'),
      ...addProfileToUsers(usuarios_gore, 'GORE'),
      ...addProfileToUsers(usuarios_sectoriales, 'Usuario Sectorial'),
      ...addProfileToUsers(usuarios_subdere, 'SUBDERE')
    ];
  };
  
  useEffect(() => {
    if (competencia) {
      const usuariosCombinados = combineUsers(competencia);
      setCombinedUsers(usuariosCombinados);
    }
  }, [competencia]);

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex  align-items-center justify-content-between mb-5">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver</p>
          </button>
          <h3 className="text-sans-h3 ms-3 mb-0">Competencia: {competencia?.nombre}</h3>
        </div>
        <button className="btn-secundario-s ms-3" onClick={toggleEditMode}>
          <p className="mb-0 ms-2">{editMode ? 'Editando' : 'Editar'}</p>
          <i className="material-symbols-rounded me-2">{editMode ? 'edit' : 'edit'}</i>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
        <div className="mb-4">
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Nombre de la Competencia (Obligatorio)"
                placeholder={competencia ? competencia.nombre : ''}
                id="nombre"
                name="nombre"
                readOnly={!editMode || readOnly}
                error={errors.nombre_completo?.message}
                {...field}
              />
            )} />
        </div>

        <div className="mb-4 col-11">
          <Controller
            name="regiones"
            control={control}
            render={({ field }) => (
              <DropdownCheckbox
                label="Región (Obligatorio)"
                placeholder="Elige la o las regiones donde se ejercerá la competencia"
                id="regiones"
                name="regiones"
                options={opcionesRegiones}
                readOnly={!editMode}
                prevSelection={regionesSeleccionadas}
                onSelectionChange={handleRegionesChange}
                selectedOptions={field.value}
                selectedRegions={regionesSeleccionadas}
              />
            )}
          />
        </div>

        <div className="mb-4 col-11">
          <DropdownSelectBuscadorCheck
            label="Elige el sector de la competencia (Obligatorio)"
            placeholder="Elige el sector de la competencia"
            options={opcionesSectores}
            onSelectionChange={handleSectorSelectionChange}
            readOnly={!editMode}
            selectedReadOnlyOptions={selectedReadOnlyOptions}
            editMode={editMode}
            competencia={competencia}
          />

          {errors.sectores && (
            <p className="text-sans-h6-darkred mt-2 mb-0">{errors.sectores.message}</p>
          )}
        </div>

        <div className="mb-4 col-11">
          <Controller
            name="origen"
            control={control}
            render={() => (
              <DropdownSelect
                label="Origen de la competencia (Obligatorio)"
                placeholder={competencia ? origenSeleccionado?.descripcion || '' : ''}
                id="origen"
                name="origen"
                options={opcionesOrigen}
                readOnly={!editMode}
                control={control}
                onSelectionChange={handleOrigenChange}
                initialValue={origenSeleccionado}
              />
            )} />
        </div>

        <div className="mb-4 col-11">
          <Controller
            name="ambito_competencia"
            control={control}
            render={() => (
              <DropdownSelect
                label="Elige el ámbito de la competencia (Obligatorio)"
                placeholder={competencia ? ambitoSeleccionado?.nombre || '' : ''}
                id="ambito_competencia"
                name="ambito_competencia"
                options={opcionesAmbito}
                readOnly={!editMode}
                control={control}
                onSelectionChange={handleAmbitoChange}
                initialValue={ambitoSeleccionado}
              />
            )} />
        </div>

        <div className="my-4 h-auto">
          <DropdownConSecciones
            key={sectorSeleccionado + '-' + regionSeleccionada}
            label="Asignar Usuarios (Opcional)"
            placeholder="Busca el nombre de la persona"
            options={userOptions}
            readOnly={!editMode}
            onUsuariosTransformed={handleUsuariosTransformed}
            usuariosCompetencia={combinedUsers}
          />
        </div>

        <div className="mb-5 col-11">
          {editMode ? (
            <div>
              <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
              <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            </div>
          ) : (
            <h5 className="text-sans-h5">Oficio correspondiente a la competencia</h5>
          )}
          <table className="table table-striped table align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" htmlFor="fileUploadInput" className="form-label">Documento</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td className="text-sans-h6-grey">{competencia?.oficio_origen ? extractFileName(competencia.oficio_origen) : 'No disponible'}</td>
                <td>
                  {competencia?.oficio_origen ? (
                    <a type="button" href={competencia.oficio_origen} target="_blank" rel="noopener noreferrer" download className="btn-secundario-s link-underline link-underline-opacity-0"><u>Descargar</u>
                      <span className="material-symbols-outlined">
                        download
                      </span></a>
                  ) : 'No disponible'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={editMode ? 'mb-3' : 'mb-4'}>
          <Controller
            name="plazo_formulario_sectorial"
            control={control}
            render={({ field }) => (
              < CustomInput
                label="Plazo para formulario sectorial (Obligatorio)"
                placeholder={competencia ? competencia.plazo_formulario_sectorial : ''}
                id="plazo_formulario_sectorial"
                maxLength={null}
                readOnly={!editMode}
                error={errors.plazo_formulario_gore?.message}
                {...field} />
            )}
          />
        </div>
        {editMode && (
          <div className="d-flex text-sans-h6-primary pb-4">
            <i className="material-symbols-rounded me-2">info</i>
            <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
          </div>
        )}

        <div className={editMode ? 'mb-3' : 'mb-4'}>
          <Controller
            name="plazo_formulario_gore"
            control={control}
            render={({ field }) => (
              < CustomInput
                label="Plazo para formulario GORE (Obligatorio)"
                placeholder={competencia ? competencia.plazo_formulario_gore : ''}
                id="plazo_formulario_gore"
                maxLength={null}
                readOnly={!editMode}
                error={errors.plazo_formulario_gore?.message}
                {...field} />
            )} />
        </div>
        {editMode && (
          <div className="d-flex text-sans-h6-primary pb-4">
            <i className="material-symbols-rounded me-2">info</i>
            <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario GORE a la competencia. </h6>
          </div>
        )}

        <div className="py-2">
          {editMode ? (
            <button className="btn-primario-s my-4" type="submit">
              <i className="material-symbols-rounded me-2">save</i>
              <p className="mb-0">Guardar</p>
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </form>
      {isModalOpen && (
        <ModalAbandonoFormulario
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}

export default EdicionCompetencia;