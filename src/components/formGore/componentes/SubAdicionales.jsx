import { useContext, useState, useEffect } from 'react';
import DropdownSelect from '../../dropdown/select';
import InputCosto from '../../forms/input_costo';
import CustomTextarea from '../../forms/custom_textarea';
import { OpcionesAB } from '../../forms/opciones_AB';
import { FormGOREContext } from '../../../context/FormGore';
import { useForm, Controller } from 'react-hook-form';
import { esquemaSubAdicionales } from '../../../validaciones/esquemaSubAdicionales';
import { yupResolver } from '@hookform/resolvers/yup';

export const SubAdicionales = ({
  solo_lectura,
  titulo,
  itemSub,
  subtitulos,
  seccion,
  data,
}) => {
  const [subAdicionales, setSubAdicionales] = useState(Array.isArray(data) ? data : []);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [opcionesSubtitulos, setOpcionesSubtitulos] = useState([]);
  const [opcionesItemsPorCosto, setOpcionesItemsPorCosto] = useState({});
  const [inputStatus, setInputStatus] = useState({});


  //console.log(esquemaValidacion)// no eliminar

  useEffect(() => {
    setSubAdicionales(Array.isArray(data) ? data : []);
  }, [data]);

  const formMethods = useForm({
    resolver: yupResolver(esquemaSubAdicionales(subAdicionales)),
    mode: 'onBlur',
    defaultValues: subAdicionales.reduce(
      (acc, item) => ({
        ...acc,
        [`subtitulo_${item.id}`]: item.subtitulo_label_value?.value || '',
        [`item_subtitulo_${item.id}`]: item.item_subtitulo_label_value?.value || '',
        [`total_anual_gore_${item.id}`]: item.total_anual_gore || '',
        [`es_transitorio_${item.id}`]: item.es_transitorio || false,
        [`descripcion_${item.id}`]: item.descripcion || '',
      }),
      {}
    ),
  });
  const {
    handleSubmit,
    control,
    setError,
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
    setOpcionesSubtitulos(transformarEnOpciones(subtitulos, 'subtitulo'));
  }, [subtitulos]);

  const encontrarOpcionesDeItems = (subtituloTexto) => {
    const items = itemSub[subtituloTexto] || [];
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
    const opcionesIniciales = subAdicionales.reduce((acc, costo) => {
      const opcionesDeItems = actualizarOpcionesDeItems(costo.subtitulo_label_value?.value, subtitulos, itemSub);
      return { ...acc, [costo.id]: opcionesDeItems };
    }, {});
    setOpcionesItemsPorCosto(opcionesIniciales);
  }, [subAdicionales, subtitulos, itemSub]);


  // Lógica para agregar un nuevo costo
  const onSubmit = () => {
    agregarSubAdicional();
  };

  const agregarSubAdicional = async () => {
    const nuevoSubAdicional = {
      total_anual_gore: null,
      es_transitorio: '',
      descripcion: '',
    };

    const payload = {
      [seccion]: [nuevoSubAdicional],
    };

    try {
      await updatePasoGore(payload);
      setSubAdicionales((prevSubAdicionales) => [
        ...prevSubAdicionales,
        {
          ...nuevoSubAdicional,
        },
      ]);
    } catch (error) {
      console.error('Error al intentar agregar un subtítulo:', error);
    }
  };

  // Lógica para eliminar una ficha de una costo
  const eliminarElemento = async (subAdicionalId) => {
    const payload = {
      [seccion]: [
        {
          id: subAdicionalId,
          DELETE: true,
        },
      ],
    };
    setSubAdicionales((prevSubAdicionales) =>
      prevSubAdicionales.filter(
        (subAdicional) => subAdicional.id !== subAdicionalId
      )
    );
    try {
      await updatePasoGore(payload);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (subAdicionalId, campo, valor) => {
    setSubAdicionales((prevSubAdicionales) =>
      prevSubAdicionales.map((subAdicional) => {
        if (subAdicional.id === subAdicionalId) {
          return { ...subAdicional, [campo]: valor };
        }
        return subAdicional;
      })
    );
  };

  const handleEsTransitorioChange = (subAdicionalId, newValue) => {
    setSubAdicionales((prevSubAdicionales) =>
      prevSubAdicionales.map((subAdicional) =>
        subAdicional.id === subAdicionalId
          ? { ...subAdicional, es_transitorio: newValue }
          : subAdicional
      )
    );
  };

  // Función de guardado
  const handleSave = async (
    costoId,
    fieldName,
    newValue
  ) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const subAdicional = subAdicionales.find((e) => e.id === costoId);

    setInputStatus(prevStatus => ({
      ...prevStatus,
      [costoId]: {
          ...prevStatus[costoId],
          [fieldName]: { loading: true, saved: false },
      },
    }));

    let payload;
    if (fieldName === 'subtitulo') {
      // Ajuste para enviar 'subtitulo' como un valor único, no un array
      // Asumiendo que newValue es un objeto de la opción seleccionada
      payload = {
        [seccion]: [
          {
            id: costoId,
            [fieldName]: newValue.value, // Envía el valor seleccionado directamente
          },
        ],
      };
    } else if (fieldName === 'item_subtitulo') {
      // Ajuste para enviar 'item_subtitulo' como un valor único, no un array
      // Asumiendo que newValue es un objeto de la opción seleccionada
      payload = {
        [seccion]: [
          {
            id: costoId,
            [fieldName]: newValue.value, // Envía el valor seleccionado directamente
          },
        ],
      };
    } else if (fieldName === 'es_transitorio') {
      payload = {
        // Payload para 'es_transitorio'
        [seccion]: [{ id: costoId, [fieldName]: newValue }],
      };
    } else {
      // Payload para otros campos
      payload = {
        [seccion]: [{ id: costoId, [fieldName]: subAdicional[fieldName] }],
      };
    }

    try {
      await updatePasoGore(payload);
      
      // Finalizar carga con éxito
      setInputStatus(prevStatus => ({
          ...prevStatus,
          [costoId]: {
              ...prevStatus[costoId],
              [fieldName]: { loading: false, saved: true },
          },
      }));

  } catch (error) {
      console.error('Error al guardar los datos:', error);
      // Finalizar carga con error
      setInputStatus(prevStatus => ({
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
        <div className="subrayado col-12">
          <span className="py-2 ps-2 my-2 align-self-center">{titulo}</span>
        </div>
        <div className="text-sans-h6-primary my-3 col-12">
          <h6>
            En caso de requerir subtítulos adicionales puedes agregarlos a
            continuación. Deberás justificarlos en el siguiente paso. En el paso
            3 podrás elegir al personal de comisión de servicio que necesites.
          </h6>
        </div>
        <div></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(subAdicionales) &&
            subAdicionales.map((costo, index) => (
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
                            onSelectionChange={async (selectedOption) => {

                              // Guardar el subtítulo seleccionado y esperar a que se complete
                              await handleSave(costo.id, 'subtitulo', selectedOption);

                              // Reset item_subtitulo
                              await handleSave(costo.id, 'item_subtitulo', { label: '', value: '' });

                              // Calcular las nuevas opciones para item_subtitulo basado en el subtitulo seleccionado
                              const opcionesDeItems = encontrarOpcionesDeItems(selectedOption.value);

                              // Actualizar el estado con las nuevas opciones
                              setSubAdicionales((prevCostos) =>
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

                  <div className="col border-end  d-flex flex-column justify-content-between">
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
                  <div className="col d-flex flex-column justify-content-between border-end pe-4">
                    <div>
                      <p className="text-sans-p-bold mb-0">Total Anual</p>
                      <p className="mb-0">($M)</p>
                    </div>

                    <Controller
                      control={control}
                      name={`total_anual_gore_${costo.id}`}
                      defaultValue={costo?.total_anual_gore || ''}
                      render={({ field }) => {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) => {
                          clearErrors(`total_anual_gore_${costo.id}`);
                          onChange(valor);
                          handleInputChange(
                            costo.id,
                            'total_anual_gore',
                            valor
                          );
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () => {
                          const isFieldValid = await trigger(
                            `total_anual_gore_${costo.id}`
                          );
                          if (isFieldValid) {
                            handleSave(costo.id, 'total_anual_gore');
                          }
                          onBlur();
                        };

                        const handleKeyDown = (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        };

                        return (
                          <InputCosto
                            id={`total_anual_gore_${costo.id}`}
                            placeholder="Costo (M$)"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            loading={inputStatus[costo.id]?.total_anual_gore?.loading}
                            saved={inputStatus[costo.id]?.total_anual_gore?.saved}
                            error={errors[`total_anual_gore_${costo.id}`]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>

                  <div className="col d-flex flex-column justify-content-between">
                    <p className="text-sans-p-bold">¿Es transitorio?</p>
                    <Controller
                      control={control}
                      name={`es_transitorio_${costo.id}`}
                      defaultValue={costo.es_transitorio}
                      render={({ field }) => {
                        return (
                          <OpcionesAB
                            id={`es_transitorio_${costo.id}`}
                            readOnly={solo_lectura}
                            initialState={field.value}
                            handleEstadoChange={(newValue) =>
                              handleEsTransitorioChange(costo.id, newValue)
                            }
                            loading={inputStatus[costo.id]?.es_transitorio?.loading}
                            saved={inputStatus[costo.id]?.es_transitorio?.saved}
                            error={
                              errors[`es_transitorio_${costo.id}`]?.message
                            }
                            altA="Si"
                            altB="No"
                            field={field}
                            handleSave={handleSave}
                            arrayNameId={costo.id}
                            fieldName="es_transitorio"
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
                        handleInputChange(
                          costo.id,
                          'descripcion',
                          e.target.value
                        );
                      };

                      // Función para manejar el evento onBlur
                      const handleBlur = async () => {
                        const isFieldValid = await trigger(
                          `descripcion_${costo.id}`
                        );
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
