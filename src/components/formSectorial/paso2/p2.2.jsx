import { useState, useEffect, useContext } from 'react';
import CustomInputArea from '../../forms/textarea_paso2';
import { FormularioContext } from '../../../context/FormSectorial';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const Subpaso_dosPuntoDos = ({
  id,
  data,
  stepNumber,
  refreshSubpasoDos_dos,
  setRefreshSubpasoDos_dos,
  setRefreshSubpasoDos_tres,
  solo_lectura,
}) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [ agrupados, setAgrupados ] = useState({});
  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ mostrarError, setMostrarError ] = useState(false);
  const [ controlBotones, setControlBotones ] = useState({});
  const [ erroresPorFila, setErroresPorFila ] = useState({});

  const fetchDataDirectly = async () =>
  {
    try
    {
      const response = await apiTransferenciaCompentencia.get(
        `/formulario-sectorial/${id}/paso-${stepNumber}/`
      );
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
      const { organismo_display, nombre_ministerio_servicio } =
        unidad.organismo;
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
        const nuevosAgrupados = agrupadosPorOrganismo(
          p_2_2_unidades_intervinientes
        );

        setAgrupados(nuevosAgrupados);
      }
    }
  }, [ dataDirecta ]);

  // Lógica para agregar una nueva fila a un organismo
  // Generador de ID único
  const generarIdUnico = () =>
  {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  // Función para obtener el ministerioId desde dataDirecta o data
  const obtenerMinisterioIdDesdeDataDirecta = (nombreMinisterio) =>
  {
    if (dataDirecta)
    {
      const { p_2_2_unidades_intervinientes } = dataDirecta;
      const unidadDirecta = p_2_2_unidades_intervinientes.find(
        (item) => item.organismo.nombre_ministerio_servicio === nombreMinisterio
      );
      if (
        unidadDirecta &&
        unidadDirecta.organismo &&
        unidadDirecta.organismo.id
      )
      {
        return unidadDirecta.organismo.id;
      }
    }

    if (data)
    {
      const unidad = data.find(
        (item) => item.organismo.nombre_ministerio_servicio === nombreMinisterio
      );
      if (unidad && unidad.organismo && unidad.organismo.id)
      {
        return unidad.organismo.id;
      }
    }
    return null;
  };

  const [ ultimaFilaId, setUltimaFilaId ] = useState(null);

  const agregarFila = (organismoDisplay, nombreMinisterio) =>
  {
    const ministerioActual = agrupados[ organismoDisplay ]?.[ nombreMinisterio ] || [];
    const ultimaFila = ministerioActual[ ministerioActual.length - 1 ];
    if (ultimaFila && (!ultimaFila.nombre_unidad.trim() || !ultimaFila.descripcion_unidad.trim()))
    {

      setErroresPorFila((prevErrores) => ({
        ...prevErrores,
        [ ultimaFila.id ]: "Por favor, completa todos los campos obligatorios antes de agregar una nueva fila."
      }));
      return;
    } else
    {
      if (ultimaFila)
      {
        setErroresPorFila((prevErrores) =>
        {
          const nuevosErrores = { ...prevErrores };
          delete nuevosErrores[ ultimaFila.id ];
          return nuevosErrores;
        });
      }
      const nuevaFilaId = generarIdUnico();
      setControlBotones((prev) => ({
        ...prev,
        [ `${organismoDisplay}-${nombreMinisterio}` ]: {
          mostrarBotonGuardar: true,
        },
      }));
      setUltimaFilaId(nuevaFilaId);

      setAgrupados((prevAgrupados) =>
      {
        const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));

        if (!nuevoEstado[ organismoDisplay ])
        {
          nuevoEstado[ organismoDisplay ] = {};
        }
        if (!nuevoEstado[ organismoDisplay ][ nombreMinisterio ])
        {
          nuevoEstado[ organismoDisplay ][ nombreMinisterio ] = [];
        }

        const nuevaFila = {
          id: nuevaFilaId,
          organismo_id: obtenerMinisterioIdDesdeDataDirecta(nombreMinisterio),
          nombre_unidad: '',
          descripcion_unidad: '',
        };

        nuevoEstado[ organismoDisplay ][ nombreMinisterio ].push(nuevaFila);

        return nuevoEstado;
      });
    }
  };


  // Lógica para eliminar una fila de un organismo
  const eliminarFila = async (organismoDisplay, nombreMinisterio, idFila) =>
  {
    const payload = {
      p_2_2_unidades_intervinientes: [
        {
          id: idFila,
          DELETE: true,
        },
      ],
    };

    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setAgrupados((prevAgrupados) =>
      {
        const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));
        nuevoEstado[ organismoDisplay ][ nombreMinisterio ] = nuevoEstado[
          organismoDisplay
        ][ nombreMinisterio ].filter((fila) => fila.id !== idFila);

        return nuevoEstado;
      });

      setRefreshSubpasoDos_tres(true);
      setMostrarError(false);
    } catch (error)
    {
      console.error('Error al eliminar la fila:', error);
    }
  };

  // Lógica para editar unidades existentes
  const handleInputChange = (
    organismoDisplay,
    nombreMinisterio,
    idFila,
    campo,
    valor
  ) =>
  {
    setAgrupados((prevAgrupados) =>
    {
      if (prevAgrupados[ organismoDisplay ] && prevAgrupados[ organismoDisplay ][ nombreMinisterio ])
      {
        const nuevoEstado = JSON.parse(JSON.stringify(prevAgrupados));
        const filaEditadaIndex = nuevoEstado[ organismoDisplay ][ nombreMinisterio ].findIndex((fila) => fila.id === idFila);
        if (filaEditadaIndex !== -1)
        {
          nuevoEstado[ organismoDisplay ][ nombreMinisterio ][ filaEditadaIndex ][ campo ] = valor;
          const filaEditada = nuevoEstado[ organismoDisplay ][ nombreMinisterio ][ filaEditadaIndex ];
          if (filaEditada.nombre_unidad.trim() && filaEditada.descripcion_unidad.trim())
          {
            setErroresPorFila((prevErrores) =>
            {
              const nuevosErrores = { ...prevErrores };
              delete nuevosErrores[ idFila ];
              return nuevosErrores;
            });
          }
        }
        return nuevoEstado;
      }
      return prevAgrupados;
    });
  };

  const [ campoEstado, setCampoEstado ] = useState({});

  // Lógica para guardar unidades existentes y nuevas
  const handleSave = async (
    organismoDisplay,
    nombreMinisterio,
    idFila,
    campo
  ) =>
  {
    const filaEditada = agrupados[ organismoDisplay ]?.[ nombreMinisterio ]?.find(
      (fila) => fila.id === idFila
    );

    if (!filaEditada)
    {
      console.error('Fila no encontrada para ID:', idFila);
      return;
    }

    const campoClave = `${idFila}-${campo}`;
    setCampoEstado((prev) => ({
      ...prev,
      [ campoClave ]: { loading: true, saved: false },
    }));

    try
    {
      const payload = {
        p_2_2_unidades_intervinientes: [
          {
            id: filaEditada.id,
            [ campo ]: filaEditada[ campo ],
            organismo_id: obtenerMinisterioIdDesdeDataDirecta(nombreMinisterio),
          },
        ],
      };
      await handleUpdatePaso(id, stepNumber, payload);
      setCampoEstado((prev) => ({
        ...prev,
        [ campoClave ]: { loading: false, saved: true },
      }));
    } catch (error)
    {
      console.error('Error al guardar los datos:', error);
      setCampoEstado((prev) => ({
        ...prev,
        [ campoClave ]: { loading: false, saved: false },
      }));
    }
  };

  return (
    <div>
      <h4 className="text-sans-h4">
        2.2 Unidades intervinientes en el Ministerio o Servicio
      </h4>
      <h6 className="text-sans-h6-primary">
        Se entenderá por Unidad Interviniente a aquellos actores al interior de
        la orgánica sectorial que intervienen en el ejercicio de la competencia
        analizada.
      </h6>
      <h6 className="text-sans-h6-primary mt-3">
        {' '}
        Asegúrate de identificar correctamente las unidades de cada organismo
        que participan en el ejercicio de la competencia, ya que esta
        información será utilizada más adelante en tu formulario.
      </h6>

      <div className="my-4">
        {Object.entries(agrupados).map(([ organismoDisplay, ministerios ]) => (
          <div key={organismoDisplay} className="tabla-organismo">
            <div className="row border-start border-bottom">
              <div className="col-2 border-top">
                <p>{organismoDisplay}</p>
              </div>

              <div className="col-10">
                {Object.entries(ministerios).map(([ ministerio, unidades ]) => (
                  <div key={ministerio} className="tabla-organismo">
                    <div className="row border-start border-top">
                      <div className="col-3 p-3">
                        <div className="col-7">{ministerio}</div>
                      </div>
                      <div className="col-9 border-start border-end p-2">
                        {unidades.map((unidad, unidadIndex) => (
                          <div key={unidad.id} className=" row">
                            <div className="col-10 p-3">
                              <div className="conteo">{unidadIndex + 1}</div>
                              <CustomInputArea
                                label="Nombre (Obligatorio)"
                                value={unidad.nombre_unidad || ''}
                                placeholder="Nombre ministerio o servicio"
                                maxLength={300}
                                onChange={(valor) =>
                                  handleInputChange(
                                    organismoDisplay,
                                    ministerio,
                                    unidad.id,
                                    'nombre_unidad',
                                    valor
                                  )
                                }
                                onBlur={() =>
                                  handleSave(
                                    organismoDisplay,
                                    ministerio,
                                    unidad.id,
                                    'nombre_unidad' // Asegúrate de pasar el nombre del campo correctamente como un string
                                  )
                                }
                                loading={
                                  campoEstado[ `${unidad.id}-nombre_unidad` ]
                                    ?.loading
                                } // Asegúrate de usar '-' para separar el ID del campo
                                saved={
                                  campoEstado[ `${unidad.id}-nombre_unidad` ]
                                    ?.saved
                                }
                                readOnly={solo_lectura}
                              />
                              <div className="mt-3">
                                <CustomInputArea
                                  label="Descripción (Obligatorio)"
                                  value={unidad.descripcion_unidad || ''}
                                  placeholder="Descripción"
                                  maxLength={300}
                                  onChange={(valor) =>
                                    handleInputChange(
                                      organismoDisplay,
                                      ministerio,
                                      unidad.id,
                                      'descripcion_unidad',
                                      valor
                                    )
                                  }
                                  onBlur={() =>
                                    handleSave(
                                      organismoDisplay,
                                      ministerio,
                                      unidad.id,
                                      'descripcion_unidad' // Igual aquí, pasa el nombre del campo como un string
                                    )
                                  }
                                  loading={
                                    campoEstado[ `${unidad.id}-descripcion_unidad` ]
                                      ?.loading
                                  }
                                  saved={
                                    campoEstado[ `${unidad.id}-descripcion_unidad` ]
                                      ?.saved
                                  }
                                  readOnly={solo_lectura}
                                />
                              </div>
                            </div>
                            <div className="col-2 d-flex align-items-center justify-content-center">
                            {unidadIndex > 0 && !solo_lectura &&( 
                                <button
                                  className="btn-terciario-ghost mb-2 me-5"
                                  onClick={() =>
                                    eliminarFila(
                                      organismoDisplay,
                                      ministerio,
                                      unidad.id
                                    )
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
                            {erroresPorFila[ unidad.id ] && (
                              <div className="col-12">
                                <div className="text-sans-p-bold-darkred">
                                  {erroresPorFila[ unidad.id ]}
                                </div>
                              </div>
                            )}
                          </div>

                        ))}
                        {!solo_lectura && (
                          <div className="row">
                            <div className="p-2">
                              <button
                                className="btn-secundario-s m-2"
                                onClick={() =>
                                  agregarFila(organismoDisplay, ministerio)
                                }
                              >
                                <i className="material-symbols-rounded me-2">
                                  add
                                </i>
                                Agregar Unidad
                              </button>
                            </div>
                          </div>
                        )}
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
  );
};
