import { useState, useEffect, useContext } from 'react';
import CustomInputArea from '../../forms/textarea_paso2';
import DropdownSelect from '../../dropdown/select';
import { FormularioContext } from '../../../context/FormSectorial';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const Subpaso_dosPuntoUno = ({ id, data, lista, stepNumber, setRefreshSubpasoDos_dos, solo_lectura, limite_caracteres }) =>
{
  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ opciones, setOpciones ] = useState([]);
  // const [ mostrarError, setMostrarError ] = useState(false);
  const [ mostrarErrorNuevoOrganismo, setMostrarErrorNuevoOrganismo ] = useState(false);
  const [ controlBotones, setControlBotones ] = useState({});
  const [ erroresPorFila, setErroresPorFila ] = useState({});


  const fetchDataDirecta = async () =>
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

  //convertir estructura para el select
  const transformarEnOpciones = (datos) =>
  {
    return Object.entries(datos).map(([ value, label ]) => ({ label, value }));
  };

  useEffect(() =>
  {
    // Carga inicial con 'lista'
    if (lista)
    {
      const listaInicial = transformarEnOpciones(lista);
      setOpciones(listaInicial);
    }
  }, [ data, lista ]);

  useEffect(() =>
  {
    // Carga con 'dataDirecta' tras editar paso 2.1
    if (dataDirecta?.listado_organismos)
    {
      const nuevasOpciones = transformarEnOpciones(
        dataDirecta.listado_organismos
      );
      setOpciones(nuevasOpciones);
    }
  }, [ dataDirecta ]);

  const { handleUpdatePaso } = useContext(FormularioContext);

  // Estado para mantener los datos agrupados por organismo
  const [ organismosAgrupados, setOrganismosAgrupados ] = useState({});

  // Estado para manejar los input
  const [ nuevoOrganismo, setNuevoOrganismo ] = useState('');
  const [ nuevoOrganismoDisplay, setNuevoOrganismoDisplay ] = useState('');
  const [ nuevoOrganismoNombre, setNuevoOrganismoNombre ] = useState('');
  const [ nuevoOrganismoDescripcion, setNuevoOrganismoDescripcion ] =
    useState('');

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() =>
  {
    agruparOrganismos(data);
  }, [ data ]);

  // Función para agrupar los datos por organismo_display
  const agruparOrganismos = (datos) =>
  {
    const agrupados = datos.reduce((acc, item) =>
    {
      const displayKey = item.organismo_display;
      acc[ displayKey ] = acc[ displayKey ] || [];
      acc[ displayKey ].push(item);
      return acc;
    }, {});

    // Ordenar para que 'MIN' sea el primero, si existe
    const ordenados = {};
    if (agrupados[ 'MIN' ])
    {
      ordenados[ 'MIN' ] = agrupados[ 'MIN' ];
    }
    Object.keys(agrupados).forEach((key) =>
    {
      if (key !== 'MIN')
      {
        ordenados[ key ] = agrupados[ key ];
      }
    });

    setOrganismosAgrupados(ordenados);
  };

  const mapeoOrganismos = {
    'Ministerio o Servicio Público': 'MIN',
    'Gobierno Regional': 'GORE',
    'Delegación Presidencial Regional': 'DPR',
    Otro: 'OTRO',
  };

  // Lógica para agregar una nueva fila a un organismo
  // Generador de ID único
  const generarIdUnico = () =>
  {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const [ ultimaFilaId, setUltimaFilaId ] = useState(null);
  const [ mostrarBotonGuardar, setMostrarBotonGuardar ] = useState(true);

  const agregarFila = (organismoDisplay) =>
  {
    const nuevaFilaId = generarIdUnico();

    const organismo =
      mapeoOrganismos[ organismoDisplay ] || 'ValorPorDefectoSiNoExiste';
    // Activar botón de "Agregar Otro" solo para este organismo
    setControlBotones((prev) => ({
      ...prev,
      [ organismoDisplay ]: { mostrarBotonGuardar: true },
    }));

    setUltimaFilaId(nuevaFilaId);
    const nuevaFila = {
      id: nuevaFilaId,
      organismo: organismo,
      nombre_ministerio_servicio: '',
      descripcion: '',
    };
    setOrganismosAgrupados((prevOrganismos) => ({
      ...prevOrganismos,
      [ organismoDisplay ]: [ ...prevOrganismos[ organismoDisplay ], nuevaFila ],
    }));
  };

  // Lógica para eliminar una fila de un organismo
  const eliminarFila = async (organismoDisplay, idFila) =>
  {
    const payload = {
      p_2_1_organismos_intervinientes: [
        {
          id: idFila,
          DELETE: true,
        },
      ],
    };

    try
    {
      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualizar el estado local para reflejar la eliminación
      setOrganismosAgrupados((prevOrganismos) =>
      {
        const filasActualizadas = prevOrganismos[ organismoDisplay ].filter(
          (fila) => fila.id !== idFila
        );

        // Si después de la eliminación no quedan filas, eliminar también el organismo
        if (filasActualizadas.length === 0)
        {
          const nuevosOrganismos = { ...prevOrganismos };
          delete nuevosOrganismos[ organismoDisplay ];
          return nuevosOrganismos;
        }

        return {
          ...prevOrganismos,
          [ organismoDisplay ]: filasActualizadas,
        };
      });

      setRefreshSubpasoDos_dos(true);
      fetchDataDirecta();
      setControlBotones((prev) => ({
        ...prev,
        [ organismoDisplay ]: { mostrarBotonGuardar: false },
      }));
      // setMostrarError(false);
    } catch (error)
    {
      console.error('Error al eliminar la fila:', error);
    }
  };

  // Lógica para agregar Nuevos Organismos

  const handleNombreChange = (nuevoValor) =>
  {
    setMostrarErrorNuevoOrganismo(false);
    setNuevoOrganismoNombre(nuevoValor);
  };

  const handleDescripcionChange = (nuevoValor) =>
  {
    setNuevoOrganismoDescripcion(nuevoValor);
  };

  const [ mostrarFormularioNuevoOrganismo, setMostrarFormularioNuevoOrganismo ] =
    useState(false);

  const manejarCambioDropdown = (opcionSeleccionada) =>
  {
    // Asumiendo que opcionSeleccionada es un objeto con las propiedades 'label' y 'value'
    const valorSeleccionado = opcionSeleccionada.value;
    const labelSeleccionado = opcionSeleccionada.label;
    setNuevoOrganismo(valorSeleccionado);
    setNuevoOrganismoDisplay(labelSeleccionado);
  };

  const mostrarFormulario = () =>
  {
    setMostrarFormularioNuevoOrganismo(true);
  };

  const agregarNuevoOrganismo = async () =>
  {
    if (
      !nuevoOrganismo ||
      !nuevoOrganismoNombre.trim() ||
      !nuevoOrganismoDescripcion.trim()
    )
    {
      setMostrarErrorNuevoOrganismo(true);
      return;
    }
    setMostrarErrorNuevoOrganismo(false);
    const nuevoOrganismoDatos = {
      organismo: nuevoOrganismo,
      nombre_ministerio_servicio: nuevoOrganismoNombre,
      descripcion: nuevoOrganismoDescripcion,
    };

    const payload = {
      p_2_1_organismos_intervinientes: [ nuevoOrganismoDatos ],
    };

    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setOrganismosAgrupados((prevOrganismos) =>
      {
        const nuevosOrganismos = { ...prevOrganismos };
        nuevosOrganismos[ nuevoOrganismo ] =
          nuevosOrganismos[ nuevoOrganismo ] || [];
        nuevosOrganismos[ nuevoOrganismo ].push(nuevoOrganismoDatos);
        return nuevosOrganismos;
      });
      setNuevoOrganismo('');
      setNuevoOrganismoNombre('');
      setNuevoOrganismoDescripcion('');
      setNuevoOrganismoDisplay('');
      setMostrarFormularioNuevoOrganismo(false);
      setRefreshSubpasoDos_dos(true);
      fetchDataDirecta();
    } catch (error)
    {
      console.error('Error al agregar el organismo:', error);
    }
  };
  const cancelarAgregarOrganismo = () =>
  {
    setNuevoOrganismo('');
    setNuevoOrganismoNombre('');
    setNuevoOrganismoDescripcion('');
    setNuevoOrganismoDisplay('');
    setMostrarErrorNuevoOrganismo(false);
  };

  // Lógica para editar sectores existentes

  // Actualiza el estado cuando los campos cambian

  const [ filaEnEdicionId, setFilaEnEdicionId ] = useState(null);
  const [ campoEstado, setCampoEstado ] = useState({});

  const handleInputChange = (organismoDisplay, id, campo, valor) =>
  {
    // setMostrarError(false);
    setFilaEnEdicionId(id);
    setOrganismosAgrupados((prevOrganismos) =>
    {
      const organismosActualizados = {
        ...prevOrganismos,
        [ organismoDisplay ]: prevOrganismos[ organismoDisplay ].map((fila) =>
        {
          if (fila.id === id)
          {
            return { ...fila, [ campo ]: valor };
          }
          return fila;
        }),
      };
      return organismosActualizados;
    });
    setCampoEstado((prev) => ({
      ...prev,
      [ `${id}-${campo}` ]: { loading: false, saved: false },
    }));
  };

  const validarCamposFila = (fila) =>
  {
    return (
      fila.nombre_ministerio_servicio.trim() !== '' &&
      fila.descripcion.trim() !== ''
    );
  };

  const handleSave = async (
    idFila,
    organismoDisplay,
    esGuardadoPorBlur,
    campo
  ) =>
  {
    if (!esGuardadoPorBlur)
    {
      setMostrarBotonGuardar(false);
    }
    // Encuentra la fila específica que se está editando
    const filaEditada = organismosAgrupados[ organismoDisplay ]?.find(
      (fila) => fila.id === idFila
    );
    if (!filaEditada)
    {
      setErroresPorFila((prev) => ({
        ...prev,
        [ idFila ]: 'Todos los campos son obligatorios.',
      }));
      return;
    }
    if (!validarCamposFila(filaEditada))
    {
      setErroresPorFila((prev) => ({
        ...prev,
        [ idFila ]: 'Todos los campos son obligatorios.',
      }));
      return;
    } else
    {
      setErroresPorFila((prev) =>
      {
        const nuevoEstado = { ...prev };
        delete nuevoEstado[ idFila ];
        return nuevoEstado;
      });
    }
    if (!campo)
    {
      console.error(
        'El nombre del campo no se ha pasado correctamente a handleSave:',
        campo
      );
      return;
    }

    setCampoEstado((prev) => ({
      ...prev,
      [ `${idFila}-${campo}` ]: { loading: true, saved: false },
    }));

    try
    {
      const payload = {
        p_2_1_organismos_intervinientes: [
          {
            id: filaEditada.id,
            organismo: filaEditada.organismo,
            nombre_ministerio_servicio: filaEditada.nombre_ministerio_servicio,
            descripcion: filaEditada.descripcion,
          },
        ],
      };
      await handleUpdatePaso(id, stepNumber, payload);
      setControlBotones((prevState) => ({
        ...prevState,
        [ organismoDisplay ]: { mostrarBotonGuardar: false },
      }));
      setRefreshSubpasoDos_dos(true);
      // setMostrarError(false);
      setCampoEstado((prev) => ({
        ...prev,
        [ `${idFila}-${campo}` ]: { loading: false, saved: true },
      }));
    } catch (error)
    {
      console.error('Error al guardar los datos:', error);
      setCampoEstado((prev) => ({
        ...prev,
        [ `${idFila}-${campo}` ]: { loading: false, saved: false },
      }));
    }
  };

  const sonCamposFilaValidos = (fila) =>
  {
    return (
      fila.nombre_ministerio_servicio.trim() !== '' &&
      fila.descripcion.trim() !== ''
    );
  };

  const intentarGuardarFila = (idFila, organismoDisplay) =>
  {
    const fila = organismosAgrupados[ organismoDisplay ].find(
      (fila) => fila.id === idFila
    );
    if (!fila || !sonCamposFilaValidos(fila))
    {
      setErroresPorFila((prev) => ({
        ...prev,
        [ idFila ]: 'Todos los campos deben estar completos antes de guardar.',
      }));
    } else
    {
      handleSave(idFila, organismoDisplay, true, 'nombre_ministerio_servicio');
      handleSave(idFila, organismoDisplay, true, 'descripcion');
      setErroresPorFila((prev) =>
      {
        const newState = { ...prev };
        delete newState[ idFila ];
        return newState;
      });
    }
    setUltimaFilaId(null)
  };
  return (
    <div>
      <h4 className="text-sans-h4">
        2.1 Organismos intervinientes en el ejercicio de la competencia
      </h4>
      <h6 className="text-sans-h6-primary">
        En esta sección se debe describir brevemente, según corresponda, la
        esfera de atribuciones que posee cada organismo que cumpla un rol en el
        ejercicio de la competencia. Si las atribuciones de los organismos no
        están establecidas por ley, o el organismo no tiene un rol en el
        ejercicio de la competencia, la casilla de descripción debe quedar
        vacía.{' '}
      </h6>
      <h6 className="text-sans-h6-primary mt-3">
        Asegúrate de identificar correctamente los organismos intervinientes, ya
        que esta información será utilizada más adelante en tu formulario.
      </h6>

      {/* Renderiza las tablas para cada organismo */}
      <div className="my-4">
        {Object.entries(organismosAgrupados).map(
          ([ organismoDisplay, filas ], index) => (
            <div key={index} className="tabla-organismo">
              <div className="row border-top border-start border-bottom">
                <div className="col-3 p-3">
                  <p className="text-wrap">{organismoDisplay}</p>
                </div>

                <div className="col-9 border-start border-end p-2">
                  {filas?.map((fila, filaIndex) => (
                    <div key={fila?.id} className="row p-1">
                      <div className="col-10 p-3">
                        <div className="conteo mb-3">{filaIndex + 1}</div>
                        <CustomInputArea
                          readOnly={solo_lectura}
                          label="Nombre (Obligatorio)"
                          value={fila.nombre_ministerio_servicio || ''}
                          placeholder="Nombre ministerio o servicio"
                          maxLength={index === 0 && filaIndex === 0 ? undefined : 300}
                          disabled={index === 0 && filaIndex === 0 || solo_lectura}
                          onChange={(valor) =>
                            handleInputChange(
                              organismoDisplay,
                              fila.id,
                              'nombre_ministerio_servicio',
                              valor
                            )
                          }
                          onBlur={
                            fila.id !== ultimaFilaId
                              ? () =>
                                handleSave(
                                  fila.id,
                                  organismoDisplay,
                                  true,
                                  'nombre_ministerio_servicio'
                                )
                              : null
                          }
                          loading={campoEstado[ `${fila.id}-nombre_ministerio_servicio` ]?.loading}
                          saved={campoEstado[ `${fila.id}-nombre_ministerio_servicio` ]?.saved}
                        />
                        {!(index === 0 && filaIndex === 0) && (
                          <div className="mt-4">
                            <CustomInputArea
                              label="Descripción (Obligatorio)"
                              value={fila.descripcion || ''}
                              placeholder="Descripción"
                              maxLength={limite_caracteres}
                              readOnly={solo_lectura}
                              onChange={(valor) =>
                                handleInputChange(
                                  organismoDisplay,
                                  fila.id,
                                  'descripcion',
                                  valor
                                )
                              }
                              onBlur={
                                fila.id !== ultimaFilaId
                                  ? () =>
                                    handleSave(
                                      fila.id,
                                      organismoDisplay,
                                      true,
                                      'descripcion'
                                    )
                                  : null
                              }
                              loading={
                                campoEstado[ `${fila.id}-descripcion` ]?.loading
                              }
                              saved={campoEstado[ `${fila.id}-descripcion` ]?.saved}
                            />
                          </div>
                        )}
                      </div>
                      {index !== 0 || filaIndex !== 0 ? (
                        <div className="col d-flex align-items-center">
                          {!solo_lectura && (
                            <button
                              className="btn-terciario-ghost"
                              onClick={() =>
                                eliminarFila(organismoDisplay, fila.id)
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
                      ) : null}
                      <hr className="" />
                      {erroresPorFila[ fila.id ] && (
                        <div className="col-12">
                          <div className="text-sans-p-bold-darkred">
                            {erroresPorFila[ fila.id ]}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="row">
                    <div className="p-2">
                      {!solo_lectura && (
                        controlBotones[ organismoDisplay ]?.mostrarBotonGuardar ? (
                          <>
                            { mostrarBotonGuardar && (
                              <>
                                <p className="ms-2 text-sans-h6-primary">Recuerda guardar los datos ingresados. Si no guardas, tus datos de organismos se perderán.</p>
                                <button
                                  className="btn-secundario-s m-2"
                                  onClick={() => intentarGuardarFila(filaEnEdicionId, organismoDisplay)}
                                >
                                  <i className="material-symbols-rounded me-2">save</i>
                                  <p className="mb-0 text-decoration-underline">
                                    Guardar
                                  </p>
                                </button>
                              </>
                          )} 
                          </>
                        ) : (
                          <button
                            className="btn-secundario-s m-2"
                            onClick={() => agregarFila(organismoDisplay)}
                          >
                            <i className="material-symbols-rounded me-2">add</i>
                            <p className="mb-0 text-decoration-underline">
                              Agregar Otro
                            </p>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {mostrarFormularioNuevoOrganismo && (
          <div className="tabla-organismo mt-2">
            <div className="row border">
              <div className="col-3 p-3">
                <p>
                  <DropdownSelect
                    options={opciones}
                    value={nuevoOrganismoDisplay}
                    onSelectionChange={manejarCambioDropdown}
                    placeholder="Organismos"
                    readOnly={solo_lectura}
                  />
                </p>
              </div>

              <div className="col-9 border-start p-2">
                <div className="row">
                  <div className="col-10 p-3">
                    <CustomInputArea
                      label="Nombre (Obligatorio)"
                      value={nuevoOrganismoNombre}
                      onChange={handleNombreChange}
                      placeholder="Nombre ministerio o servicio"
                      maxLength={300}
                      readOnly={solo_lectura}
                    />

                    <CustomInputArea
                      label="Descripción (Obligatorio)"
                      value={nuevoOrganismoDescripcion}
                      onChange={handleDescripcionChange}
                      placeholder="Descripción"
                      maxLength={limite_caracteres}
                      readOnly={solo_lectura}
                    />
                  </div>
                  <div className="col d-flex align-items-center">
                    <button
                      className="btn-terciario-ghost"
                      onClick={cancelarAgregarOrganismo}
                    >
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">Borrar</p>
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="p-2">
                    {mostrarErrorNuevoOrganismo && (
                      <div className="text-sans-p-bold-darkred">
                        Todos los campos son obligatorios para agregar un nuevo
                        organismo.
                      </div>
                    )}
                    <button
                      className="btn-secundario-s m-2"
                      onClick={agregarNuevoOrganismo}
                    >
                      <i className="material-symbols-rounded me-2">add</i>
                      <p className="mb-0 text-decoration-underline">
                        Guardar Organismo
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {
          opciones.length > 0 && !solo_lectura && (
            <button className="btn-secundario-s mt-3" onClick={mostrarFormulario}>
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar Organismo</p>
            </button>
          )
        }
      </div>
    </div>
  );
};
