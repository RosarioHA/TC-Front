import { useState, useEffect, useContext, useCallback } from "react";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownCheckbox from "../../dropdown/checkbox";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { construirEsquemaValidacion } from "../../../validaciones/esquemaEditarFormularioSectorial";
import { OpcionesAB } from "../../forms/opciones_AB";


export const Subpaso_dosPuntoCuatro = ({
  id,
  data,
  stepNumber,
  listado_etapas,
  setRefreshSubpasoDos_cuatro,
  refreshSubpasoDos_cuatro,
}) => {

  const initialState = data.map(item => ({
    ...item,
    estados: {
      nombre_plataforma: { loading: false, saved: false },
      descripcion_tecnica: { loading: false, saved: false },
      costo_adquisicion: { loading: false, saved: false },
      costo_mantencion_anual: { loading: false, saved: false },
      descripcion_costos: { loading: false, saved: false },
      funcion_plataforma: { loading: false, saved: false },
      etapas: { loading: false, saved: false },
      capacitacion_plataforma: { loading: false, saved: false }
    }
  }));

  const [plataformasySoftwares, setPlataformasySoftwares] = useState(initialState);
  const [dataDirecta, setDataDirecta] = useState(null);
  const [opcionesEtapas, setOpcionesEtapas] = useState([]);
  const [etapasSeleccionadas, setEtapasSeleccionadas] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  useEffect(() => {
    const esquema = construirEsquemaValidacion(plataformasySoftwares);
    setEsquemaValidacion(esquema);
  }, [plataformasySoftwares]);

  const { setValue, control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  // Lógica para recargar opciones de etapa cuando se crean o eliminan en paso 2.3
  // Llamada para recargar componente
  const fetchDataDirecta = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  //convertir estructura para el select
  const transformarEnOpciones = (datos) => {
    return datos.map(dato => ({
      label: dato.nombre_etapa,
      value: dato.id.toString() // Convertimos el ID a string para mantener consistencia
    }));
  };

  // refreshSubpasoDos_cuatro es un trigger disparado desde subpaso 2.3
  useEffect(() => {
    if (refreshSubpasoDos_cuatro) {
      fetchDataDirecta();
      setRefreshSubpasoDos_cuatro(false);
    }
  }, [refreshSubpasoDos_cuatro, id, stepNumber]);

  // Efecto para manejar la actualización de opciones basado en dataDirecta
  useEffect(() => {
    if (dataDirecta?.listado_etapas) {
      const nuevasOpciones = transformarEnOpciones(dataDirecta.listado_etapas);
      setOpcionesEtapas(nuevasOpciones);
    }
  }, [dataDirecta]);

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_etapas) {
      const listaInicial = transformarEnOpciones(listado_etapas);
      setOpcionesEtapas(listaInicial);
    }
  }, [listado_etapas]);

  console.log('copciones:', opcionesEtapas)

  // Manejador del Dropdown de etapas
  const handleEtapasChange = useCallback((selectedOptions) => {
    const etapasIds = selectedOptions.map(option => option.value);
    setEtapasSeleccionadas(selectedOptions);
    setValue('etapas', etapasIds);
  }, [setValue]);

  // Función para recargar campos por separado
  const updateFieldState = (plataformaId, fieldName, newState) => {
    setPlataformasySoftwares(prevPlataformas =>
      prevPlataformas.map(plataforma => {
        if (plataforma.id === plataformaId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...plataforma.estados, [fieldName]: { ...newState } };
          return { ...plataforma, estados: updatedEstados };
        }
        return plataforma;
      })
    );
  };

  // Lógica para agregar una nueva tabla Plataformas
  const onSubmit = data => {
    console.log(data);
    // Aquí puedes llamar a la función para agregar la nueva plataforma
    agregarPlataforma();
  };

  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const agregarPlataforma = () => {
    const nuevaPlataformaId = generarIdUnico();
    // Asegúrate de que la nueva plataforma tenga un estado inicial completo
    const nuevaPlataforma = {
      id: nuevaPlataformaId,
      nombre_plataforma: '',
      descripcion_tecnica: '',
      costo_adquisicion: null,
      costo_mantencion_anual: null,
      descripcion_costos: '',
      funcion_plataforma: '',
      etapas: [],
      capacitacion_plataforma: null,
      editando: false,
      estados: { // Estado inicial para 'estados'
        nombre_plataforma: { loading: false, saved: false },
        descripcion_tecnica: { loading: false, saved: false },
        costo_adquisicion: { loading: false, saved: false },
        costo_mantencion_anual: { loading: false, saved: false },
        descripcion_costos: { loading: false, saved: false },
        funcion_plataforma: { loading: false, saved: false },
        etapas: { loading: false, saved: false },
        capacitacion_plataforma: { loading: false, saved: false },
      },
    };

    setPlataformasySoftwares(prevPlataformas => [...prevPlataformas, nuevaPlataforma]);
  };


  // Lógica para eliminar una ficha de una plataforma
  const eliminarElemento = async (plataformaId) => {

    // Preparar payload para eliminar una etapa
    const payload = {
      'p_2_4_plataformas_y_softwares': [{
        id: plataformaId,
        DELETE: true
      }]
    };

    // Actualizar el estado local para reflejar la eliminación
    setPlataformasySoftwares(prevPlataformas => prevPlataformas.filter(plataforma => plataforma.id !== plataformaId));

    // Llamar a la API para actualizar los datos
    try {
      await handleUpdatePaso(id, stepNumber, payload);

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (plataformaId, campo, valor) => {
    setPlataformasySoftwares(prevPlataformas =>
      prevPlataformas.map(plataforma => {
        // Verifica si es la plataforma que estamos actualizando
        if (plataforma.id === plataformaId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...plataforma, [campo]: valor };
        }
        // Si no es la plataforma que estamos actualizando, la retorna sin cambios
        return plataforma;
      })
    );
  };

  const handleCapacitacionChange = (plataformaId, newValue) => {
    setPlataformasySoftwares(prevPlataformas =>
      prevPlataformas.map(plataforma =>
        plataforma.id === plataformaId
          ? { ...plataforma, capacitacion_plataforma: newValue }
          : plataforma
      )
    );
  };

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, newValue) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const plataforma = plataformasySoftwares.find(e => e.id === arrayNameId);

    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;
    if (fieldName === 'etapas') {
      payload = {
        // Forma el payload específico para 'etapas'
        'p_2_4_plataformas_y_softwares': [{
          id: arrayNameId,
          etapas: newValue.map(option => option.value) // Asume que newValue es un array de opciones seleccionadas
        }]
      };
    } else if (fieldName === 'capacitacion_plataforma') {
      payload = {
        // Payload para 'capacitacion_plataforma'
        'p_2_4_plataformas_y_softwares': [{ id: arrayNameId, [fieldName]: newValue }]
      };
    } else {
      // Payload para otros campos
      payload = {
        'p_2_4_plataformas_y_softwares': [{ id: arrayNameId, [fieldName]: plataforma[fieldName] }]
      };
    }

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      const response = await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(arrayNameId, fieldName, { loading: false, saved: true });

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, { type: 'server', message: serverErrors[field][0] });
        });
      }

      updateFieldState(arrayNameId, fieldName, { loading: false, saved: false });
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);



  return (
    <div>
      <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Renderiza las tablas para cada plataforma */}
        {plataformasySoftwares.map((plataforma, index) => (
          <div key={plataforma.id} className="col border">
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold mb-0">{index + 1}</p>
                <p className="text-sans-p-bold ms-2">Nombre de Plataforma o Sofware</p>
              </div>

              <div className="col ms-5">
                <Controller
                  control={control}
                  name={`nombre_plataforma_${plataforma.id}`}
                  defaultValue={plataforma?.nombre_plataforma || ''}
                  render={({ field }) => {
                    // Destructura las propiedades necesarias de field
                    const { onChange, onBlur, value } = field;

                    const handleChange = (e) => {
                      clearErrors(`nombre_plataforma_${plataforma.id}`);
                      onChange(e.target.value);
                      handleInputChange(plataforma.id, 'nombre_plataforma', e.target.value);
                    };

                    // Función para manejar el evento onBlur
                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`nombre_plataforma_${plataforma.id}`);
                      if (isFieldValid) {
                        handleSave(plataforma.id, 'nombre_plataforma');
                      }
                      onBlur();
                    };

                    return (
                      <CustomTextarea
                        id={`nombre_plataforma_${plataforma.id}`}
                        placeholder="Escribe el nombre de la plataforma o software"
                        maxLength={500}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        loading={plataforma.estados?.nombre_plataforma?.loading ?? false}
                        saved={plataforma.estados?.nombre_plataforma?.saved ?? false}
                        error={errors[`nombre_plataforma_${plataforma.id}`]?.message}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <hr />
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
              </div>
              <div className="col ms-5">
                <Controller
                  control={control}
                  name={`descripcion_tecnica_${plataforma.id}`}
                  defaultValue={plataforma?.descripcion_tecnica || ''}
                  render={({ field }) => {
                    // Destructura las propiedades necesarias de field
                    const { onChange, onBlur, value } = field;

                    const handleChange = (e) => {
                      clearErrors(`descripcion_tecnica_${plataforma.id}`);
                      onChange(e.target.value);
                      handleInputChange(plataforma.id, 'descripcion_tecnica', e.target.value);
                    };

                    // Función para manejar el evento onBlur
                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`descripcion_tecnica_${plataforma.id}`);
                      if (isFieldValid) {
                        handleSave(plataforma.id, 'descripcion_tecnica');
                      }
                      onBlur();
                    };

                    return (
                      <CustomTextarea
                        id={`descripcion_tecnica_${plataforma.id}`}
                        placeholder="Escribe el nombre de la plataforma o software"
                        maxLength={500}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        loading={plataforma.estados?.descripcion_tecnica?.loading ?? false}
                        saved={plataforma.estados?.descripcion_tecnica?.saved ?? false}
                        error={errors[`descripcion_tecnica_${plataforma.id}`]?.message}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <hr />
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
              </div>
              <div className="col ms-5">
                <div className="row d-flex">
                  <div className="col">
                    <Controller
                      control={control}
                      name={`costo_adquisicion_${plataforma.id}`}
                      defaultValue={plataforma?.costo_adquisicion || ''}
                      render={({ field }) => {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (e) => {
                          clearErrors(`costo_adquisicion_${plataforma.id}`);
                          onChange(e.target.value);
                          handleInputChange(plataforma.id, 'costo_adquisicion', e.target.value);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () => {
                          const isFieldValid = await trigger(`costo_adquisicion_${plataforma.id}`);
                          if (isFieldValid) {
                            handleSave(plataforma.id, 'costo_adquisicion');
                          }
                          onBlur();
                        };

                        return (
                          <CustomTextarea
                            id={`costo_adquisicion_${plataforma.id}`}
                            label="Costo de adquisición"
                            placeholder="Costo de adquisión M$"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={plataforma.estados?.costo_adquisicion?.loading ?? false}
                            saved={plataforma.estados?.costo_adquisicion?.saved ?? false}
                            error={errors[`costo_adquisicion_${plataforma.id}`]?.message}
                          />
                        );
                      }}
                    />

                    <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                  </div>
                  <div className="col">
                    <Controller
                      control={control}
                      name={`costo_mantencion_anual_${plataforma.id}`}
                      defaultValue={plataforma?.costo_mantencion_anual || ''}
                      render={({ field }) => {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (e) => {
                          clearErrors(`costo_mantencion_anual_${plataforma.id}`);
                          onChange(e.target.value);
                          handleInputChange(plataforma.id, 'costo_mantencion_anual', e.target.value);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () => {
                          const isFieldValid = await trigger(`costo_mantencion_anual_${plataforma.id}`);
                          if (isFieldValid) {
                            handleSave(plataforma.id, 'costo_mantencion_anual');
                          }
                          onBlur();
                        };

                        return (
                          <CustomTextarea
                            id={`costo_mantencion_anual_${plataforma.id}`}
                            label="Costo de Mantención Anual"
                            placeholder="Costo de mantención M$"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={plataforma.estados?.costo_mantencion_anual?.loading ?? false}
                            saved={plataforma.estados?.costo_mantencion_anual?.saved ?? false}
                            error={errors[`costo_mantencion_anual_${plataforma.id}`]?.message}
                          />
                        );
                      }}
                    />
                    <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                  </div>
                </div>
                <div className="row mt-4">
                  <Controller
                    control={control}
                    name={`descripcion_costos_${plataforma.id}`}
                    defaultValue={plataforma?.descripcion_costos || ''}
                    render={({ field }) => {
                      // Destructura las propiedades necesarias de field
                      const { onChange, onBlur, value } = field;

                      const handleChange = (e) => {
                        clearErrors(`descripcion_costos_${plataforma.id}`);
                        onChange(e.target.value);
                        handleInputChange(plataforma.id, 'descripcion_costos', e.target.value);
                      };

                      // Función para manejar el evento onBlur
                      const handleBlur = async () => {
                        const isFieldValid = await trigger(`descripcion_costos_${plataforma.id}`);
                        if (isFieldValid) {
                          handleSave(plataforma.id, 'descripcion_costos');
                        }
                        onBlur();
                      };

                      return (
                        <CustomTextarea
                          id={`descripcion_costos_${plataforma.id}`}
                          label="Descripción de costos"
                          placeholder="Describe los costos de la plataforma o software"
                          maxLength={500}
                          value={value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          loading={plataforma.estados?.descripcion_costos?.loading ?? false}
                          saved={plataforma.estados?.descripcion_costos?.saved ?? false}
                          error={errors[`descripcion_costos_${plataforma.id}`]?.message}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            <hr />
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold ms-2">Función en el ejercicio de la competencia identificando perfiles de usuario</p>
              </div>
              <div className="col ms-5">
                <Controller
                  control={control}
                  name={`funcion_plataforma_${plataforma.id}`}
                  defaultValue={plataforma?.funcion_plataforma || ''}
                  render={({ field }) => {
                    // Destructura las propiedades necesarias de field
                    const { onChange, onBlur, value } = field;

                    const handleChange = (e) => {
                      clearErrors(`funcion_plataforma_${plataforma.id}`);
                      onChange(e.target.value);
                      handleInputChange(plataforma.id, 'funcion_plataforma', e.target.value);
                    };

                    // Función para manejar el evento onBlur
                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`funcion_plataforma_${plataforma.id}`);
                      if (isFieldValid) {
                        handleSave(plataforma.id, 'funcion_plataforma');
                      }
                      onBlur();
                    };

                    return (
                      <CustomTextarea
                        id={`funcion_plataforma_${plataforma.id}`}
                        placeholder="Describe la función en el ejercicio de la competencia y los perfiles de usuario."
                        maxLength={500}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        loading={plataforma.estados?.funcion_plataforma?.loading ?? false}
                        saved={plataforma.estados?.funcion_plataforma?.saved ?? false}
                        error={errors[`funcion_plataforma_${plataforma.id}`]?.message}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <hr />
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold ms-2 mb-0">Etapas donde se utiliza</p>
                <p className="text-sans-p ms-2">(Opcional)</p>
              </div>
              <div className="col ms-5">
                <Controller
                  control={control}
                  name={`etapas_${plataforma.id}`}
                  render={({ field }) => {
                    return (
                      <DropdownCheckbox
                        id={`etapas_${plataforma.id}`}
                        name={`etapas_${plataforma.id}`}
                        placeholder="Elige la o las Etapas donde se utiliza"
                        options={opcionesEtapas}
                        onSelectionChange={(selectedOptions) => {
                          handleSave(plataforma.id, 'etapas', selectedOptions);
                          field.onChange(selectedOptions);
                        }}

                        readOnly={false}
                        selectedValues={plataforma.etapas_label_value}

                        loading={plataforma.estados?.etapas?.loading ?? false}
                        saved={plataforma.estados?.etapas?.saved ?? false}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <hr />
            <div className="row p-3">
              <div className="col-2">
                <p className="text-sans-p-bold ms-2 mb-0">¿El uso de la plataforma o software requirió capacitación?</p>
              </div>
              <div className="col ms-5">
                <Controller
                  control={control}
                  name={`capacitacion_plataforma_${plataforma.id}`}
                  defaultValue={plataforma.capacitacion_plataforma}
                  render={({ field, fieldState }) => {
                    return (
                      <OpcionesAB
                        id={`capacitacion_plataforma_${plataforma.id}`}
                        readOnly={false}
                        initialState={field.value}
                        handleEstadoChange={(newValue) => handleCapacitacionChange(plataforma.id, newValue)}
                        loading={plataforma.estados?.capacitacion_plataforma?.loading ?? false}
                        saved={plataforma.estados?.capacitacion_plataforma?.saved ?? false}
                        error={fieldState.error?.message}
                        altA="Si"
                        altB="No"
                        field={field}
                        handleSave={handleSave}
                        arrayNameId={plataforma.id}
                        fieldName="capacitacion_plataforma"
                      />
                    );
                  }}
                />

              </div>
            </div>

            <div className="col d-flex align-items-center">
              <button
                className="btn-terciario-ghost"
                onClick={() => eliminarElemento(plataforma.id)}>
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar ficha</p>
              </button>
            </div>
          </div>
        ))}

        <div className="row">
          <div className="p-2">
            <button type="submit" className="btn-secundario-s">
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar ficha técnica</p>
            </button>
          </div>
        </div>
      </form>

    </div>
  )
};