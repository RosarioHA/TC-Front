import { useState, useEffect, useContext } from 'react';
import CustomInput from '../../forms/custom_input';
import DropdownSelect from '../../dropdown/select';
import { FormularioContext } from '../../../context/FormSectorial';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const Subpaso_dosPuntoUno = ({ id, data, lista, stepNumber, setRefreshSubpasoDos_dos }) => {
 
  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ opciones, setOpciones ] = useState([]);

  const fetchDataDirecta = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

 //convertir estructura para el select
  const transformarEnOpciones = (datos) => {
    return Object.entries(datos).map(([value, label]) => ({ label, value }));
  };

  useEffect(() => {
    // Carga inicial con 'lista'
    if (lista) {
      const listaInicial = transformarEnOpciones(lista);
      setOpciones(listaInicial);
    }
  }, [data]);

  useEffect(() => {
    // Carga con 'dataDirecta' tras editar paso 2.1
    if (dataDirecta?.listado_organismos) {
      const nuevasOpciones = transformarEnOpciones(dataDirecta.listado_organismos);
      setOpciones(nuevasOpciones);
    }
  }, [dataDirecta]);

  const { handleUpdatePaso } = useContext(FormularioContext);

  // Estado para mantener los datos agrupados por organismo
  const [organismosAgrupados, setOrganismosAgrupados] = useState({});

  // Estado para manejar los input
  const [nuevoOrganismo, setNuevoOrganismo] = useState('');
  const [nuevoOrganismoDisplay, setNuevoOrganismoDisplay] = useState('');
  const [nuevoOrganismoNombre, setNuevoOrganismoNombre] = useState('');
  const [nuevoOrganismoDescripcion, setNuevoOrganismoDescripcion] = useState('');

  
  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() => {
    agruparOrganismos(data);
  }, [data]);

  // Función para agrupar los datos por organismo_display
  const agruparOrganismos = (datos) => {
    const agrupados = datos.reduce((acc, item) => {
      const displayKey = item.organismo_display; 
      acc[displayKey] = acc[displayKey] || [];
      acc[displayKey].push(item);
      return acc;
    }, {});

    // Ordenar para que 'MIN' sea el primero, si existe
    const ordenados = {};
    if (agrupados['MIN']) {
      ordenados['MIN'] = agrupados['MIN'];
    }
    Object.keys(agrupados).forEach(key => {
      if (key !== 'MIN') {
        ordenados[key] = agrupados[key];
      }
    });

    setOrganismosAgrupados(ordenados);
  };

  const mapeoOrganismos = {
    'Ministerio o Servicio Público': 'MIN',
    'Gobierno Regional': 'GORE',
    'Delegación Presidencial Regional': 'DPR',
    'Otro': 'OTRO'
  };

  // Lógica para agregar una nueva fila a un organismo
  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };
  
  const [ultimaFilaId, setUltimaFilaId] = useState(null);
  const [mostrarBotonGuardar, setMostrarBotonGuardar] = useState(false);


  const agregarFila = (organismoDisplay) => {
    const nuevaFilaId = generarIdUnico();

    setMostrarBotonGuardar(true);
    const organismo = mapeoOrganismos[organismoDisplay] || "ValorPorDefectoSiNoExiste";
    
    setUltimaFilaId(nuevaFilaId);
    const nuevaFila = { 
      id: nuevaFilaId,
      organismo: organismo, 
      nombre_ministerio_servicio: '', 
      descripcion: '' 
    };
    setOrganismosAgrupados(prevOrganismos => ({
      ...prevOrganismos,
      [organismoDisplay]: [...prevOrganismos[organismoDisplay], nuevaFila]
    }));
  };

  // Lógica para eliminar una fila de un organismo
  const eliminarFila = async (organismoDisplay, idFila) => {
    const payload = {
      'p_2_1_organismos_intervinientes': [{
        id: idFila,
        DELETE: true
      }]
    };
  
    try {
      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);
  
      // Actualizar el estado local para reflejar la eliminación
      setOrganismosAgrupados(prevOrganismos => {
        const filasActualizadas = prevOrganismos[organismoDisplay].filter(fila => fila.id !== idFila);
  
        // Si después de la eliminación no quedan filas, eliminar también el organismo
        if (filasActualizadas.length === 0) {
          const nuevosOrganismos = { ...prevOrganismos };
          delete nuevosOrganismos[organismoDisplay];
          return nuevosOrganismos;
        }
  
        return {
          ...prevOrganismos,
          [organismoDisplay]: filasActualizadas
        };
      });
  
      setRefreshSubpasoDos_dos(true);
      fetchDataDirecta();
      setMostrarBotonGuardar(false);
  
    } catch (error) {
      console.error("Error al eliminar la fila:", error);
    }
  };
  
  
  // Lógica para agregar Nuevos Organismos
  
  const handleNombreChange = (nuevoValor) => {
    setNuevoOrganismoNombre(nuevoValor);
  };

  const handleDescripcionChange = (nuevoValor) => {
      setNuevoOrganismoDescripcion(nuevoValor);
  };

  const [mostrarFormularioNuevoOrganismo, setMostrarFormularioNuevoOrganismo] = useState(false);
  
  const manejarCambioDropdown = (opcionSeleccionada) => {
    // Asumiendo que opcionSeleccionada es un objeto con las propiedades 'label' y 'value'
    const valorSeleccionado = opcionSeleccionada.value;
    const labelSeleccionado = opcionSeleccionada.label;
    setNuevoOrganismo(valorSeleccionado);
    setNuevoOrganismoDisplay(labelSeleccionado);
  };

  const mostrarFormulario = () => {
    setMostrarFormularioNuevoOrganismo(true);
  };

  const agregarNuevoOrganismo = async () => {

    if (!nuevoOrganismo || !nuevoOrganismoNombre || !nuevoOrganismoDescripcion) {
      console.error("Faltan datos para agregar el organismo");
      return;
    }
  
    const nuevoOrganismoDatos = {
      organismo: nuevoOrganismo,
      nombre_ministerio_servicio: nuevoOrganismoNombre,
      descripcion: nuevoOrganismoDescripcion,
    };
  
    const payload = {
      'p_2_1_organismos_intervinientes': [nuevoOrganismoDatos]
    };
  
    try {
      await handleUpdatePaso(id, stepNumber, payload);
      // Aquí agregamos el nuevo organismo al estado
      setOrganismosAgrupados(prevOrganismos => {
        const nuevosOrganismos = { ...prevOrganismos };
        nuevosOrganismos[nuevoOrganismo] = nuevosOrganismos[nuevoOrganismo] || [];
        nuevosOrganismos[nuevoOrganismo].push(nuevoOrganismoDatos);
        return nuevosOrganismos;
      });
  
      // Limpiar los campos del formulario
      setNuevoOrganismo('');
      setNuevoOrganismoNombre('');
      setNuevoOrganismoDescripcion('');
      setNuevoOrganismoDisplay('');
      
      setMostrarFormularioNuevoOrganismo(false);
      setRefreshSubpasoDos_dos(true);
      fetchDataDirecta();
      
    } catch (error) {
      console.error("Error al agregar el organismo:", error);
    }
  };
  
  const cancelarAgregarOrganismo = () => {
    setMostrarFormularioNuevoOrganismo(false);
    setNuevoOrganismo('');
    setNuevoOrganismoNombre('');
    setNuevoOrganismoDescripcion('');
    setNuevoOrganismoDisplay('');
  };


  // Lógica para editar sectores existentes

  // Actualiza el estado cuando los campos cambian

  const [filaEnEdicionId, setFilaEnEdicionId] = useState(null);
  

  const handleInputChange = (organismoDisplay, id, campo, valor) => {
    setFilaEnEdicionId(id);

    setOrganismosAgrupados(prevOrganismos => {
      const organismosActualizados = {
        ...prevOrganismos,
        [organismoDisplay]: prevOrganismos[organismoDisplay].map(fila => {
          if (fila.id === id) {
            return { ...fila, [campo]: valor };
          }
          return fila;
        })
      };
      return organismosActualizados;
    });
  };

  const [loadingState, setLoadingState] = useState({});
  const [savedState, setSavedState] = useState({});
  
  const handleSave = async (idFila, organismoDisplay, esGuardadoPorBlur) => {
    if (!esGuardadoPorBlur) {
      setMostrarBotonGuardar(false);
    }
  
    // Encuentra la fila específica que se está editando
    const filaEditada = organismosAgrupados[organismoDisplay]?.find(fila => fila.id === idFila);
  
    // Verifica si la fila existe y si ambos campos están completos
    const camposCompletos = filaEditada && filaEditada.nombre_ministerio_servicio && filaEditada.descripcion;
  
    if (!camposCompletos) {
      console.error("Campos requeridos no completados");
      return;
    }
  
    try {
      // Encontrar la fila específica que se está editando
      const filaEditada = organismosAgrupados[organismoDisplay].find(fila => fila.id === idFila);
  
      if (!filaEditada) {
        console.error("Fila no encontrada para ID:", idFila);
        return;
      }
  
      const payload = {
        'p_2_1_organismos_intervinientes': [{
          id: filaEditada.id,
          organismo: filaEditada.organismo,
          nombre_ministerio_servicio: filaEditada.nombre_ministerio_servicio,
          descripcion: filaEditada.descripcion,
        }]
      };
  
      // Llamar a la API para actualizar los datos
      const response = await handleUpdatePaso(id, stepNumber, payload);
  
      setRefreshSubpasoDos_dos(true);
      setMostrarBotonGuardar(false);
  
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };
  

  return (
    <div>
      <h4 className="text-sans-h4">2.1 Organismos intervinientes en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se debe describir brevemente, según corresponda, la esfera de atribuciones que posee cada organismo que cumpla un rol en el ejercicio de la competencia. Si las atribuciones de los organismos no están establecidas por ley, o el organismo no tiene un rol en el ejercicio de la competencia, la casilla de descripción debe quedar vacía. </h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate de identificar correctamente los organismos intervinientes, ya que esta información será utilizada más adelante en tu formulario.</h6>

      {/* Renderiza las tablas para cada organismo */}
      <div className="my-4">
      {Object.entries(organismosAgrupados).map(([organismoDisplay, filas], index) => (
        <div key={index} className="tabla-organismo">
          <div className="row border">
            <div className="col p-3">
              <p>{organismoDisplay}</p>
            </div>
            
            <div className="col-10 border p-2">
            {filas.map((fila, filaIndex) => (
              <div key={fila.id} className="border row">
                <div className="col-10 p-3">
                  <div className="conteo">{filaIndex + 1}</div>
                  <CustomInput
                    label="Nombre (Obligatorio)"
                    value={fila.nombre_ministerio_servicio || ''}
                    placeholder="Nombre ministerio o servicio"
                    maxLength={index === 0 && filaIndex === 0 ? undefined : 300}
                    disabled={index === 0 && filaIndex === 0}
                    onChange={(valor) => handleInputChange(organismoDisplay, fila.id, 'nombre_ministerio_servicio', valor)}
                    onBlur={fila.id !== ultimaFilaId ? () => handleSave(fila.id, organismoDisplay, true) : null}
                    loading={loadingState[fila.id]}
                    saved={savedState[fila.id]}
                  />
                  {!(index === 0 && filaIndex === 0) && (
                    <CustomInput
                      label="Descripción (Obligatorio)"
                      value={fila.descripcion || ''}
                      placeholder="Descripción"
                      maxLength={300}
                      onChange={(valor) => handleInputChange(organismoDisplay, fila.id, 'descripcion', valor)}
                      onBlur={fila.id !== ultimaFilaId ? () => handleSave(fila.id, organismoDisplay, true) : null}
                      loading={loadingState[fila.id]}
                      saved={savedState[fila.id]}
                    />
                  )}
                </div>
                {index !== 0 || filaIndex !== 0 ? (
                  <div className="col d-flex align-items-center">
                    <button
                      className="btn-terciario-ghost"
                      onClick={() => eliminarFila(organismoDisplay, fila.id)}>
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">Borrar</p>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
              <div className="row">
                <div className="p-2">
                {mostrarBotonGuardar ? (
                  <button className="btn-secundario-s m-2" onClick={() => handleSave(filaEnEdicionId, organismoDisplay, true)}>
                    <i className="material-symbols-rounded me-2">save</i>
                    <p className="mb-0 text-decoration-underline">Guardar</p>
                  </button>
                  ) : (
                  <button className="btn-secundario-s" onClick={() => agregarFila(organismoDisplay)}>
                    <i className="material-symbols-rounded me-2">add</i>
                    <p className="mb-0 text-decoration-underline">Agregar Otro</p>
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {mostrarFormularioNuevoOrganismo && (
        <div className="tabla-organismo">
          <div className="row border">
            <div className="col p-3">
              <p>
                <DropdownSelect
                  options={opciones}
                  value={nuevoOrganismoDisplay}
                  onSelectionChange={manejarCambioDropdown}
                />
              </p>
            </div>

            <div className="col-10 border p-2">
              <div className="border row">
                <div className="col-10 p-3">
                  <CustomInput
                    label="Nombre"
                    value={nuevoOrganismoNombre}
                    onChange={handleNombreChange}
                    placeholder="Nombre ministerio o servicio"
                    maxLength={300}
                  />

                  <CustomInput
                    label="Descripción"
                    value={nuevoOrganismoDescripcion}
                    onChange={handleDescripcionChange}
                    placeholder="Descripción"
                    maxLength={300}
                  />
                </div>
                <div className="col d-flex align-items-center">
                  <button
                    className="btn-terciario-ghost"
                    onClick={cancelarAgregarOrganismo}>
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">Borrar</p>
                  </button>
                </div>
              </div>
              
              <div className="row">
                <div className="p-2">
                  <button className="btn-secundario-s m-2" onClick={agregarNuevoOrganismo}>
                    <i className="material-symbols-rounded me-2">add</i>
                    <p className="mb-0 text-decoration-underline">Guardar Organismo</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {
        opciones.length > 0 && (
          <button className="btn-secundario-s" onClick={mostrarFormulario}>
            <i className="material-symbols-rounded me-2">add</i>
            <p className="mb-0 text-decoration-underline">Agregar Organismo</p>
          </button>
        )
      }

      
    </div>
    </div>
  )
};