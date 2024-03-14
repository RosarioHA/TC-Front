import { useState, useEffect, useContext, useCallback } from 'react';
import CustomInputArea from '../../forms/textarea_paso2';
// import DropdownCheckbox from '../../dropdown/checkbox';
import { FormularioContext } from '../../../context/FormSectorial';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';
// import { useForm, Controller } from 'react-hook-form';

export const Subpaso_dosPuntoTres = ({
  id,
  data,
  stepNumber,
  listado_unidades,
  refreshSubpasoDos_tres,
  setRefreshSubpasoDos_tres,
  setRefreshSubpasoDos_cuatro,
  solo_lectura,
}) => {
  // const { control } = useForm({
  //   mode: 'onBlur',
  // });

  const [dataDirecta, setDataDirecta] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const { handleUpdatePaso, refetchTrigger } = useContext(FormularioContext);
  const [etapas, setEtapas] = useState(data);
  const [ultimaEtapaId, setUltimaEtapaId] = useState(null);
  const [mostrarBotonGuardarEtapa, setMostrarBotonGuardarEtapa] =
    useState(false);
  const [etapaEnEdicionId, setEtapaEnEdicionId] = useState(null);

  const [errorGuardado, setErrorGuardado] = useState('');
  const [mensajesError, setMensajesError] = useState({});
  const [erroresProcedimientos, setErroresProcedimientos] = useState({});
  const [cargandoEtapas, setCargandoEtapas] = useState(false);
  const [edicionProcedimiento, setEdicionProcedimiento] = useState({
    etapaId: null,
    procedimientoId: null,
  });

  // Llamada para recargar componente, en este caso a listado unidades
  const fetchDataDirecta = useCallback(async () => {
    setCargandoEtapas(true); // Inicia la carga
    try {
      const response = await apiTransferenciaCompentencia.get(
        `/formulario-sectorial/${id}/paso-${stepNumber}/`
      );
      setDataDirecta(response.data);
      setCargandoEtapas(false); // Finaliza la carga
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
      setCargandoEtapas(false); // Asegura finalizar la carga incluso si hay un error
    }
  }, [id, stepNumber]);

  useEffect(() => {
    if (refreshSubpasoDos_tres) {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [refreshSubpasoDos_tres, fetchDataDirecta, setRefreshSubpasoDos_tres]);

  useEffect(() => {
    // Asumiendo que 'data' es la prop que recibe las etapas desde el padre
    if (data) {
      // Actualiza el estado 'etapas' con la nueva data
      setEtapas(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.p_2_3_etapas_ejercicio_competencia) {
      setEtapas(data.p_2_3_etapas_ejercicio_competencia);
    }
  }, [data]);

  //convertir estructura para el select
  const transformarEnOpciones = (datos) => {
    return datos.map((dato) => ({
      label: dato.nombre_unidad,
      value: dato.id.toString(), // Convertimos el ID a string para mantener consistencia
    }));
  };

  useEffect(() => {
    if (refreshSubpasoDos_tres) {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [
    refreshSubpasoDos_tres,
    id,
    stepNumber,
    fetchDataDirecta,
    setRefreshSubpasoDos_tres,
  ]);

  useEffect(() => {
    const cargarOpcionesSeleccionadas = () => {
      // Suponiendo que `dataDirecta` incluya información sobre las opciones seleccionadas para unidades intervinientes
      const etapasConSeleccionadas = etapas.map((etapa) => {
        const procedimientosAjustados = etapa.procedimientos.map((proc) => {
          // Encuentra las opciones seleccionadas basadas en algún criterio, como IDs guardados
          const unidadesSeleccionadas = proc.unidades_intervinientes.map(
            (unidadId) => {
              // Encuentra el label correspondiente al ID en las opciones disponibles
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

    if (dataDirecta) {
      cargarOpcionesSeleccionadas();
    }
  }, [dataDirecta, etapas, opciones]);

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_unidades) {
      const listaInicial = transformarEnOpciones(listado_unidades);
      setOpciones(listaInicial);
    }
  }, [listado_unidades]);

  // Lógica para agregar una nueva Etapa
  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const agregarEtapa = async () => {
    // Define la nueva etapa sin ID inicialmente
    const nuevaEtapa = {
      nombre_etapa: '',
      descripcion_etapa: '',
      procedimientos: [],
    };
  
    // Solo realiza la validación si ya existen etapas
    if (etapas && etapas.length > 0) {
      const ultimaEtapa = etapas[etapas.length - 1];
  
      // Verificar si la última etapa agregada tiene los campos obligatorios llenos
      if (!ultimaEtapa.nombre_etapa || !ultimaEtapa.descripcion_etapa) {
        const mensajeError = 'Debe guardar los campos obligatorios antes de agregar una nueva etapa';
        setMensajesError((prevMensajes) => ({
          ...prevMensajes,
          [ultimaEtapa.id]: mensajeError,
        }));
        return;
      }
    }
  
    // Prepara el payload de actualización. Agrega la nueva etapa a la lista existente
    const datosActualizados = {
      p_2_3_etapas_ejercicio_competencia: [...(etapas || []), nuevaEtapa],
    };
  
    try {
      const resultado = await handleUpdatePaso(id, stepNumber, datosActualizados);
      if (resultado) {
        console.log('Etapa agregada con éxito');
        refetchTrigger(); // Actualiza los datos para reflejar los cambios
        setEtapas((prevEtapas) => [...prevEtapas, nuevaEtapa]); // Actualiza el estado para incluir la nueva etapa
      } else {
        console.error('Error al agregar la etapa');
        setErrorGuardado('No se pudo agregar la nueva etapa. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al agregar la nueva etapa:', error);
      setErrorGuardado('Ha ocurrido un error al intentar agregar la nueva etapa.');
    }
  };
  

  // const [
  //   mostrarBotonGuardarProcedimiento,
  //   setMostrarBotonGuardarProcedimiento,
  // ] = useState(false);

  // const agregarProcedimiento = (etapaId) => {
  //   const etapaIndex = etapas.findIndex((etapa) => etapa.id === etapaId);
  //   if (etapaIndex === -1) return; // Verifica que la etapa exista

  //   const etapaActual = etapas[etapaIndex];

  //   // Verifica si el último procedimiento de la etapa está completo antes de permitir agregar uno nuevo
  //   if (etapaActual.procedimientos.length > 0) {
  //     const ultimoProcedimiento =
  //       etapaActual.procedimientos[etapaActual.procedimientos.length - 1];
  //     if (
  //       !ultimoProcedimiento.descripcion_procedimiento ||
  //       ultimoProcedimiento.unidades_intervinientes.length === 0
  //     ) {
  //       setErroresProcedimientos((prev) => ({
  //         ...prev,
  //         [etapaId]:
  //           'Debe completar todos los campos del último procedimiento antes de agregar uno nuevo.',
  //       }));
  //       return;
  //     }
  //   }

  //   // Si el último procedimiento está completo o no hay procedimientos, procede a agregar uno nuevo
  //   const nuevoProcedimiento = {
  //     id: generarIdUnico(),
  //     descripcion_procedimiento: '',
  //     unidades_intervinientes: [],
  //     editando: true,
  //   };
  //   etapas[etapaIndex].procedimientos.push(nuevoProcedimiento);
  //   setEtapas([...etapas]);
  //   setErroresProcedimientos((prev) => ({ ...prev, [etapaId]: undefined })); // Limpia errores al agregar exitosamente
  // };

  // Lógica para eliminar una fila de un organismo
  const eliminarElemento = async (etapaId, procedimientoId = null) => {
    let payload;

    if (procedimientoId) {
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
        prevEtapas.map((etapa) => {
          if (etapa.id === etapaId) {
            const procedimientosActualizados = etapa.procedimientos.filter(
              (proc) => proc.id !== procedimientoId
            );
            return { ...etapa, procedimientos: procedimientosActualizados };
          }
          return etapa;
        })
      );
    } else {
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
    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setMostrarBotonGuardarEtapa(false);
      // setMostrarBotonGuardarProcedimiento(false);
      setRefreshSubpasoDos_cuatro(true);
      setErroresProcedimientos((prev) => ({ ...prev, [etapaId]: undefined }));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };
  const [campoModificado, setCampoModificado] = useState({});

  const handleInputChange = (etapaId, procedimientoId, campo, valor) => {
    setEtapas((prevEtapas) =>
      prevEtapas.map((etapa) => {
        if (etapa.id === etapaId) {
          // Si es un cambio en los campos de la etapa
          if (!procedimientoId) {
            // Elimina el mensaje de error para la etapa si el usuario empieza a editar los campos obligatorios
            if (campo === 'nombre_etapa' || campo === 'descripcion_etapa') {
              setMensajesError((prevMensajes) => {
                const nuevosMensajes = { ...prevMensajes };
                delete nuevosMensajes[etapaId]; // Elimina el mensaje de error específico para esta etapa
                return nuevosMensajes;
              });
            }

            return { ...etapa, [campo]: valor };
          }
        // Si es un cambio en los campos de un procedimiento específico
        return {
          ...etapa,
          procedimientos: etapa.procedimientos.map(procedimiento => {
            if (procedimiento.id === procedimientoId) {
              return { ...procedimiento, [campo]: valor };
            }
            return procedimiento;
          }),
        };
      }
      return etapa;
    }));
  };

  const handleSave = async (
    etapaId,
    procedimientoId,
    esGuardadoPorBlur,
    campo,
    newValue
  ) => {
    const campoClave = `${etapaId}-${campo}`;

    setCampoModificado((prevEstado) => ({
      ...prevEstado,
      [campoClave]: { loading: true, saved: false },
    }));

    const etapa = etapas.find((e) => e.id === etapaId);
    if (!etapa) {
      console.error('Etapa no encontrada');
      return;
    }

    let payload = {};

    if (procedimientoId) {
      const procedimiento = etapa.procedimientos.find(
        (p) => p.id === procedimientoId
      );
      if (!procedimiento) {
        console.error('Procedimiento no encontrado');
        return;
      }
      // Construye el payload basado en el campo que se está actualizando
      if (campo === 'descripcion_procedimiento') {
        payload = {
          p_2_3_etapas_ejercicio_competencia: [
            {
              id: etapaId,
              procedimientos: [
                {
                  id: procedimientoId,
                  [campo]: newValue,
                },
              ],
            },
          ],
        };
      } else if (campo === 'unidades_intervinientes') {
        payload = {
          p_2_3_etapas_ejercicio_competencia: [
            {
              id: etapaId,
              procedimientos: [
                {
                  id: procedimientoId,
                  unidades_intervinientes: newValue,
                },
              ],
            },
          ],
        };
      } else {
        console.error('Campo no reconocido o tipo de newValue incorrecto');
        return;
      }
    } else {
      // Preparar payload para guardar una etapa
      payload = {
        p_2_3_etapas_ejercicio_competencia: [
          {
            id: etapaId,
            [campo]: newValue,
          },
        ],
      };
    }

    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setCampoModificado((prev) => ({
        ...prev,
        [campoClave]: { loading: false, saved: true },
      }));
      setEdicionProcedimiento({ etapaId: null, procedimientoId: null });
      refetchTrigger();
      setRefreshSubpasoDos_cuatro(true);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setCampoModificado((prevEstado) => ({
        ...prevEstado,
        [campoClave]: { loading: false, saved: false },
      }));
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
                    loading={
                      campoModificado[`${etapa.id}-nombre_etapa`]?.loading
                    }
                    saved={campoModificado[`${etapa.id}-nombre_etapa`]?.saved}
                    readOnly={solo_lectura}
                  />
                </div>
              </div>

              <div className="row ">
                <div className="col-2 p-2">
                  <p className="text-sans-p-bold mb-0">
                    Descripción de la etapa
                  </p>
                  <p className="text-sans-p-grayc">(Obligatorio)</p>
                </div>
                <div className="col p-2">
                  <CustomInputArea
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
                      campoModificado[`${etapa.id}-descripcion_etapa`]?.loading
                    }
                    saved={
                      campoModificado[`${etapa.id}-descripcion_etapa`]?.saved
                    }
                  />
                </div>
              </div>
            </div>
            <hr />
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
            {mensajesError[etapa.id] && (
              <div className="text-danger">{mensajesError[etapa.id]}</div>
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
