import { useState, useEffect, useContext } from "react";
import CustomInputArea from "../../forms/textarea_paso2";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";

export const Subpaso_dosPuntoDos = ({
  id,
  data,
  stepNumber,
  refreshSubpasoDos_dos,
  setRefreshSubpasoDos_dos,
  setRefreshSubpasoDos_tres
}) =>
{

  const { handleUpdatePaso } = useContext(FormularioContext);
  const [ agrupados, setAgrupados ] = useState({});
  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ fieldStatus, setFieldStatus ] = useState({ 
    nombre_unidad: { loading: false, saved: false },
    descripcion_unidad: { loading: false, saved: false },});


  const fetchDataDirectly = async () =>
  {
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error)
    {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  // Definición de la función 'agrupadosPorOrganismo'
  const agrupadosPorOrganismo = (datos) =>
  {
    if (!Array.isArray(datos))
    {
      return {}; // Retorna un objeto vacío si 'datos' no es un array
    }
    return datos.reduce((acc, unidad) =>
    {
      const { organismo_display, nombre_ministerio_servicio } = unidad.organismo;
      if (!acc[ organismo_display ])
      {
        acc[ organismo_display ] = {};
      }
      if (!acc[ organismo_display ][ nombre_ministerio_servicio ])
      {
        acc[ organismo_display ][ nombre_ministerio_servicio ] = [];
      }
      acc[ organismo_display ][ nombre_ministerio_servicio ].push(unidad);
      return acc;
    }, {});
  };

  useEffect(() =>
  {
    if (refreshSubpasoDos_dos)
    {

      fetchDataDirectly();

      const nuevosAgrupados = agrupadosPorOrganismo();
      setAgrupados(nuevosAgrupados); // Actualiza el estado con los nuevos agrupados

      setRefreshSubpasoDos_dos(false); // Reestablece el estado de refresco
    }
  }, [ refreshSubpasoDos_dos, setRefreshSubpasoDos_dos, id, stepNumber ]);

  useEffect(() =>
  {
    // Carga inicial con 'data'
    if (data)
    {
      const inicialesAgrupados = agrupadosPorOrganismo(data);
      setAgrupados(inicialesAgrupados);
    }
  }, [ data ]);

  useEffect(() =>
  {
    // Carga con 'dataDirecta' tras editar paso 2.1
    if (dataDirecta)
    {

      const { p_2_2_unidades_intervinientes } = dataDirecta;

      if (p_2_2_unidades_intervinientes)
      {
        const nuevosAgrupados = agrupadosPorOrganismo(p_2_2_unidades_intervinientes);

        setAgrupados(nuevosAgrupados);
      }
    }
  }, [ dataDirecta ]);


  // Lógica para agregar una nueva fila a un organismo
  // Generador de ID único
  const generarIdUnico = () =>
  {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000); // Ejemplo simple
  };

  // Función para obtener el ministerioId desde dataDirecta o data
  const obtenerMinisterioIdDesdeDataDirecta = (nombreMinisterio) =>
  {
    if (dataDirecta)
    {
      const { p_2_2_unidades_intervinientes } = dataDirecta;
      const unidadDirecta = p_2_2_unidades_intervinientes.find(item => item.organismo.nombre_ministerio_servicio === nombreMinisterio);
      if (unidadDirecta && unidadDirecta.organismo && unidadDirecta.organismo.id)
      {
        return unidadDirecta.organismo.id;
      }
    }

    if (data)
    {
      const unidad = data.find(item => item.organismo.nombre_ministerio_servicio === nombreMinisterio);
      if (unidad && unidad.organismo && unidad.organismo.id)
      {
        return unidad.organismo.id;
      }
    }

    // Si no se encuentra el ministerio en dataDirecta ni en data, puedes devolver un valor por defecto o manejarlo según tu lógica.
    return null; // Cambia esto según tu necesidad.
  };

  const [ ultimaFilaId, setUltimaFilaId ] = useState(null);
  const [ mostrarBotonGuardar, setMostrarBotonGuardar ] = useState(false);

  const agregarFila = (organismoDisplay, nombreMinisterio) =>
  {

    const nuevaFilaId = generarIdUnico();
    setMostrarBotonGuardar(true);
    setUltimaFilaId(nuevaFilaId);

    setAgrupados(prevAgrupados =>
    {
      // Crear una copia profunda del estado previo
      const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));

      // Crear una nueva fila
      const nuevaFila = {
        id: nuevaFilaId,
        organismo_id: obtenerMinisterioIdDesdeDataDirecta(nombreMinisterio),
        nombre_unidad: '',
        descripcion_unidad: ''
      };

      console.log('Nueva fila:', nuevaFila)

      // Asegurarse de que existan el organismo y el ministerio
      if (!nuevoEstado[ organismoDisplay ])
      {
        nuevoEstado[ organismoDisplay ] = {};
      }
      if (!nuevoEstado[ organismoDisplay ][ nombreMinisterio ])
      {
        nuevoEstado[ organismoDisplay ][ nombreMinisterio ] = [];
      }

      // Agregar la nueva fila
      nuevoEstado[ organismoDisplay ][ nombreMinisterio ].push(nuevaFila);

      return nuevoEstado;
    });
  };


  // Lógica para eliminar una fila de un organismo
  const eliminarFila = async (organismoDisplay, nombreMinisterio, idFila) =>
  {
    const payload = {
      'p_2_2_unidades_intervinientes': [ {
        id: idFila,
        DELETE: true
      } ]
    };

    try
    {
      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualizar el estado para reflejar la eliminación
      setAgrupados(prevAgrupados =>
      {
        // Crear una copia profunda del estado previo
        const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));

        // Filtrar para eliminar la fila específica
        nuevoEstado[ organismoDisplay ][ nombreMinisterio ] = nuevoEstado[ organismoDisplay ][ nombreMinisterio ].filter(fila => fila.id !== idFila);

        return nuevoEstado;
      });

      setRefreshSubpasoDos_tres(true);
      setMostrarBotonGuardar(false);

    } catch (error)
    {
      console.error("Error al eliminar la fila:", error);
    }
  };

  const [ filaEnEdicionId, setFilaEnEdicionId ] = useState(null);

  // Lógica para editar unidades existentes
  const handleInputChange = (organismoDisplay, nombreMinisterio, idFila, campo, valor) =>
  {
    setFilaEnEdicionId(id);

    setAgrupados(prevAgrupados =>
    {
      // Verificar que existen el organismo y el ministerio
      if (prevAgrupados[ organismoDisplay ] && prevAgrupados[ organismoDisplay ][ nombreMinisterio ])
      {
        const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));
        const filaEditada = nuevoEstado[ organismoDisplay ][ nombreMinisterio ].find(fila => fila.id === idFila);
        if (filaEditada)
        {
          filaEditada[ campo ] = valor;
        }
        return nuevoEstado;
      }
      return prevAgrupados;
    });
  };


  // Lógica para guardar unidades existentes y nuevas
  const handleSave = async (organismoDisplay, nombreMinisterio, idFila, esGuardadoPorBlur) =>
  {

    if (!esGuardadoPorBlur)
    {
      setMostrarBotonGuardar(false);
    }

    if (!agrupados[ organismoDisplay ] || !agrupados[ organismoDisplay ][ nombreMinisterio ])

    {
      console.error("No se encontró el organismo o el ministerio especificado.");
      return;
    }

    const filaEditada = agrupados[ organismoDisplay ][ nombreMinisterio ].find(fila => fila.id === idFila);
    if (!filaEditada)
    {
      console.error("Fila no encontrada para ID:", idFila);
      return;
    }

    // Verificar que nombre_unidad y descripcion_unidad existen
    if (!filaEditada.nombre_unidad || !filaEditada.descripcion_unidad)
    {
      console.error("nombre_unidad y descripcion_unidad deben estar definidos.");
      return;
    }
    setFieldStatus(prevStatus => ({
      ...prevStatus,
      [`${idFila}_nombre_unidad`]: { loading: true, saved: false },
    }));
 
    

    try
    {
      const payload = {
        'p_2_2_unidades_intervinientes': [ {
          id: filaEditada.id,
          nombre_unidad: filaEditada.nombre_unidad,
          descripcion_unidad: filaEditada.descripcion_unidad,
          organismo_id: obtenerMinisterioIdDesdeDataDirecta(nombreMinisterio),
        } ]
      };

      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);

      setRefreshSubpasoDos_tres(true);
      setMostrarBotonGuardar(false);
      setFieldStatus(prevStatus => ({
        ...prevStatus,
        [`${idFila}_nombre_unidad`]: { loading: false, saved: true },
        [`${idFila}_descripcion_unidad`]: { loading: false, saved: true }
      }));

    } catch (error)
    {
      console.error("Error al guardar los datos:", error);
      setFieldStatus(prevStatus => ({
        ...prevStatus,
        [`${idFila}_nombre_unidad`]: { loading: false, saved: false },
        [`${idFila}_descripcion_unidad`]: { loading: false, saved: false }
      }));
    }
  };

  console.log('status', fieldStatus)


  return (
    <div>
      <h4 className="text-sans-h4">2.2 Unidades intervinientes en el Ministerio o Servicio</h4>
      <h6 className="text-sans-h6-primary">Se entenderá por Unidad Interviniente a aquellos actores al interior de la orgánica sectorial que intervienen en el ejercicio de la competencia analizada.</h6>
      <h6 className="text-sans-h6-primary mt-3">  Asegúrate de identificar correctamente las unidades de cada organismo que participan en el ejercicio de la competencia, ya que esta información será utilizada más adelante en tu formulario.</h6>

      <div className="my-4">
        {Object.entries(agrupados).map(([ organismoDisplay, ministerios ]) => (
          <div key={organismoDisplay} className="tabla-organismo">
            <div className="row border">
              <div className="col-2 border">
                <p>{organismoDisplay}</p>
              </div>

              <div className="col-10 border">
                {Object.entries(ministerios).map(([ ministerio, unidades ]) => (
                  <div key={ministerio} className="tabla-organismo">
                    <div className="row border">
                      <div className="col p-3">
                        <p>{ministerio}</p>
                      </div>

                      <div className="col-10 border p-2">
                        {unidades.map((unidad, unidadIndex) => (
                          <div key={unidad.id} className="border row">
                            <div className="col-10 p-3">
                              <div className="conteo">{unidadIndex + 1}</div>
                              <CustomInputArea
                                label="Nombre (Obligatorio)"
                                value={unidad.nombre_unidad || ''}
                                placeholder="Nombre ministerio o servicio"
                                maxLength={300}
                                onChange={(valor) => handleInputChange(organismoDisplay, ministerio, unidad.id, 'nombre_unidad', valor)}
                                onBlur={() => handleSave(organismoDisplay, ministerio, unidad.id, true)}
                                loading={fieldStatus[`${unidad.id}_nombre_unidad`]?.loading}
                                saved={fieldStatus[`${unidad.id}_nombre_unidad`]?.saved}
                              />
                              <CustomInputArea
                                label="Descripción (Obligatorio)"
                                value={unidad.descripcion_unidad || ''}
                                placeholder="Descripción"
                                maxLength={300}
                                onChange={(valor) => handleInputChange(organismoDisplay, ministerio, unidad.id, 'descripcion_unidad', valor)}
                                onBlur={() => handleSave(organismoDisplay, ministerio, unidad.id, true)}
                                loading={fieldStatus[`${unidad.id}_descripcion_unidad`]?.loading}
                                saved={fieldStatus[`${unidad.id}_descripcion_unidad`]?.saved}
                              />
                            </div>

                            <div className="col-2 d-flex align-items-center justify-content-center">
                              {unidades.length > 1 && (
                                <button
                                  className="btn-terciario-ghost mb-2 me-5"
                                  onClick={() => eliminarFila(organismoDisplay, ministerio, unidad.id)}>
                                  <i className="material-symbols-rounded me-2">delete</i>
                                  <p className="mb-0 text-decoration-underline">Borrar</p>
                                </button>
                              )}
                            </div>
                            <hr />
                          </div>
                        ))}
                        <div className="row">
                          <div className="p-2">
                            {mostrarBotonGuardar ? (
                              <button className="btn-primario-s m-2" onClick={() => handleSave(organismoDisplay, ministerio, filaEnEdicionId, true)}>
                                <i className="material-symbols-rounded me-2">save</i>
                                <p className="mb-0 text-decoration-underline">Guardar</p>
                              </button>
                            ) : (
                              <button className="btn-secundario-s" onClick={() => agregarFila(organismoDisplay, ministerio)}>
                                <i className="material-symbols-rounded me-2">add</i>
                                <p className="mb-0 text-decoration-underline">Agregar Unidad</p>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};