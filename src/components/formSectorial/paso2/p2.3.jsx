import { useState, useEffect, useContext } from 'react';
import CustomInput from '../../forms/custom_input';
import DropdownCheckbox from '../../dropdown/checkbox';
import { FormularioContext } from '../../../context/FormSectorial';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';
import { useForm, Controller } from 'react-hook-form';

export const Subpaso_dosPuntoTres = ({
  id,
  data,
  stepNumber,
  listado_unidades,
  refreshSubpasoDos_tres,
  setRefreshSubpasoDos_tres,
  setRefreshSubpasoDos_cuatro,
  solo_lectura,
}) =>
{
  const {
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ opciones, setOpciones ] = useState([]);
  const [ nuevaUnidadId, setNuevaUnidadId ] = useState('');
  const { handleUpdatePaso, refetchTrigger } = useContext(FormularioContext);
  const [ etapas, setEtapas ] = useState(data);
  const [ ultimaEtapaId, setUltimaEtapaId ] = useState(null);
  const [ mostrarBotonGuardarEtapa, setMostrarBotonGuardarEtapa ] =
    useState(false);
  const [ etapaEnEdicionId, setEtapaEnEdicionId ] = useState(null);
  const [ procedimientoEnEdicionId, setProcedimientoEnEdicionId ] =
    useState(null);

  const [ errorGuardado, setErrorGuardado ] = useState('');
  const [ mensajesError, setMensajesError ] = useState({});
  const [ cargandoEtapas, setCargandoEtapas ] = useState(false);


  // Llamada para recargar componente, en este caso a listado unidades
  const fetchDataDirecta = async () =>
  {
    setCargandoEtapas(true); // Inicia la carga
    try
    {
      const response = await apiTransferenciaCompentencia.get(
        `/formulario-sectorial/${id}/paso-${stepNumber}/`
      );
      setDataDirecta(response.data);
      setCargandoEtapas(false); // Finaliza la carga
    } catch (error)
    {
      console.error('Error al obtener datos directamente:', error);
      setCargandoEtapas(false); // Asegura finalizar la carga incluso si hay un error
    }
  };

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

  console.log('data', data);

  //convertir estructura para el select
  const transformarEnOpciones = (datos) =>
  {
    return datos.map((dato) => ({
      label: dato.nombre_unidad,
      value: dato.id.toString(), // Convertimos el ID a string para mantener consistencia
    }));
  };

  useEffect(() =>
  {
    if (refreshSubpasoDos_tres)
    {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [ refreshSubpasoDos_tres, id, stepNumber ]);

  // Efecto para manejar la actualización de opciones basado en dataDirecta
  useEffect(() =>
  {
    if (dataDirecta?.listado_unidades)
    {
      const nuevasOpciones = transformarEnOpciones(
        dataDirecta.listado_unidades
      );
      setOpciones(nuevasOpciones);
    }
  }, [ dataDirecta ]);

  // Efecto para manejar la carga inicial de opciones
  useEffect(() =>
  {
    if (listado_unidades)
    {
      const listaInicial = transformarEnOpciones(listado_unidades);
      setOpciones(listaInicial);
    }
  }, [ listado_unidades ]);

  const manejarCambioDropdown = (opcionSeleccionada) =>
  {
    // Asumiendo que opcionSeleccionada es un objeto con las propiedades 'label' y 'value'
    const idSeleccionado = opcionSeleccionada.value; // El ID es el 'value'
    setNuevaUnidadId(idSeleccionado);
  };

  // Lógica para agregar una nueva Etapa
  // Generador de ID único
  const generarIdUnico = () =>
  {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const agregarEtapa = async () =>
  {
    const ultimaEtapa = etapas[ etapas.length - 1 ];

    // Verificar si existen campos obligatorios vacíos en la última etapa agregada
    if (!ultimaEtapa || !ultimaEtapa.nombre_etapa || !ultimaEtapa.descripcion_etapa)
    {
      const mensajeError = 'Debe guardar los campos obligatorios antes de agregar una nueva etapa';
      setMensajesError(prevMensajes => ({
        ...prevMensajes,
        [ ultimaEtapa.id ]: mensajeError
      }));
      return;
    }

    const nuevaEtapa = {
      nombre_etapa: '',
      descripcion_etapa: '',
      procedimientos: [],
    };

    const datosActualizados = {
      p_2_3_etapas_ejercicio_competencia: [ ...(data.p_2_3_etapas_ejercicio_competencia || []), nuevaEtapa ],
    };

    try
    {
      const resultado = await handleUpdatePaso(id, stepNumber, datosActualizados);
      if (resultado)
      {
        console.log('Etapa agregada con éxito');
        refetchTrigger();
        setEtapas(prevEtapas => [ ...prevEtapas, nuevaEtapa ]);
      } else
      {
        console.error('Error al agregar la etapa');
        setErrorGuardado('No se pudo agregar la nueva etapa. Por favor, intenta de nuevo.');
      }
    } catch (error)
    {
      console.error('Error al agregar la nueva etapa:', error);
      setErrorGuardado('Ha ocurrido un error al intentar agregar la nueva etapa.');
    }
  };


  const [ ultimoProcedimientoId, setUltimoProcedimientoId ] = useState(null);
  const [
    mostrarBotonGuardarProcedimiento,
    setMostrarBotonGuardarProcedimiento,
  ] = useState(false);

  const agregarProcedimiento = (etapaId) => {
    const etapaIndex = etapas.findIndex(etapa => etapa.id === etapaId);
    if (etapaIndex === -1) return; // No se encontró la etapa
  
    const nuevaEtapa = [...etapas];
    const nuevoProcedimientoId = generarIdUnico();
  
    // Crea un procedimiento con campos obligatorios vacíos para iniciar
    const nuevoProcedimiento = {
      id: nuevoProcedimientoId,
      descripcion_procedimiento: '',
      unidades_intervinientes: [],
      editando: true, // Puedes usar este campo para controlar la edición
    };
  
    // Agrega el nuevo procedimiento a la etapa correspondiente
    nuevaEtapa[etapaIndex].procedimientos.push(nuevoProcedimiento);
  
    // Actualiza el estado de las etapas
    setEtapas(nuevaEtapa);
    setMostrarBotonGuardarProcedimiento(true);
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
      setRefreshSubpasoDos_cuatro(true);
    } catch (error)
    {
      console.error('Error al eliminar:', error);
    }
  };
  const [ campoModificado, setCampoModificado ] = useState({});

  const handleInputChange = (etapaId, procedimientoId, campo, valor) =>
  {
    setEtapas((prevEtapas) =>
      prevEtapas.map((etapa) =>
      {
        if (etapa.id === etapaId)
        {
          if (procedimientoId)
          {
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
          } else
          {
            return { ...etapa, [ campo ]: valor };
          }
        }
        return etapa;
      })
    );
    if (campo === 'nombre_etapa' || campo === 'descripcion_etapa')
    {
      setMensajesError((prevMensajes) =>
      {
        const nuevosMensajes = { ...prevMensajes };
        delete nuevosMensajes[ etapaId ];
        return nuevosMensajes;
      });
    }
  };

  const handleSave = async (
    etapaId,
    procedimientoId,
    esGuardadoPorBlur,
    campo,
    newValue
  ) =>
  {

    const campoClave = `${etapaId}-${campo}`;

    setCampoModificado((prevEstado) => ({
      ...prevEstado,
      [ campoClave ]: { loading: true, saved: false },
    }));

    const etapa = etapas.find((e) => e.id === etapaId);
    let payload;

    if (procedimientoId)
    {
      // Preparar payload para guardar un procedimiento
      const procedimiento = etapa.procedimientos.find(
        (p) => p.id === procedimientoId
      );
      payload = {
        p_2_3_etapas_ejercicio_competencia: [
          {
            id: etapaId,
            procedimientos: [
              {
                id: procedimientoId,
                descripcion_procedimiento:
                  procedimiento.descripcion_procedimiento,
                unidades_intervinientes: [
                  {
                    id: procedimientoId,
                    unidades_intervinientes: newValue.map(
                      (option) => option.value
                    ),
                  },
                ],
              },
            ],
          },
        ],
      };
    } else
    {
      // Preparar payload para guardar una etapa
      payload = {
        p_2_3_etapas_ejercicio_competencia: [
          {
            id: etapaId,
            nombre_etapa: etapa.nombre_etapa,
            descripcion_etapa: etapa.descripcion_etapa,
          },
        ],
      };
    }
    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setCampoModificado((prev) => ({
        ...prev,
        [ campoClave ]: { loading: false, saved: true },
      }));
      setRefreshSubpasoDos_cuatro(true);
    } catch (error)
    {
      console.error('Error al guardar los datos:', error);
      if (!esGuardadoPorBlur)
      {
        setCampoModificado((prevEstado) => ({
          ...prevEstado,
          [ campoClave ]: { loading: false, saved: false },
        }));
      }
    }
  };

  console.log('campo', campoModificado);

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
      {cargandoEtapas ? (
        <div>Cargando etapas...</div>
      ) : (
        etapas.map((etapa, etapaIndex) => (
          <div key={etapa?.id} className="row border my-4">
            {console.log('etaparen', etapa)}
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
                  <CustomInput
                    label=""
                    value={etapa.nombre_etapa || ''}
                    placeholder="Escribe el nombre de la etapa"
                    maxLength={500}
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
                  <CustomInput
                    label=""
                    value={etapa.descripcion_etapa || ''}
                    placeholder="Describe la etapa"
                    maxLength={500}
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
                <hr />
              </div>

              {/* Mapeo de los procedimientos de cada etapa */}
              <div className="row">
                <div className="d-flex p-2 py-4">
                  <p className="text-sans-p-bold mb-0 me-2">Procedimientos</p>
                  <p className="text-sans-p-grayc me-3">(Opcional)</p>
                </div>
              </div>

              <div className="">
                {etapa.procedimientos.map((procedimiento, procedimientoIndex) => (
                  <div key={procedimiento.id} className="p-1">
                    {/* Contenido del procedimiento, como descripción y unidades intervinientes */}
                    <div className="">
                      <div className="conteo mb-3">{procedimientoIndex + 1}</div>
                      <div className="d-flex pb-4">
                        <div className="col-6">
                          <CustomInput
                            label="Descripción del procedimiento (Obligatorio)"
                            value={procedimiento.descripcion_procedimiento || ''}
                            placeholder="Describe el procedimiento"
                            maxLength={500}
                            onChange={(valor) =>
                              handleInputChange(
                                etapa.id,
                                procedimiento.id,
                                'descripcion_procedimiento',
                                valor
                              )
                            }
                            onBlur={
                              etapa.id !== ultimoProcedimientoId
                                ? () =>
                                  handleSave(etapa.id, procedimiento.id, true)
                                : null
                            }
                            readOnly={solo_lectura}
                          />
                        </div>
                        <div className="col-4">
                          <Controller
                            control={control}
                            name={`unidades_intervinientes_${procedimiento.id}`}
                            render={({ field }) =>
                            {
                              return (
                                <DropdownCheckbox
                                  id={`unidades_intervinientes_${procedimiento.id}`}
                                  name={`unidades_intervinientes_${procedimiento.id}`}
                                  label="Unidades Intervinientes (Obligatorio)"
                                  placeholder="Unidades"
                                  options={opciones}
                                  onSelectionChange={(selectedOptions) =>
                                  {
                                    handleSave(
                                      etapa.id,
                                      procedimiento.id,
                                      'unidades_intervinientes',
                                      selectedOptions
                                    );
                                    field.onChange(selectedOptions);
                                  }}
                                  loading=""
                                  saved=""
                                  readOnly={solo_lectura}
                                  selectedValues={
                                    procedimiento.unidades_intervinientes_label_value
                                  }
                                />
                              );
                            }}
                          />
                        </div>
                        <div className="col-1">
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
                        </div>
                      </div>
                    </div>

                    <hr className="my-0" />
                  </div>
                ))}
                {!solo_lectura && (
                  <div className="row">
                    <div className="p-2">
                      {mostrarBotonGuardarProcedimiento ? (
                        <button
                          className="btn-primario-s m-2"
                          onClick={() =>
                            handleSave(etapa.id, procedimientoEnEdicionId, true)
                          }
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
              </div>
            </div>

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
        ))
      )}
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
