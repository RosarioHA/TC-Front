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
  const [subAdicionales, setSubAdicionales] = useState(
    Array.isArray(data) ? data : []
  );
  const { updatePasoGore, refetchTriggerGore, patchResponse, patchError } =
    useContext(FormGOREContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);
  const [opcionesSubtitulos, setOpcionesSubtitulos] = useState([]);
  const [inputStatus, setInputStatus] = useState({});

  console.log(esquemaValidacion);

  
  useEffect(() => {
    console.log("Data inicial:", data);
    setSubAdicionales(Array.isArray(data) ? data : []);
  }, [data]);
  
  const formMethods = useForm({
    resolver: yupResolver(esquemaSubAdicionales(subAdicionales)),
    mode: 'onBlur',
    defaultValues: subAdicionales.reduce(
      (acc, item) => ({
        ...acc,
        [`subtitulo_${item.id}`]: item.subtitulo_label_value?.value || '',
        [`item_subtitulo_${item.id}`]:
          item.item_subtitulo_label_value?.value || '',
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

  useEffect(() => {
    const esquema = esquemaSubAdicionales(subAdicionales);
    setEsquemaValidacion(esquema);
  }, [subAdicionales]);




  useEffect(() => {
    setOpcionesSubtitulos(
      subtitulos?.map((subtitulo) => ({
        label: subtitulo.subtitulo,
        value: subtitulo.id.toString(),
      }))
    );
  }, [subtitulos]);

  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map((dato) => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString(),
    }));
  };
  const encontrarOpcionesDeItems = (subtituloSeleccionado) => {
    const items = itemSub[subtituloSeleccionado] || [];
    return transformarEnOpciones(items, 'item');
  };

  useEffect(() => {
    const newInputStatus = subAdicionales.reduce(
      (acc, subAdicional) => ({
        ...acc,
        [subAdicional.id]: {
          subtitulo: { loading: false, saved: false },
          item_subtitulo: { loading: false, saved: false },
          etapa: { loading: false, saved: false },
          total_anual_gore: { loading: false, saved: false },
          descripcion: { loading: false, saved: false },
          es_transitorio: { loading: false, saved: false },
        },
      }),
      {}
    );

    setInputStatus(newInputStatus);
  }, [subAdicionales]);

  // Lógica para agregar una nueva tabla Plataformas
  const onSubmit = () => {
    agregarSubAdicional();
  };

  useEffect(() => {
    if (patchError) {
      console.error('Error al agregar el subtítulo:', patchError);
    } else if (
      patchResponse &&
      patchResponse.data &&
      patchResponse.data.seccion
    ) {
      const listaActualizadaDeSubAdicionales = patchResponse.data.seccion;
      const nuevoSubAdicional = {
        ...listaActualizadaDeSubAdicionales[
          listaActualizadaDeSubAdicionales.length - 1
        ],
        isItemSubtituloReadOnly: true,
      };
      setSubAdicionales((prevSubAdicionales) => [
        ...prevSubAdicionales,
        nuevoSubAdicional,
      ]);
    }
    // Esta lógica se ejecuta cada vez que patchResponse o patchError cambien.
  }, [patchResponse, patchError]);

  const agregarSubAdicional = async () => {
    const nuevoSubAdicional = {
      total_anual_gore: null,
      es_transitorio: '',
      descripcion: '',
      subtitulo_label_value: { label: '', value: '' },
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
      refetchTriggerGore();
    } catch (error) {
      console.error('Error al intentar agregar un subtítulo:', error);
    }
  };

  // Lógica para eliminar una ficha de una costo
  const eliminarElemento = async (subAdicionalId) => {
    console.log('id', subAdicionalId);
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
          if (campo === 'item_subtitulo') {
            return { ...subAdicional, subtitulo_label_value: valor }; // Actualiza subtitulo_label_value con el objeto {label, value}
          }
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
    arrayNameId,
    fieldName,
    newValue,
    subAdicionalId
  ) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const subAdicional = subAdicionales.find((e) => e.id === arrayNameId);

    let payload;
    if (fieldName === 'item_subtitulo') {
      // Ajuste para enviar 'item_subtitulo' como un valor único, no un array
      // Asumiendo que newValue es un objeto de la opción seleccionada
      payload = {
        [seccion]: [
          {
            id: arrayNameId,
            [fieldName]: newValue.value, // Envía el valor seleccionado directamente
          },
        ],
      };
    } else if (fieldName === 'es_transitorio') {
      payload = {
        // Payload para 'es_transitorio'
        [seccion]: [{ id: arrayNameId, [fieldName]: newValue }],
      };
    } else {
      // Payload para otros campos
      payload = {
        [seccion]: [{ id: arrayNameId, [fieldName]: subAdicional[fieldName] }],
      };
    }
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [subAdicionalId]: {
        ...prevStatus[subAdicionalId],
        [fieldName]: { loading: true, saved: false },
      },
    }));

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      await updatePasoGore(payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [subAdicionalId]: {
          ...prevStatus[subAdicionalId],
          [fieldName]: { loading: false, saved: true },
        },
      }));
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [subAdicionalId]: {
          ...prevStatus[subAdicionalId],
          [fieldName]: { loading: false, saved: false },
        },
      }));

      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, { type: 'server', message: serverErrors[field][0] });
        });
      }
    }
  };

  console.log(inputStatus);
  return (
    <>
      <div className="mt-4 col-11">
        <div className="subrayado col-12">
          <span className="py-2 my-2 align-self-center">{titulo}</span>
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
                            onSelectionChange={(selectedOption) => {
                              const textoSubtitulo = subtitulos.find(
                                (subtitulo) =>
                                  subtitulo.id.toString() ===
                                  selectedOption.value
                              )?.subtitulo;
                              const opcionesDeItems =
                                encontrarOpcionesDeItems(textoSubtitulo);

                              setSubAdicionales((prevCostos) =>
                                prevCostos.map((costo) => {
                                  if (costo.id === costo.id) {
                                    return {
                                      ...costo,
                                      subtituloSeleccionado: textoSubtitulo,
                                      opcionesItems: opcionesDeItems,
                                      isItemSubtituloReadOnly: false,
                                    };
                                  }
                                  return costo;
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
                            loading={
                              inputStatus[costo.id]?.item_subtitulo?.loading ??
                              false
                            }
                            saved={
                              inputStatus[costo.id]?.item_subtitulo?.saved ??
                              false
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
                            options={costo.opcionesItems}
                            onSelectionChange={(selectedOptions) => {
                              handleSave(
                                costo.id,
                                'item_subtitulo',
                                selectedOptions
                              );
                              setSubAdicionales((prevCostos) =>
                                prevCostos?.map((costo) => {
                                  if (costo.id === costo.id) {
                                    return {
                                      ...costo,
                                      isItemSubtituloReadOnly: true,
                                    };
                                  }
                                  return costo;
                                })
                              );
                              field.onChange(selectedOptions.value);
                            }}
                            readOnly={costo.isItemSubtituloReadOnly}
                            selected={
                              costo.item_subtitulo_label_value &&
                              costo.item_subtitulo_label_value.value
                                ? costo.item_subtitulo_label_value
                                : undefined
                            }
                            loading={
                              inputStatus[costo.id]?.item_subtitulo?.loading
                            }
                            saved={inputStatus[costo.id]?.item_subtitulo?.saved}
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

                        return (
                          <InputCosto
                            id={`total_anual_gore_${costo.id}`}
                            placeholder="Costo (M$)"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={
                              inputStatus[costo.id]?.total_anual_gore
                                ?.loading ?? false
                            }
                            saved={
                              inputStatus[costo.id]?.total_anual_gore?.saved ??
                              false
                            }
                            error={
                              errors[`total_anual_gore_${costo.id}`]?.message
                            }
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
                            loading={
                              inputStatus[costo.id]?.es_transitorio?.loading ??
                              false
                            }
                            saved={
                              inputStatus[costo.id]?.es_transitorio?.saved ??
                              false
                            }
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
