import { useState, useContext, useEffect } from "react";
import CustomTextarea from "../forms/custom_textarea";
import DropdownCheckbox from "../dropdown/checkbox";
import DropdownSelect from "../dropdown/select";
import InputCosto from "../forms/input_costo";
import { OpcionesAB } from "../forms/opciones_AB";
import { FormularioContext } from "../../context/FormSectorial";
import { construirValidacionPaso5_1ab } from "../../validaciones/esquemaValidarPaso5Sectorial";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const CostosIndirectos = ({
  id,
  data,
  stepNumber,
  listado_subtitulos,
  listado_item_subtitulos,
  listado_etapas,
  setRefreshSubpaso_CincoDos,
  setRefreshSumatoriaCostos,
  formulario_enviado
}) => {

  const initialState = data?.map(item => ({
    ...item,
    subtituloSeleccionado: '',
    opcionesItems: [],
    estados: {
      etapa: { loading: false, saved: false },
      item_subtitulo: { loading: false, saved: false },
      nombre_item_subtitulo: { loading: false, saved: false },
      total_anual: { loading: false, saved: false },
      es_transversal: { loading: false, saved: false },
      descripcion: { loading: false, saved: false }
    }
  }));

  const [costosIndirectos, setCostosIndirectos] = useState(initialState);
  const [opcionesSubtitulos, setOpcionesSubtitulos] = useState([]);
  const [opcionesEtapas, setopcionesEtapas] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  const defaultValues = costosIndirectos.reduce((acc, costoIndirecto) => {
    if (costoIndirecto.item_subtitulo) {
      acc[`subtitulo_${costoIndirecto.id}`] = "Valor existente";
    }
    acc[`item_subtitulo_${costoIndirecto.id}`] = costoIndirecto.item_subtitulo || '';
    return acc;
  }, {});

  useEffect(() => {
    const esquema = construirValidacionPaso5_1ab(costosIndirectos);
    setEsquemaValidacion(esquema);
  }, [costosIndirectos]);

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
    defaultValues
  });

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map(dato => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString()
    }));
  };

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_subtitulos) {
      const opcionesDeSubtitulos = transformarEnOpciones(listado_subtitulos, 'subtitulo');
      setOpcionesSubtitulos(opcionesDeSubtitulos);
    }
  }, [listado_subtitulos]);


  const encontrarOpcionesDeItems = (subtituloSeleccionado) => {
    const items = listado_item_subtitulos[subtituloSeleccionado] || [];
    return transformarEnOpciones(items, 'item');
  };

  useEffect(() => {
    if (listado_etapas) {
      const opcionesDeEtapas = transformarEnOpciones(listado_etapas, 'nombre_etapa');
      setopcionesEtapas(opcionesDeEtapas);
    }
  }, [listado_etapas]);

  // Función para recargar campos por separado
  const updateFieldState = (costoDirectoId, fieldName, newState) => {
    setCostosIndirectos(prevCostosIndirectos =>
      prevCostosIndirectos.map(costoIndirecto => {
        if (costoIndirecto.id === costoDirectoId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...costoIndirecto.estados, [fieldName]: { ...newState } };
          return { ...costoIndirecto, estados: updatedEstados };
        }
        return costoIndirecto;
      })
    );
  };

  // Lógica para agregar una nueva tabla Plataformas
  const onSubmit = data => {
    console.log(data);
    // Aquí puedes llamar a la función para agregar la nueva costo
    agregarCostoIndirecto();
  };

  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const agregarCostoIndirecto = () => {
    const nuevoCostoIndirectoId = generarIdUnico();
    // Asegúrate de que la nueva costo tenga un estado inicial completo
    const nuevoCostoIndirecto = {
      id: nuevoCostoIndirectoId,
      etapa: [],
      item_subtitulo: [],
      nombre_item_subtitulo: [],
      total_anual: null,
      es_transversal: null,
      descripcion: '',
      editando: false,
      estados: { // Estado inicial para 'estados'
        etapa: { loading: false, saved: false },
        item_subtitulo: { loading: false, saved: false },
        nombre_item_subtitulo: { loading: false, saved: false },
        total_anual: { loading: false, saved: false },
        es_transversal: { loading: false, saved: false },
        descripcion: { loading: false, saved: false }
      },
    };

    setCostosIndirectos(prevCostosIndirectos => [...prevCostosIndirectos, nuevoCostoIndirecto]);
  };


  // Lógica para eliminar una ficha de una costo
  const eliminarElemento = async (elementoId) => {

    // Preparar payload para eliminar una etapa
    const payload = {
      'p_5_1_b_costos_indirectos': [{
        id: elementoId,
        DELETE: true
      }]
    };

    // Actualizar el estado local para reflejar la eliminación
    setCostosIndirectos(prevCostosIndirectos => prevCostosIndirectos.filter(costoIndirecto => costoIndirecto.id !== elementoId));

    // Llamar a la API para actualizar los datos
    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setRefreshSubpaso_CincoDos(true);
      setRefreshSumatoriaCostos(true);

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (elementoId, campo, valor) => {
    setCostosIndirectos(prevCostosIndirectos =>
      prevCostosIndirectos.map(elemento => {
        // Verifica si es la costo que estamos actualizando
        if (elemento.id === elementoId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...elemento, [campo]: valor };
        }
        // Si no es la costo que estamos actualizando, la retorna sin cambios
        return elemento;
      })
    );
  };

  const handleEsTransversalChange = (costoDirectoId, newValue) => {
    setCostosIndirectos(prevCostosIndirectos =>
      prevCostosIndirectos.map(costoIndirecto =>
        costoIndirecto.id === costoDirectoId
          ? { ...costoIndirecto, es_transversal: newValue }
          : costoIndirecto
      )
    );
  };

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, newValue) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const costoIndirecto = costosIndirectos.find(e => e.id === arrayNameId);

    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;
    if (fieldName === 'etapa') {
      payload = {
        'p_5_1_b_costos_indirectos': [{
          id: arrayNameId,
          [fieldName]: newValue.map(option => option.value)
        }]
      };
    } else if (fieldName === 'item_subtitulo') {
      // Ajuste para enviar 'item_subtitulo' como un valor único, no un array
      // Asumiendo que newValue es un objeto de la opción seleccionada
      payload = {
        'p_5_1_b_costos_indirectos': [{
          id: arrayNameId,
          [fieldName]: newValue.value // Envía el valor seleccionado directamente
        }]
      };
    } else if (fieldName === 'es_transversal') {
      payload = {
        // Payload para 'es_transversal'
        'p_5_1_b_costos_indirectos': [{ id: arrayNameId, [fieldName]: newValue }]
      };
    } else {
      // Payload para otros campos
      payload = {
        'p_5_1_b_costos_indirectos': [{ id: arrayNameId, [fieldName]: costoIndirecto[fieldName] }]
      };
    }

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
     await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(arrayNameId, fieldName, { loading: false, saved: true });
      setRefreshSubpaso_CincoDos(true);
      setRefreshSumatoriaCostos(true);

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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {costosIndirectos.map((costo, index) => (
          <div key={costo.id} className="col mt-4">
            <div className="row">
              <span className="text-sans-p-bold mb-0">{index + 1}</span>
              <div className="col d-flex flex-column justify-content-between">
                <p className="text-sans-p-bold">Subtítulo</p>
                <Controller
                  control={control}
                  name={`subtitulo_${costo.id}`}
                  render={({ field }) => {
                    return (
                      <DropdownSelect
                        id={`subtitulo_${costo.id}`}
                        name={`subtitulo_${costo.id}`}
                        placeholder="Subtítulos"
                        options={opcionesSubtitulos}
                        onSelectionChange={(selectedOption) => {
                          const textoSubtitulo = listado_subtitulos.find(subtitulo => subtitulo.id.toString() === selectedOption.value)?.subtitulo;
                          const opcionesDeItems = encontrarOpcionesDeItems(textoSubtitulo);

                          setCostosIndirectos(prevCostosIndirectos => prevCostosIndirectos.map(costoIndirecto => {
                            if (costoIndirecto.id === costo.id) {
                              return {
                                ...costoIndirecto,
                                subtituloSeleccionado: textoSubtitulo,
                                opcionesItems: opcionesDeItems,
                              };
                            }
                            return costoIndirecto;
                          }));
                          field.onChange(selectedOption.value);
                        }}

                        readOnly={formulario_enviado}
                        selected={costo.subtitulo_label_value}

                        loading={costo.estados?.subtitulo?.loading ?? false}
                        saved={costo.estados?.subtitulo?.saved ?? false}
                        error={errors[`subtitulo_${costo.id}`]?.message}
                      />
                    );
                  }}
                />
              </div>

              <div className="col border-end d-flex flex-column justify-content-between">
                <p className="text-sans-p-bold">Item</p>
                <Controller
                  control={control}
                  name={`item_subtitulo_${costo.id}`}
                  render={({ field }) => {
                    return (
                      <DropdownSelect
                        id={`item_subtitulo_${costo.id}`}
                        name={`item_subtitulo_${costo.id}`}
                        placeholder="Ítem"
                        options={costo.opcionesItems}
                        onSelectionChange={(selectedOptions) => {
                          handleSave(costo.id, 'item_subtitulo', selectedOptions);
                          field.onChange(selectedOptions.value);
                        }}

                        readOnly={formulario_enviado}
                        selected={costo.item_subtitulo_label_value}

                        loading={costo.estados?.item_subtitulo?.loading ?? false}
                        saved={costo.estados?.item_subtitulo?.saved ?? false}
                        error={errors[`item_subtitulo_${costo.id}`]?.message}
                      />
                    );
                  }}
                />
              </div>

              <div className="col border-end d-flex flex-column justify-content-between">
                <div>
                  <p className="text-sans-p-bold mb-0">Total Anual</p>
                  <p>($M)</p>
                </div>
                  
                <Controller
                  control={control}
                  name={`total_anual_${costo.id}`}
                  defaultValue={costo?.total_anual || ''}
                  render={({ field }) => {
                    // Destructura las propiedades necesarias de field
                    const { onChange, onBlur, value } = field;

                    const handleChange = (valor) => {
                      clearErrors(`total_anual_${costo.id}`);
                      onChange(valor);
                      handleInputChange(costo.id, 'total_anual', valor);
                    };

                    // Función para manejar el evento onBlur
                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`total_anual_${costo.id}`);
                      if (isFieldValid) {
                        handleSave(costo.id, 'total_anual');
                      }
                      onBlur();
                    };

                    return (
                      <InputCosto
                        id={`total_anual_${costo.id}`}
                        placeholder="Costo (M$)"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        loading={costo.estados?.total_anual?.loading ?? false}
                        saved={costo.estados?.total_anual?.saved ?? false}
                        error={errors[`total_anual_${costo.id}`]?.message}
                        disabled={formulario_enviado}
                      />
                    );
                  }}
                />
              </div>

              <div className="col border-end d-flex flex-column justify-content-between">
                <div className="d-flex">
                  <p className="text-sans-p-bold mb-0">Etapa</p>
                  <p className="ms-2">(Opcional)</p>
                </div>
                <div className="ps-2">
                  <Controller
                    control={control}
                    name={`etapa_${costo.id}`}
                    render={({ field }) => {
                      return (
                        <DropdownCheckbox
                          id={`etapa_${costo.id}`}
                          name={`etapa_${costo.id}`}
                          placeholder="Etapa"
                          options={opcionesEtapas}
                          onSelectionChange={(selectedOptions) => {
                            handleSave(costo.id, 'etapa', selectedOptions);
                            field.onChange(selectedOptions);
                          }}

                        readOnly={formulario_enviado}
                        selectedValues={costo.etapa_label_value}

                          loading={costo.estados?.etapa?.loading ?? false}
                          saved={costo.estados?.etapa?.saved ?? false}
                        />
                      );
                    }}
                  />
                </div>
                
              </div>
              <div className="col d-flex flex-column justify-content-between">
                <p className="text-sans-p-bold">¿Es transversal?</p>
                <Controller
                  control={control}
                  name={`es_transversal_${costo.id}`}
                  defaultValue={costo.es_transversal}
                  render={({ field, fieldState }) => {
                    return (
                      <OpcionesAB
                        id={`es_transversal_${costo.id}`}
                        readOnly={formulario_enviado}
                        initialState={field.value}
                        handleEstadoChange={(newValue) => handleEsTransversalChange(costo.id, newValue)}
                        loading={costo.estados?.es_transversal?.loading ?? false}
                        saved={costo.estados?.es_transversal?.saved ?? false}
                        error={fieldState.error?.message}
                        altA="Si"
                        altB="No"
                        field={field}
                        handleSave={handleSave}
                        arrayNameId={costo.id}
                        fieldName="es_transversal"
                      />
                    );
                  }}
                />
              </div>
            </div>

            <div className="row pe-3 mt-4">
              <Controller
                control={control}
                name={`descripcion_${costo.id}`}
                defaultValue={costo?.descripcion || ''}
                render={({ field }) => {
                  // Destructura las propiedades necesarias de field
                  const { onChange, onBlur, value } = field;

                  const handleChange = (e) => {
                    clearErrors(`descripcion_${costo.id}`);
                    onChange(e.target.value);
                    handleInputChange(costo.id, 'descripcion', e.target.value);
                  };

                  // Función para manejar el evento onBlur
                  const handleBlur = async () => {
                    const isFieldValid = await trigger(`descripcion_${costo.id}`);
                    if (isFieldValid) {
                      handleSave(costo.id, 'descripcion');
                    }
                    onBlur();
                  };

                  return (
                    <CustomTextarea
                      id={`descripcion_${costo.id}`}
                      label="Descripción"
                      placeholder="Describe el costo por subtítulo e ítem."
                      maxLength={500}
                      value={value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      loading={costo.estados?.descripcion?.loading ?? false}
                      saved={costo.estados?.descripcion?.saved ?? false}
                      error={errors[`descripcion_${costo.id}`]?.message}
                      readOnly={formulario_enviado}
                    />
                  );
                }}
              />
            </div>

            <div className="d-flex justify-content-end me-2">
              {( !formulario_enviado) && (
                <div className="">
                  <button
                    className="btn-terciario-ghost mt-3"
                    onClick={() => eliminarElemento(costo.id)}
                  >
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">Borrar subtítulo</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          className="btn-secundario-s m-2"
          type="submit">
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar subtítulo</p>
        </button>
      </form>
    </div>
  )
};

export default CostosIndirectos;
