import { useState, useEffect, useContext } from 'react';
import CustomInputArea from '../../forms/textarea_paso2';
import { DropdownCheckbox2 } from '../../dropdown/checkbox2.0';
import { FormularioContext } from '../../../../context/FormSectorial';
// import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';
import { useForm, Controller } from 'react-hook-form';

export const Subpaso_dosPuntoTres = ({
  id,
  data,
  stepNumber,
  listado_unidades,
  // refreshSubpasoDos_tres,
  // setRefreshSubpasoDos_tres,
  // setRefreshSubpasoDos_cuatro,
  solo_lectura,
  limite_caracteres,
}) =>
{
  const { control } = useForm({
    mode: 'onBlur',
  });

  const [ dataDirecta ] = useState(null);
  const [ opciones, setOpciones ] = useState([]);
  const { handleUpdatePaso, refetchTrigger } = useContext(FormularioContext);
  const [ etapas, setEtapas ] = useState(data);
  const [ ultimaEtapaId ] = useState(null);
  const [ mostrarBotonGuardarEtapa, setMostrarBotonGuardarEtapa ] =
    useState(false);
  const [
    mostrarBotonGuardarProcedimiento,
    setMostrarBotonGuardarProcedimiento,
  ] = useState(false);
  const [ etapaEnEdicionId ] = useState(null);

  const [ errorGuardado, setErrorGuardado ] = useState('');
  const [ mensajesError, setMensajesError ] = useState({});
  const [ errorProcedimientos, setErrorProcedimientos ] = useState({});
  const [ edicionProcedimiento, setEdicionProcedimiento ] = useState({
    etapaId: null,
    procedimientoId: null,
  });

  console.log('e', errorGuardado)

  console.log(edicionProcedimiento)

  useEffect(() =>
  {
    if (data)
    {
      setEtapas(data);
    }
  }, [ data ]);

  // Asegúrate de que cada procedimiento en tus etapas tenga un estado inicial para las unidades intervinientes, por ejemplo:
  etapas.map((etapa) => ({
    ...etapa,
    procedimientos: etapa.procedimientos.map((proc) => ({
      ...proc,
      unidades_intervinientes: proc.unidades_intervinientes || [],
      unidades_intervinientes_label_value: proc.unidades_intervinientes.map(
        (id) =>
          opciones.find((op) => op.value === id.toString()) || {
            label: 'Desconocido',
            value: id,
          }
      ),
    })),
  }));

  // // Llamada para recargar componente, en este caso a listado unidades
  // const fetchDataDirecta = useCallback(async () => {
  //   setCargandoEtapas(true); // Inicia la carga
  //   try {
  //     const response = await apiTransferenciaCompentencia.get(
  //       `/formulario-sectorial/${id}/paso-${stepNumber}/`
  //     );
  //     setDataDirecta(response.data);
  //     setCargandoEtapas(false); // Finaliza la carga
  //   } catch (error) {
  //     console.error('Error al obtener datos directamente:', error);
  //     setCargandoEtapas(false); // Asegura finalizar la carga incluso si hay un error
  //   }
  // }, [id, stepNumber]);

  // useEffect(() => {
  //   if (refreshSubpasoDos_tres) {
  //     fetchDataDirecta();
  //     setRefreshSubpasoDos_tres(false);
  //   }
  // }, [refreshSubpasoDos_tres, fetchDataDirecta, setRefreshSubpasoDos_tres]);

  useEffect(() =>
  {
    // Asumiendo que 'data' es la prop que recibe las etapas desde el padre
    if (data)
    {
      // Actualiza el estado 'etapas' con la nueva data
      setEtapas(data);
    }
  }, [ data ]);

  useEffect(() =>
  {
    if (data && data.p_2_3_etapas_ejercicio_competencia)
    {
      setEtapas(data.p_2_3_etapas_ejercicio_competencia);
    }
  }, [ data ]);

  //convertir estructura para el select
  const transformarEnOpciones = (datos) =>
  {
    return datos.map((dato) => ({
      label: dato.nombre_unidad,
      value: dato.id.toString(), // Convertimos el ID a string para mantener consistencia
    }));
  };
  // useEffect(() => {
  //   if (refreshSubpasoDos_tres) {
  //     fetchDataDirecta();
  //     setRefreshSubpasoDos_tres(false);
  //   }
  // }, [
  //   refreshSubpasoDos_tres,
  //   id,
  //   stepNumber,
  //   fetchDataDirecta,
  //   setRefreshSubpasoDos_tres,
  // ]);

  const handleSelectionChange = async (
    etapaId,
    procedimientoId,
    nuevasSelecciones
  ) =>
  {
    // Actualiza el estado local primero
    const nuevasEtapas = etapas.map((etapa) =>
      etapa.id === etapaId
        ? {
          ...etapa,
          procedimientos: etapa.procedimientos.map((proc) =>
            proc.id === procedimientoId
              ? {
                ...proc,
                unidades_intervinientes: nuevasSelecciones.map(
                  (sel) => sel.value
                ),
                unidades_intervinientes_label_value: nuevasSelecciones,
              }
              : proc
          ),
        }
        : etapa
    );

    setEtapas(nuevasEtapas);

    // Luego guarda los cambios de forma persistente
    try
    {
      const resultado = await handleUpdatePaso(id, stepNumber, {
        p_2_3_etapas_ejercicio_competencia: nuevasEtapas,
      });
      if (resultado)
      {
        console.log('Selecciones guardadas correctamente.');//no borrar 
      } else
      {
        throw new Error('Error al guardar selecciones.');
      }
    } catch (error)
    {
      console.error('Error al guardar los datos:', error);
    }
  };

  useEffect(() =>
  {
    const cargarOpcionesSeleccionadas = () =>
    {

      const etapasConSeleccionadas = etapas.map((etapa) =>
      {
        const procedimientosAjustados = etapa.procedimientos.map((proc) =>
        {
          const unidadesSeleccionadas = proc.unidades_intervinientes.map(
            (unidadId) =>
            {
              const opcionEncontrada = opciones.find(
                (opcion) => opcion.value === unidadId.toString()
              );
              return opcionEncontrada || { label: '', value: unidadId };
            }
          );

          return { ...proc, unidades_intervinientes: unidadesSeleccionadas };
        });

        return { ...etapa, procedimientos: procedimientosAjustados };
      });

      setEtapas(etapasConSeleccionadas);
    };

    if (dataDirecta)
    {
      cargarOpcionesSeleccionadas();
    }
  }, [ dataDirecta, etapas, opciones ]);

  useEffect(() =>
  {
    if (listado_unidades)
    {
      const listaInicial = transformarEnOpciones(listado_unidades);
      setOpciones(listaInicial);
    }
  }, [ listado_unidades ]);

  // Lógica para agregar una nueva Etapa
  // Generador de ID único

  const agregarEtapa = async () =>
  {
    const nuevaEtapa = {
      nombre_etapa: '',
      descripcion_etapa: '',
      procedimientos: [],
    };

    // Solo realiza la validación si ya existen etapas
    if (etapas && etapas.length > 0)
    {
      const ultimaEtapa = etapas[ etapas.length - 1 ];
      if (!ultimaEtapa.nombre_etapa || !ultimaEtapa.descripcion_etapa)
      {
        const mensajeError =
          'Debe guardar los campos obligatorios antes de agregar una nueva etapa';
        setMensajesError((prevMensajes) => ({
          ...prevMensajes,
          [ ultimaEtapa.id ]: mensajeError,
        }));
        return;
      }
    }

    // Prepara el payload de actualización. Agrega la nueva etapa a la lista existente
    const datosActualizados = {
      p_2_3_etapas_ejercicio_competencia: [ ...(etapas || []), nuevaEtapa ],
    };

    try
    {
      const resultado = await handleUpdatePaso(
        id,
        stepNumber,
        datosActualizados
      );
      if (resultado)
      {
        refetchTrigger();
        setEtapas((prevEtapas) => [ ...prevEtapas, nuevaEtapa ]);
      } else
      {
        console.error('Error al agregar la etapa');
        setErrorGuardado(
          'No se pudo agregar la nueva etapa. Por favor, intenta de nuevo.'
        );
      }
    } catch (error)
    {
      console.error('Error al agregar la nueva etapa:', error);
      setErrorGuardado(
        'Ha ocurrido un error al intentar agregar la nueva etapa.'
      );
    }
  };

  const agregarProcedimiento = async (etapaId) =>
  {
    // Define un nuevo procedimiento con sus campos vacíos iniciales
    const etapa = etapas.find((etapa) => etapa.id === etapaId);
    setErrorProcedimientos({});

    let procedimientoConErrores = false;
    for (let procedimiento of etapa.procedimientos)
    {
      if (
        !procedimiento.descripcion_procedimiento ||
        procedimiento.unidades_intervinientes.length === 0
      )
      {
        // Establece el error solo para este procedimiento específico
        setErrorProcedimientos((prevErrors) => ({
          ...prevErrors,
          [ procedimiento.id ]:
            'Complete todos los campos del procedimiento antes de agregar uno nuevo.',
        }));
        procedimientoConErrores = true;
        break;
      }
    }

    if (procedimientoConErrores)
    {
      return;
    }
    const nuevoProcedimiento = {
      descripcion_procedimiento: '',
      unidades_intervinientes: [],
    };

    // Actualiza las etapas añadiendo el nuevo procedimiento a la etapa correspondiente
    const nuevaEtapa = etapas.map((etapa) =>
    {
      if (etapa.id === etapaId)
      {
        return {
          ...etapa,
          procedimientos: [ ...etapa.procedimientos, nuevoProcedimiento ],
        };
      }
      return etapa;
    });

    setEtapas(nuevaEtapa); // Actualiza el estado de las etapas

    try
    {
      // Intenta actualizar la información en el servidor/backend
      const resultado = await handleUpdatePaso(id, stepNumber, {
        p_2_3_etapas_ejercicio_competencia: nuevaEtapa,
      });

      if (resultado)
      {
        refetchTrigger(); // Si es exitoso, recarga los datos para asegurar consistencia
      } else
      {
        throw new Error('Fallo al agregar el procedimiento');
      }
    } catch (error)
    {
      console.error('Error al agregar el procedimiento:', error);
      setErrorGuardado(
        'No se pudo agregar el procedimiento. Intente de nuevo.'
      );
    }
  };

  // Lógica para eliminar una fila de un organismo
  const eliminarElemento = async (etapaId, procedimientoId = null) =>
  {
    let payload;

    if (procedimientoId)
    {
      // Preparar payload para eliminar un procedimiento
      payload = {
        p_2_3_etapas_ejercicio_competencia: [
          {
            id: etapaId,
            procedimientos: [
              {
                id: procedimientoId,
                DELETE: true,
              },
            ],
          },
        ],
      };

      // Actualizar el estado local para reflejar la eliminación
      setEtapas((prevEtapas) =>
        prevEtapas.map((etapa) =>
        {
          if (etapa.id === etapaId)
          {
            const procedimientosActualizados = etapa.procedimientos.filter(
              (proc) => proc.id !== procedimientoId
            );
            return { ...etapa, procedimientos: procedimientosActualizados };
          }
          return etapa;
        })
      );
    } else
    {
      // Preparar payload para eliminar una etapa
      payload = {
        p_2_3_etapas_ejercicio_competencia: [
          {
            id: etapaId,
            DELETE: true,
          },
        ],
      };

      // Actualizar el estado local para reflejar la eliminación
      setEtapas((prevEtapas) =>
        prevEtapas.filter((etapa) => etapa.id !== etapaId)
      );
    }

    // Llamar a la API para actualizar los datos
    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setMostrarBotonGuardarEtapa(false);
      setMostrarBotonGuardarProcedimiento(false);
    } catch (error)
    {
      console.error('Error al eliminar:', error);
    }
  };
  const [ campoModificado, setCampoModificado ] = useState({});

  const handleInputChange = (etapaId, procedimientoId, campo, valor) =>
  {
    // Actualiza el estado de las etapas con los nuevos valores
    setEtapas((prevEtapas) =>
      prevEtapas.map((etapa) =>
      {
        if (etapa.id === etapaId)
        {
          if (!procedimientoId)
          {
            // Limpiar el mensaje de error de la etapa al empezar a editar
            setMensajesError((prevErrors) =>
            {
              const newErrors = { ...prevErrors };
              delete newErrors[ etapaId ];
              return newErrors;
            });
            return { ...etapa, [ campo ]: valor };
          } else
          {
            // Limpiar el mensaje de error del procedimiento al empezar a editar
            setErrorProcedimientos((prevErrors) =>
            {
              const newErrors = { ...prevErrors };
              delete newErrors[ procedimientoId ];
              return newErrors;
            });
            return {
              ...etapa,
              procedimientos: etapa.procedimientos.map((procedimiento) =>
              {
                if (procedimiento.id === procedimientoId)
                {
                  return { ...procedimiento, [ campo ]: valor };
                }
                return procedimiento;
              }),
            };
          }
        }
        return etapa;
      })
    );
  };

  const handleSave = async (etapaId, procedimientoId, campo, newValue) =>
  {
    const campoClave = `${etapaId}-${campo}-${procedimientoId || ''}`;

    // Indica que se está guardando el campo especificado
    setCampoModificado((prevEstado) => ({
      ...prevEstado,
      [ campoClave ]: { loading: true, saved: false },
    }));

    // Encuentra la etapa y el procedimiento (si aplica) correspondientes
    const etapaIndex = etapas.findIndex((e) => e.id === etapaId);
    if (etapaIndex === -1)
    {
      console.error('Etapa no encontrada');
      return;
    }

    let payload = {};
    let updatedEtapas = [ ...etapas ];

    if (procedimientoId)
    {
      const procedimientoIndex = etapas[ etapaIndex ].procedimientos.findIndex(
        (p) => p.id === procedimientoId
      );
      if (procedimientoIndex === -1)
      {
        console.error('Procedimiento no encontrado');
        return;
      }

      // Actualiza el estado local
      updatedEtapas[ etapaIndex ].procedimientos[ procedimientoIndex ] = {
        ...updatedEtapas[ etapaIndex ].procedimientos[ procedimientoIndex ],
        [ campo ]: newValue,
      };

      // Prepara el payload para actualizar la API
      payload = {
        p_2_3_etapas_ejercicio_competencia: updatedEtapas,
      };
    } else
    {
      // Si estamos actualizando una etapa
      updatedEtapas[ etapaIndex ] = {
        ...updatedEtapas[ etapaIndex ],
        [ campo ]: newValue,
      };

      // Prepara el payload para actualizar la API
      payload = {
        p_2_3_etapas_ejercicio_competencia: updatedEtapas,
      };
    }

    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setEtapas(updatedEtapas);
      setCampoModificado((prev) => ({
        ...prev,
        [ campoClave ]: { loading: false, saved: true },
      }));
      setEdicionProcedimiento({ etapaId: null, procedimientoId: null });
      refetchTrigger();
    } catch (error)
    {
      console.error('Error al guardar los datos:', error);
      setCampoModificado((prevEstado) => ({
        ...prevEstado,
        [ campoClave ]: { loading: false, saved: false },
      }));
    }
  };


  return (
    <div>
      <h4 className="text-sans-h4">
        2.3 Descripción de etapas y procedimientos del ejercicio de la
        competencia
      </h4>
      <h6 className="text-sans-h6-primary">
        En esta sección se deben describir las etapas que componen el ejercicio
        de la competencia, indicando los procedimientos que se realizan, los
        hitos que la componen, y las unidades que intervienen en su ejecución, y
        sus responsabilidades.
      </h6>
      <h6 className="text-sans-h6-primary mt-3">Este punto es opcional.</h6>
      {etapas.map((etapa, etapaIndex) => (
        <div key={etapa.id || etapaIndex} className="row border my-4">
          <div className="col-1 border-end border-bottom">
            <p className="text-sans-p-bold my-2">Etapa {etapaIndex + 1}</p>
          </div>

          <div className="col">
            <div className="row ">
              <div className="col-2 p-2">
                <p className="text-sans-p-bold mb-0">Nombre de la etapa</p>
                <p className="text-sans-p-grayc">(Obligatorio)</p>
              </div>
              <div className="col p-2">
                <CustomInputArea
                  label=""
                  value={etapa.nombre_etapa || ''}
                  placeholder="Escribe el nombre de la etapa"
                  maxLength={limite_caracteres}
                  onChange={(valor) =>
                    handleInputChange(etapa.id, null, 'nombre_etapa', valor)
                  }
                  onBlur={
                    etapa.id !== ultimaEtapaId
                      ? () =>
                        handleSave(
                          etapa.id,
                          null,
                          true,
                          'nombre_etapa',
                          etapa.nombre_etapa
                        )
                      : null
                  }
                  loading={campoModificado[ `${etapa.id}-nombre_etapa` ]?.loading}
                  saved={campoModificado[ `${etapa.id}-nombre_etapa` ]?.saved}
                  readOnly={solo_lectura}
                />
              </div>
            </div>

            <div className="row ">
              <div className="col-2 p-2">
                <p className="text-sans-p-bold mb-0">Descripción de la etapa</p>
                <p className="text-sans-p-grayc">(Obligatorio)</p>
              </div>
              <div className="col p-2">
                <CustomInputArea
                  label=""
                  value={etapa.descripcion_etapa || ''}
                  placeholder="Describe la etapa"
                  maxLength={limite_caracteres}
                  onChange={(valor) =>
                    handleInputChange(
                      etapa.id,
                      null,
                      'descripcion_etapa',
                      valor
                    )
                  }
                  onBlur={
                    etapa.id !== ultimaEtapaId
                      ? () =>
                        handleSave(
                          etapa.id,
                          null,
                          true,
                          'descripcion_etapa',
                          etapa.descripcion_etapa
                        )
                      : null
                  }
                  readOnly={solo_lectura}
                  loading={
                    campoModificado[ `${etapa.id}-descripcion_etapa` ]?.loading
                  }
                  saved={
                    campoModificado[ `${etapa.id}-descripcion_etapa` ]?.saved
                  }
                />
              </div>
            </div>
          </div>
          <hr />
          {/* Mapeo de los procedimientos de cada etapa */}
          <div className="row">
            <div className="d-flex p-2 py-4">
              <p className="text-sans-p-bold mb-0 me-2">Procedimientos</p>
              <p className="text-sans-p-grayc me-3">(Opcional)</p>
            </div>
          </div>

          <div className="">
            {etapa.procedimientos.map((procedimiento, index) => (
              <div key={procedimiento.id || index} className="p-1">
                {/* Contenido del procedimiento, como descripción y unidades intervinientes */}
                <div className="">
                  <div className="conteo mb-3">{index + 1}</div>
                  <div className="d-flex pb-4">
                    <div className="col-6">
                      <p className="ms-2 mb-1 text-sans-h5">Descripción del procedimiento (Obligatorio)</p>
                      <CustomInputArea
                        //label="Descripción del procedimiento (Obligatorio)"
                        value={procedimiento.descripcion_procedimiento || ''}
                        placeholder="Describe el procedimiento"
                        maxLength={limite_caracteres}
                        onChange={(valor) =>
                          handleInputChange(
                            etapa.id,
                            procedimiento.id,
                            'descripcion_procedimiento',
                            valor
                          )
                        }
                        onBlur={() =>
                          handleSave(
                            etapa.id,
                            procedimiento.id,
                            true,
                            'descripcion_procedimiento',
                            procedimiento.descripcion_procedimiento
                          )
                        }
                        loading={
                          campoModificado[
                            `${procedimiento.id}-descripcion_procedimiento`
                          ]?.loading
                        }
                        saved={
                          campoModificado[
                            `${procedimiento.id}-descripcion_procedimiento`
                          ]?.saved
                        }
                        readOnly={solo_lectura}
                      />
                    </div>
                    <div className="col-4 ms-3">
                      <p className="ms-2 mb-1 text-sans-h5">Unidades Intervinientes (Obligatorio)</p>
                      <Controller
                        control={control}
                        name={`unidades_intervinientes_${procedimiento.id}`}
                        render={({ field }) => (
                          <DropdownCheckbox2
                            id={`unidades_intervinientes_${procedimiento.id}`}
                            name={`unidades_intervinientes_${procedimiento.id}`}
                            //label="Unidades Intervinientes (Obligatorio)"
                            placeholder="Unidades"
                            options={opciones}
                            onSelectionChange={(selectedOptions) =>
                            {
                              handleSelectionChange(
                                etapa.id,
                                procedimiento.id,
                                selectedOptions
                              );
                              field.onChange(
                                selectedOptions.map((option) => option.value)
                              ); // Asegúrate de que actualizas el campo con los valores seleccionados
                            }}
                            selectedValues={
                              procedimiento.unidades_intervinientes_label_value
                            }
                            readOnly={solo_lectura}
                          />
                        )}
                      />
                    </div>
                    <div className="col-1">
                      {!solo_lectura && (
                        <button
                          className="btn-terciario-ghost ms-3"
                          onClick={() =>
                            eliminarElemento(etapa.id, procedimiento.id)
                          }
                        >
                          <i className="material-symbols-rounded me-2">
                            delete
                          </i>
                          <p className="mb-0 text-decoration-underline">
                            Borrar
                          </p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {!solo_lectura && (
                  <hr className="my-0" />
                )}
                {errorProcedimientos[ procedimiento.id ] && (
                  <div className="text-danger">
                    {errorProcedimientos[ procedimiento.id ]}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!solo_lectura && (
            <div className="row">
              <div className="p-2">
                {mostrarBotonGuardarProcedimiento ? (
                  <button
                    className="btn-primario-s m-2"
                    onClick={() =>
                    {
                      setErrorProcedimientos('');
                      handleSave(etapa.id, agregarProcedimiento(), true);
                    }}
                  >
                    <i className="material-symbols-rounded me-2">save</i>
                    <p className="mb-0 text-decoration-underline">
                      Guardar Procedimiento
                    </p>
                  </button>
                ) : (
                  <button
                    className="btn-secundario-s"
                    onClick={() => agregarProcedimiento(etapa.id)}
                  >
                    <i className="material-symbols-rounded me-2">add</i>
                    <p className="mb-0 text-decoration-underline">
                      Agregar Procedimiento
                    </p>
                  </button>
                )}
              </div>
              <hr className="my-0" />
            </div>
          )}
          {errorGuardado && <div></div>}
          {!solo_lectura && (
            <div className="d-flex justify-content-end p-3">
              <button
                className="btn-terciario-ghost"
                onClick={() => eliminarElemento(etapa.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar Etapa</p>
              </button>
            </div>
          )}
          {mensajesError[ etapa.id ] && (
            <div className="text-danger">{mensajesError[ etapa.id ]}</div>
          )}
        </div>
      ))}
      {!solo_lectura && (
        <div className="row">
          <div className="p-2">
            {mostrarBotonGuardarEtapa ? (
              <button
                className="btn-secundario-s m-2"
                onClick={() => handleSave(etapaEnEdicionId, null, false)}
              >
                <i className="material-symbols-rounded me-2">save</i>
                <p className="mb-0 text-decoration-underline">Guardar Etapa</p>
              </button>
            ) : (
              <button className="btn-secundario-s" onClick={agregarEtapa}>
                <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">Agregar Etapa</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
