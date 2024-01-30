import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/dropdown/select";
import DropdownCheckbox from "../../components/dropdown/checkbox";
import DropdownConSecciones from "../../components/dropdown/checkbox_conSecciones_conTabla";
import SubirArchivo from "../../components/forms/subir_archivo";
import { useOrigenes } from "../../hooks/useOrigenes";
import { useRegion } from "../../hooks/useRegion";
import { useSector } from "../../hooks/useSector";
import { useAmbitos } from "../../hooks/useAmbitos";
import { useEditCompetencia } from "../../hooks/competencias/useEditCompetencia"
import { useUsers } from "../../hooks/usuarios/useUsers";
import { useFormContext } from "../../context/FormAlert";
import ModalAbandonoFormulario from "../../components/commons/modalAbandonoFormulario";

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

const EdicionCompetencia = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [ editMode, setEditMode ] = useState(false);
  const { dataRegiones } = useRegion();
  const { dataSector } = useSector();
  const { origenes } = useOrigenes();
  const { ambitos } = useAmbitos();
  const { users } = useUsers();
  const userOptions = groupUsersByType(users);
  const { competencia, updateCompetencia } = useEditCompetencia(id);
  const [ usuariosSeleccionados, setUsuariosSeleccionados ] = useState();
  const { updateHasChanged } = useFormContext();
  const [ hasChanged, setHasChanged ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  //opciones selectores
  const opcionesRegiones = dataRegiones.map(region => ({
    label: region.region,
    value: region.id,
  }));
  const opcionesSectores = dataSector.map(sector => ({
    label: sector.nombre,
    value: sector.id,
  }));
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
  const sectoresMap = new Map(dataSector.map(sector => [ sector.nombre, sector.id ]));
  const sectoresSeleccionados = competencia ? competencia.sectores.map(sector => ({
    label: sector.nombre,
    value: sectoresMap.get(sector.nombre), // Obtiene el ID correspondiente al nombre
  })) : [];
  console.log("sectores seleccionados", sectoresSeleccionados)
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
      // setValue("sectores", competencia.sectores || null);
      setValue("sectores", competencia.sectores.map(sector => ({
        label: sector.nombre,
        value: sector.id,
      })) || null);
      setValue("ambito_competencia", competencia.ambito_competencia || null);
      setValue("origen", competencia.origen || null);
      setValue("plazo_formulario_sectorial", competencia.plazo_formulario_sectorial || "");
      setValue("plazo_formulario_gore", competencia.plazo_formulario_gore || "");
    }
  }, [ editMode, competencia, setValue ]);

  //detecta cambios sin guardar en el formulario
  function handleOnChange(event) {
    const data = new FormData(event.currentTarget);
    // Verifica si hay cambios respecto al valor inicial
    const formHasChanged = Array.from(data.entries()).some(([name, value]) => {
      const initialValue = competencia[name];
      return value !== String(initialValue);
    });
    setHasChanged(formHasChanged);
    // Actualiza el valor de hasChanged en el contexto
    updateHasChanged(formHasChanged);
  }

  //manejo de cambios en campos editables
  const handleSectoresChange = (selectedSectores) => {
    const selectedSectoresValues = selectedSectores.map(sector => sector.value);
    setValue("sectores", selectedSectoresValues);
    updateHasChanged(true);
    setHasChanged(true);
  };

  const handleRegionesChange = (selectedRegiones) => {
    const selectedRegionesValues = selectedRegiones.map(region => region.value);
    setValue("regiones", selectedRegionesValues);
    updateHasChanged(true);
    setHasChanged(true);
  };

  const handleAmbitoChange = (selectedAmbito) => {
    setValue("ambito_competencia", selectedAmbito.value);
    updateHasChanged(true);
    setHasChanged(true);
  };

  const handleOrigenChange = (selectedOrigen) => {
    setValue("origen", selectedOrigen.value);
    updateHasChanged(true);
    setHasChanged(true);
  };

  const onSubmit = async (formData) => {
    try {
      await updateCompetencia(formData);
      setEditMode(false);
      history('/home/success', { state: { origen: "editar_competencia" } });
    } catch (error) {
      console.error("Error al guardar la competencia:", error);
    }
  };

  const handleUsuariosTransformed = useCallback((nuevosUsuarios) => {
    setUsuariosSeleccionados(nuevosUsuarios);
  }, []);
  console.log('com', usuariosSeleccionados)


  const handleBackButtonClick = () => {
    if (editMode) {
      setEditMode(false);
    } else if (hasChanged) {
      setIsModalOpen(true);
    } else {
      history(-1);
    }
  };
  
  const handleEditClick = () => {
    setEditMode((prevMode) => !prevMode);
  };

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
        <button className="btn-secundario-s" onClick={handleEditClick}>
          <i className="material-symbols-rounded me-2">edit</i>
          <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
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
                readOnly={!editMode}
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
              />
            )} />

        </div>

        <div className="mb-4 col-11">
          <Controller
            name="sectores"
            control={control}
            render={({ field }) => (
              <DropdownCheckbox
                label="Elige el sector de la competencia (Obligatorio)"
                placeholder='Elige el sector de la competencia'
                id="sectores"
                name="sectores"
                options={opcionesSectores}
                readOnly={!editMode}
                prevSelection={sectoresSeleccionados}
                onSelectionChange={handleSectoresChange}
                selectedOptions={field.value}
              />
            )} />
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

        <div className="my-4">
          < DropdownConSecciones
            label="Asignar Usuarios (Opcional)"
            placeholder="Busca el nombre de la persona"
            options={userOptions}
            onUsuariosTransformed={handleUsuariosTransformed}
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
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-2">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
          <div className="row neutral-line align-items-center">
            {/* ESTE CAMPO NO ES EDITABLE, SOLO DEBE PERMITIR DESCARGAR  */}
            <SubirArchivo
              readOnly={true}
              index="1"
              fileType="No seleccionado" />
          </div>
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
          direction='-1'
          goBack={true}
        />
      )}
    </div>
  );
}

export default EdicionCompetencia;