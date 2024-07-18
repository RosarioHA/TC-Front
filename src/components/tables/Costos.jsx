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

const Costos = ({
  id,
  region,
  stepNumber,
  data,
  listado_subtitulos,
  listado_item_subtitulos,
  listado_etapas,
  solo_lectura,
  seccion
}) => {

  const [costos, setCostos] = useState(Array.isArray(data) ? data : []);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [opcionesSubtitulos, setOpcionesSubtitulos] = useState([]);
  const [opcionesEtapas, setopcionesEtapas] = useState([]);
  const [opcionesItemsPorCosto, setOpcionesItemsPorCosto] = useState({});
  const [inputStatus, setInputStatus] = useState({});

  useEffect(() => {
    setCostos(Array.isArray(data) ? data : []);
  }, [data]);

  const formMethods = useForm({
    resolver: yupResolver(construirValidacionPaso5_1ab(costos)),
    mode: 'onBlur',
    defaultValues: costos.reduce(
      (acc, item) => ({
        ...acc,
        [`subtitulo_${item.id}`]: item.subtitulo_label_value?.value || '',
        [`item_subtitulo_${item.id}`]: item.item_subtitulo_label_value?.value || '',
        [`total_anual_${item.id}`]: item.total_anual || '',
        [`es_transversal_${item.id}`]: item.es_transversal || false,
        [`descripcion_${item.id}`]: item.descripcion || '',
      }),
      {}
    ),
  });
  const {
    handleSubmit,
    control,
    clearErrors,
    trigger,
    formState: { errors },
  } = formMethods;

  // Lógicas para llenar opciones de subtitulo e item_subtitulo
  const transformarEnOpciones = (datos, propiedadLabel, propiedadValue = 'id') => {
    return datos.map(dato => ({
      label: dato[propiedadLabel],
      value: dato[propiedadValue].toString()
    }));
  };

  useEffect(() => {
    setOpcionesSubtitulos(transformarEnOpciones(listado_subtitulos, 'subtitulo'));
  }, [listado_subtitulos]);

  const encontrarOpcionesDeItems = (subtituloTexto) => {
    const items = listado_item_subtitulos[subtituloTexto] || [];
    return transformarEnOpciones(items, 'item');
  };

  const actualizarOpcionesDeItems = (subtituloId, subtitulosData, itemSubData) => {
    const subtituloSeleccionado = subtitulosData.find(sub => sub.id.toString() === subtituloId);
    if (!subtituloSeleccionado) return [];

    const items = itemSubData[subtituloSeleccionado.subtitulo] || [];
    return transformarEnOpciones(items, 'item');
  };

  // Inicializa las opciones de items para cada costo cuando recibes los datos iniciales
  useEffect(() => {
    const opcionesIniciales = costos.reduce((acc, costo) => {
      const opcionesDeItems = actualizarOpcionesDeItems(costo.subtitulo_label_value?.value, listado_subtitulos, listado_item_subtitulos);
      return { ...acc, [costo.id]: opcionesDeItems };
    }, {});
    setOpcionesItemsPorCosto(opcionesIniciales);
  }, [costos, listado_subtitulos, listado_item_subtitulos]);

  useEffect(() => {
    if (listado_etapas) {
      setopcionesEtapas(transformarEnOpciones(listado_etapas, 'nombre_etapa'));
    }
  }, [listado_etapas]);

  // Lógica para agregar un nuevo costo
  const onSubmit = () => {
    agregarCostoAdicional();
  };

  const agregarCostoAdicional = async () => {
    const nuevoCostoAdicional = {
      total_anual: '',
    };

    const payload = {
      regiones: [
        {
          region: region,
          [seccion]: [nuevoCostoAdicional],
        },
      ],
    };

    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setCostos((prevCostos) => [
        ...prevCostos,
        {
          ...nuevoCostoAdicional,
        },
      ]);
    } catch (error) {
      console.error('Error al intentar agregar un subtítulo:', error);
    }
  };

  // Lógica para eliminar una ficha de una costo
  const eliminarElemento = async (costoId) => {
    const payload = {
      regiones: [
        {
          region: region,
          [seccion]: [
            {
              id: costoId,
              DELETE: true,
            },
          ],
        },
      ],
    };
    setCostos((prevCostos) =>
      prevCostos.filter(
        (costo) => costo.id !== costoId
      )
    );
    try {
      await handleUpdatePaso(id, stepNumber, payload);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (costoId, campo, valor) => {
    setCostos((prevCostos) =>
      prevCostos.map((costo) => {
        if (costo.id === costoId) {
          return { ...costo, [campo]: valor };
        }
        return costo;
      })
    );
  };

  const handleEsTransversalChange = (costoId, newValue) => {
    setCostos((prevCostos) =>
      prevCostos.map((costo) =>
        costo.id === costoId
          ? { ...costo, es_transversal: newValue }
          : costo
      )
    );
  };

  // Función de guardado
  const buildPayload = (region, seccion, costoId, fields) => {
    return {
      regiones: [
        {
          region: region,
          [seccion]: [
            {
              id: costoId,
              ...fields,
            },
          ],
        },
      ],
    };
  };

  const handleSave = async (costoId, fieldName, newValue) => {
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [costoId]: {
        ...prevStatus[costoId],
        [fieldName]: { loading: true, saved: false },
      },
    }));

    let fields = {};
    if (fieldName === 'subtitulo' || fieldName === 'item_subtitulo') {
      fields[fieldName] = newValue.value;
    } else if (fieldName === 'etapa') {
      fields[fieldName] = newValue.map((option) => option.value);
    } else {
      fields[fieldName] = newValue;
    }

    const payload = buildPayload(region, seccion, costoId, fields);

    try {
      await handleUpdatePaso(id, stepNumber, payload);

      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [costoId]: {
          ...prevStatus[costoId],
          [fieldName]: { loading: false, saved: true },
        },
      }));
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [costoId]: {
          ...prevStatus[costoId],
          [fieldName]: { loading: false, saved: false },
        },
      }));
    }
  };

  return (
    <>
      <div className="mt-4 col-11">
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(costos) &&
            costos.map((costo, index) => (
              <div key={costo.id} className="col mt-4">
                <div className="row">
                  <span className="text-sans-p-bold mb-0">{index + 1}</span>
                  <div className="col d-flex flex-column justify-content-between mt-3">
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
                            onSelectionChange={async (selectedOption) => {

                              // Guardar el subtítulo seleccionado y esperar a que se complete
                              await handleSave(costo.id, 'subtitulo', selectedOption);

                              // Reset item_subtitulo
                              await handleSave(costo.id, 'item_subtitulo', { label: '', value: '' });

                              // Calcular las nuevas opciones para item_subtitulo basado en el subtitulo seleccionado
                              const opcionesDeItems = encontrarOpcionesDeItems(selectedOption.value);

                              // Actualizar el estado con las nuevas opciones
                              setCostos((prevCostos) =>
                                prevCostos.map((costoItem) => {
                                  if (costoItem.id === costo.id) {
                                    return {
                                      ...costoItem,
                                      subtitulo_label_value: selectedOption,
                                      item_subtitulo_label_value: { label: '', value: '' }, // Resetea item_subtitulo
                                      opcionesItems: opcionesDeItems
                                    };
                                  }
                                  return costoItem;
                                })
                              );

                              field.onChange(selectedOption.value);
                            }}

                            readOnly={solo_lectura}
                            selected={
                              costo.subtitulo_label_value &&
                                costo.subtitulo_label_value.value
                                ? costo.subtitulo_label_value
                                : undefined
                            }
                            error={errors[`subtitulo_${costo.id}`]?.message}
                          />
                        );
                      }}
                    />
                  </div>

                  <div className="col border-end  d-flex flex-column justify-content-between mt-3">
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
                            options={opcionesItemsPorCosto[costo.id] || []} // Usa el estado que corresponde a cada costo
                            onSelectionChange={(selectedOption) => {
                              handleSave(costo.id, 'item_subtitulo', selectedOption);
                              field.onChange(selectedOption.value);
                            }}
                            readOnly={solo_lectura}
                            selected={
                              costo.item_subtitulo_label_value &&
                                costo.item_subtitulo_label_value.value
                                ? costo.item_subtitulo_label_value
                                : undefined
                            }
                            error={
                              errors[`item_subtitulo_${costo.id}`]?.message
                            }
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="col d-flex flex-column justify-content-between border-end pe-4 mt-3">
                    <div>
                      <p className="text-sans-p-bold mb-0">Total Anual</p>
                      <p className="mb-0">($M)</p>
                    </div>

                    <Controller
                      control={control}
                      name={`total_anual_${costo.id}`}
                      defaultValue={costo?.total_anual || ''}
                      render={({ field }) => {
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) => {
                          clearErrors(`total_anual_${costo.id}`);
                          onChange(valor);
                          handleInputChange(costo.id, 'total_anual', valor);
                        };

                        const handleBlur = async () => {
                          const isFieldValid = await trigger(`total_anual_${costo.id}`);
                          if (isFieldValid) {
                            handleSave(costo.id, 'total_anual', value);
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
                            loading={inputStatus[costo.id]?.total_anual?.loading}
                            saved={inputStatus[costo.id]?.total_anual?.saved}
                            error={errors[`total_anual_${costo.id}`]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />

                  </div>

                  <div className="col d-flex flex-column justify-content-between border-end mt-3">
                    <div>
                      <p className="text-sans-p-bold mb-0">Etapa</p>
                      <p className="">(Opcional)</p>
                    </div>
                    <div className="ps-2">
                      <Controller
                        control={control}
                        name={`etapa_${costo.id}`}
                        render={({ field }) => {
                          return (
                            <DropdownCheckbox
                              id={`etapa_${costo.id}`}
                              placeholder="Etapa"
                              options={opcionesEtapas}
                              onSelectionChange={(selectedOptions) => {
                                handleSave(costo.id, 'etapa', selectedOptions);
                                field.onChange(selectedOptions);
                              }}
                              titleMaxLength={18}
                              readOnly={solo_lectura || opcionesEtapas.length === 0}
                              selectedValues={costo.etapa_label_value}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-4 d-flex flex-column justify-content-between mt-3">
                    <p className="text-sans-p-bold">¿Es transversal?</p>
                    <Controller
                      control={control}
                      name={`es_transversal_${costo.id}`}
                      defaultValue={costo.es_transversal}
                      render={({ field }) => {
                        return (
                          <OpcionesAB
                            id={`es_transversal_${costo.id}`}
                            readOnly={solo_lectura}
                            initialState={field.value}
                            handleEstadoChange={(newValue) =>
                              handleEsTransversalChange(costo.id, newValue)
                            }
                            loading={inputStatus[costo.id]?.es_transversal?.loading}
                            saved={inputStatus[costo.id]?.es_transversal?.saved}
                            error={
                              errors[`es_transversal_${costo.id}`]?.message
                            }
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
                      const { onChange, onBlur, value } = field;

                      const handleChange = (e) => {
                        clearErrors(`descripcion_${costo.id}`);
                        onChange(e.target.value);
                        handleInputChange(costo.id, 'descripcion', e.target.value);
                      };

                      const handleBlur = async () => {
                        const isFieldValid = await trigger(`descripcion_${costo.id}`);
                        if (isFieldValid) {
                          handleSave(costo.id, 'descripcion', value);
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
                          loading={inputStatus[costo.id]?.descripcion?.loading}
                          saved={inputStatus[costo.id]?.descripcion?.saved}
                          error={errors[`descripcion_${costo.id}`]?.message}
                          readOnly={solo_lectura}
                        />
                      );
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end me-2">
                  {!solo_lectura && (
                    <div className="">
                      <button
                        className="btn-terciario-ghost mt-3"
                        onClick={() => eliminarElemento(costo.id)}
                      >
                        <i className="material-symbols-rounded me-2">delete</i>
                        <p className="mb-0 text-decoration-underline">
                          Borrar subtítulo
                        </p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {!solo_lectura && (
            <button className="btn-secundario-s m-2" type="submit">
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">
                Agregar subtítulo
              </p>
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Costos;
