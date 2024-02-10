import { useState, useContext, useEffect } from "react";
import CustomTextarea from "../forms/custom_textarea";
import DropdownCheckbox from "../dropdown/checkbox";
import DropdownSelect from "../dropdown/select";
import { OpcionesAB } from "../forms/opciones_AB";
import { FormularioContext } from "../../context/FormSectorial";
import { construirValidacionPaso5_1a } from "../../validaciones/esquemaValidarPaso5Sectorial";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const CostosDirectos = ({
  id,
  data,
  stepNumber,
  listado_subtitulos,
  listado_item_subtitulos,
  listado_etapas,
  setRefreshSubpaso_CincoDos,
  setRefreshSumatoriaCostos,
}) => {

  const initialState = data?.map(item => ({
    ...item,
    estados: {
      etapa: { loading: false, saved: false },
      item_subtitulo: { loading: false, saved: false },
      nombre_item_subtitulo: { loading: false, saved: false },
      total_anual: { loading: false, saved: false },
      es_transversal: { loading: false, saved: false },
      descripcion: { loading: false, saved: false }
    }
  }));

  const [costosDirectos, setCostosDirectos] = useState(initialState);
  const [opcionesSubtitulos, setOpcionesSubtitulos] = useState([]);
  const [subtituloSeleccionado, setSubtituloSeleccionado] = useState('');
  const [opcionesItems, setOpcionesItems] = useState([]);
  const [opcionesEtapas, setopcionesEtapas] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  useEffect(() => {
    const esquema = construirValidacionPaso5_1a(costosDirectos);
    setEsquemaValidacion(esquema);
  }, [costosDirectos]);

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
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

  useEffect(() => {
    console.log("listado_item_subtitulos actual:", listado_item_subtitulos);
    console.log("Subtítulo actualmente seleccionado:", subtituloSeleccionado);
    if (subtituloSeleccionado && listado_item_subtitulos[subtituloSeleccionado]) {
      const opcionesDeItems = transformarEnOpciones(listado_item_subtitulos[subtituloSeleccionado], 'item');
      setOpcionesItems(opcionesDeItems);
      console.log("opcionesItems actualizado:", opcionesDeItems); // Debugging
    } else {
      setOpcionesItems([]);
      console.log("opcionesItems vaciado"); // Debugging
    }
  }, [subtituloSeleccionado, listado_item_subtitulos]);

  useEffect(() => {
    if (listado_etapas) {
      const opcionesDeEtapas = transformarEnOpciones(listado_etapas, 'nombre_etapa');
      setopcionesEtapas(opcionesDeEtapas);
    }
  }, [listado_etapas]);

  // Función para recargar campos por separado
  const updateFieldState = (costoDirectoId, fieldName, newState) => {
    setCostosDirectos(prevCostosDirectos =>
      prevCostosDirectos.map(costoDirecto => {
        if (costoDirecto.id === costoDirectoId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...costoDirecto.estados, [fieldName]: { ...newState } };
          return { ...costoDirecto, estados: updatedEstados };
        }
        return costoDirecto;
      })
    );
  };

  // Lógica para agregar una nueva tabla Plataformas
  const onSubmit = data => {
    console.log(data);
    // Aquí puedes llamar a la función para agregar la nueva costo
    agregarCostoDirecto();
  };

  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const agregarCostoDirecto = () => {
    const nuevoCostoDirectoId = generarIdUnico();
    // Asegúrate de que la nueva costo tenga un estado inicial completo
    const nuevoCostoDirecto = {
      id: nuevoCostoDirectoId,
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

    setCostosDirectos(prevCostosDirectos => [...prevCostosDirectos, nuevoCostoDirecto]);
  };


  // Lógica para eliminar una ficha de una costo
  const eliminarElemento = async (costoDirectoId) => {

    // Preparar payload para eliminar una etapa
    const payload = {
      'p_5_1_a_costos_directos': [{
        id: costoDirectoId,
        DELETE: true
      }]
    };

    // Actualizar el estado local para reflejar la eliminación
    setCostosDirectos(prevCostosDirectos => prevCostosDirectos.filter(costoDirecto => costoDirecto.id !== costoDirectoId));

    // Llamar a la API para actualizar los datos
    try {
      await handleUpdatePaso(id, stepNumber, payload);

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (costoDirectoId, campo, valor) => {
    setCostosDirectos(prevCostosDirectos =>
      prevCostosDirectos.map(costoDirecto => {
        // Verifica si es la costo que estamos actualizando
        if (costoDirecto.id === costoDirectoId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...costoDirecto, [campo]: valor };
        }
        // Si no es la costo que estamos actualizando, la retorna sin cambios
        return costoDirecto;
      })
    );
  };

  const handleEsTransversalChange = (costoDirectoId, newValue) => {
    setCostosDirectos(prevCostosDirectos =>
      prevCostosDirectos.map(costoDirecto =>
        costoDirecto.id === costoDirectoId
          ? { ...costoDirecto, es_transversal: newValue }
          : costoDirecto
      )
    );
  };

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, newValue) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const costoDirecto = costosDirectos.find(e => e.id === arrayNameId);

    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;
    if (fieldName === 'etapa') {
      payload = {
        'p_5_1_a_costos_directos': [{
          id: arrayNameId,
          [fieldName]: newValue.map(option => option.value)
        }]
      };
    } else if (fieldName === 'item_subtitulo') {
      // Ajuste para enviar 'item_subtitulo' como un valor único, no un array
      // Asumiendo que newValue es un objeto de la opción seleccionada
      payload = {
        'p_5_1_a_costos_directos': [{
          id: arrayNameId,
          [fieldName]: newValue.value // Envía el valor seleccionado directamente
        }]
      };
    } else if (fieldName === 'es_transversal') {
      payload = {
        // Payload para 'es_transversal'
        'p_5_1_a_costos_directos': [{ id: arrayNameId, [fieldName]: newValue }]
      };
    } else {
      // Payload para otros campos
      payload = {
        'p_5_1_a_costos_directos': [{ id: arrayNameId, [fieldName]: costoDirecto[fieldName] }]
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {costosDirectos.map((costo, index) => (
          <div key={costo.id} className="col mt-4">
            <div className="row">
              <div className="col">
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
                          if (textoSubtitulo) {
                            setSubtituloSeleccionado(textoSubtitulo);
                            field.onChange(selectedOption.value);
                          } else {
                            console.error("Subtítulo seleccionado no encontrado en la lista de subtítulos.");
                          }
                        }}

                        readOnly={false}
                        selected={costo.subtitulo_label_value}

                        loading={costo.estados?.subtitulo?.loading ?? false}
                        saved={costo.estados?.subtitulo?.saved ?? false}
                      />
                    );
                  }}
                />
              </div>
              <div className="col">
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
                        options={opcionesItems}
                        onSelectionChange={(selectedOptions) => {
                          handleSave(costo.id, 'item_subtitulo', selectedOptions);
                          field.onChange(selectedOptions);
                        }}

                        readOnly={false}
                        selected={costo.item_subtitulo_label_value}

                        loading={costo.estados?.item_subtitulo?.loading ?? false}
                        saved={costo.estados?.item_subtitulo?.saved ?? false}
                      />
                    );
                  }}
                />
              </div>
              <div className="col">
                <p className="text-sans-p-bold mb-0">Total Anual</p>
                <p>($M)</p>
                <input></input>
              </div>
              <div className="col">
                <div className="d-flex">
                  <p className="text-sans-p-bold mb-0">Etapa</p>
                  <p className="ms-2">(Opcional)</p>
                </div>
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

                        readOnly={false}
                        selectedValues={costo.etapa_label_value}

                        loading={costo.estados?.etapa?.loading ?? false}
                        saved={costo.estados?.etapa?.saved ?? false}
                      />
                    );
                  }}
                />
              </div>
              <div className="col">
                <p className="text-sans-p-bold">¿Es transversal?</p>
                <OpcionesAB
                  altA="Si"
                  altB="No" />
              </div>
            </div>

            <div className="row pe-3">
              <CustomTextarea
                label="Descripción "
                placeholder="Describe el costo por subtítulo e ítem"
                maxLength={500} />
            </div>

            <div className="d-flex justify-content-end me-2">
              {index.length > 1 && ( // Condición para mostrar el botón "Eliminar"
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
          onClick={agregarCostoDirecto}>
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar subtítulo</p>
        </button>
      </form>
    </div>
  )
};

export default CostosDirectos;
