import { useState, useEffect, useContext } from "react";
import CustomInput from "../../forms/custom_input";
import DropdownCheckbox from "../../dropdown/checkbox";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import { useForm, Controller } from "react-hook-form";

export const Subpaso_dosPuntoTres = ({
  id,
  data,
  stepNumber,
  listado_unidades,
  refreshSubpasoDos_tres,
  setRefreshSubpasoDos_tres,
  setRefreshSubpasoDos_cuatro
}) => {

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    mode: 'onBlur',
  });

  const [dataDirecta, setDataDirecta] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [nuevaUnidadId, setNuevaUnidadId] = useState('');
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [etapas, setEtapas] = useState(data);
  const [ultimaEtapaId, setUltimaEtapaId] = useState(null);
  const [mostrarBotonGuardarEtapa, setMostrarBotonGuardarEtapa] = useState(false);
  const [etapaEnEdicionId, setEtapaEnEdicionId] = useState(null);
  const [procedimientoEnEdicionId, setProcedimientoEnEdicionId] = useState(null);

  // Llamada para recargar componente, en este caso a listado unidades
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
    return datos.map(dato => ({
      label: dato.nombre_unidad,
      value: dato.id.toString() // Convertimos el ID a string para mantener consistencia
    }));
  };

  useEffect(() => {
    if (refreshSubpasoDos_tres) {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [refreshSubpasoDos_tres, id, stepNumber]);

  // Efecto para manejar la actualización de opciones basado en dataDirecta
  useEffect(() => {
    if (dataDirecta?.listado_unidades) {
      const nuevasOpciones = transformarEnOpciones(dataDirecta.listado_unidades);
      setOpciones(nuevasOpciones);
    }
  }, [dataDirecta]);

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_unidades) {
      const listaInicial = transformarEnOpciones(listado_unidades);
      setOpciones(listaInicial);
    }
  }, [listado_unidades]);



  const manejarCambioDropdown = (opcionSeleccionada) => {
    // Asumiendo que opcionSeleccionada es un objeto con las propiedades 'label' y 'value'
    const idSeleccionado = opcionSeleccionada.value; // El ID es el 'value'
    setNuevaUnidadId(idSeleccionado);
  };


  // Lógica para agregar una nueva Etapa
  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };


  const agregarEtapa = () => {
    const nuevaEtapaId = generarIdUnico();
    setUltimaEtapaId(nuevaEtapaId);
    const nuevaEtapa = {
      id: nuevaEtapaId,
      nombre_etapa: '',
      descripcion_etapa: '',
      procedimientos: [],
      editando: false
    };
    setEtapas(prevEtapas => [...prevEtapas, nuevaEtapa]);
    setMostrarBotonGuardarEtapa(true);
  };

  const [ultimoProcedimientoId, setUltimoProcedimientoId] = useState(null);
  const [mostrarBotonGuardarProcedimiento, setMostrarBotonGuardarProcedimiento] = useState(false);

  const agregarProcedimiento = (etapaId) => {
    const nuevoProcedimientoId = generarIdUnico();
    setUltimoProcedimientoId(nuevoProcedimientoId);
    const nuevoProcedimiento = {
      id: nuevoProcedimientoId,
      descripcion_procedimiento: '',
      unidades_intervinientes: [],
      editando: false
    };

    setEtapas(prevEtapas => prevEtapas.map(etapa => {
      if (etapa.id === etapaId) {
        return { ...etapa, procedimientos: [...etapa.procedimientos, nuevoProcedimiento] };
      }
      return etapa;
    }));
    setMostrarBotonGuardarProcedimiento(true);
  };


  // Lógica para eliminar una fila de un organismo
  const eliminarElemento = async (etapaId, procedimientoId = null) => {

    let payload;

    if (procedimientoId) {
      // Preparar payload para eliminar un procedimiento
      payload = {
        'p_2_3_etapas_ejercicio_competencia': [{
          id: etapaId,
          'procedimientos': [{
            id: procedimientoId,
            DELETE: true
          }]
        }]
      };

      // Actualizar el estado local para reflejar la eliminación
      setEtapas(prevEtapas => prevEtapas.map(etapa => {
        if (etapa.id === etapaId) {
          const procedimientosActualizados = etapa.procedimientos.filter(proc => proc.id !== procedimientoId);
          return { ...etapa, procedimientos: procedimientosActualizados };
        }
        return etapa;
      }));
    } else {
      // Preparar payload para eliminar una etapa
      payload = {
        'p_2_3_etapas_ejercicio_competencia': [{
          id: etapaId,
          DELETE: true
        }]
      };

      // Actualizar el estado local para reflejar la eliminación
      setEtapas(prevEtapas => prevEtapas.filter(etapa => etapa.id !== etapaId));
    }

    // Llamar a la API para actualizar los datos
    try {
      await handleUpdatePaso(id, stepNumber, payload);

      setMostrarBotonGuardarEtapa(false);
      setMostrarBotonGuardarProcedimiento(false);
      setRefreshSubpasoDos_cuatro(true);

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };


  // Lógica para editar sectores existentes
  const handleInputChange = (etapaId, procedimientoId, campo, valor) => {
    setEtapaEnEdicionId(etapaId);
    setProcedimientoEnEdicionId(procedimientoId);

    setEtapas(prevEtapas => prevEtapas.map(etapa => {
      if (etapa.id === etapaId) {
        if (procedimientoId) {
          // Actualizar un procedimiento específico
          return {
            ...etapa,
            procedimientos: etapa.procedimientos.map(procedimiento => {
              if (procedimiento.id === procedimientoId) {
                return { ...procedimiento, [campo]: valor };
              }
              return procedimiento;
            })
          };
        } else {
          // Actualizar una etapa específica
          return { ...etapa, [campo]: valor };
        }
      }
      return etapa;
    }));
  };


  const handleSave = async (etapaId, procedimientoId, esGuardadoPorBlur, fieldName, newValue) => {
    if (!esGuardadoPorBlur) {
      setMostrarBotonGuardarEtapa(false);
    }

    const etapa = etapas.find(e => e.id === etapaId);
    let payload;

    if (procedimientoId) {
      // Preparar payload para guardar un procedimiento
      const procedimiento = etapa.procedimientos.find(p => p.id === procedimientoId);
      payload = {
        'p_2_3_etapas_ejercicio_competencia': [{
          id: etapaId,
          'procedimientos': [{
            id: procedimientoId,
            descripcion_procedimiento: procedimiento.descripcion_procedimiento,
            'unidades_intervinientes':
              [{
                id: procedimientoId,
                unidades_intervinientes: newValue.map(option => option.value)
              }]
          }]
        }]
      };
    } else {
      // Preparar payload para guardar una etapa
      payload = {
        'p_2_3_etapas_ejercicio_competencia': [{
          id: etapaId,
          nombre_etapa: etapa.nombre_etapa,
          descripcion_etapa: etapa.descripcion_etapa
        }]
      };
    }

    try {
      // Llamar a la API para actualizar los datos
      const response = await handleUpdatePaso(id, stepNumber, payload);
      // Más código para manejar la respuesta

      setMostrarBotonGuardarEtapa(false);
      setMostrarBotonGuardarProcedimiento(false);
      setRefreshSubpasoDos_cuatro(true);

    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };


  return (
    <div>
      <h4 className="text-sans-h4">2.3 Descripción de etapas y procedimientos del ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se deben describir las etapas que componen el ejercicio de la competencia, indicando los procedimientos que se realizan, los hitos que la componen, y las unidades que intervienen en su ejecución, y sus responsabilidades.</h6>
      <h6 className="text-sans-h6-primary mt-3">Este punto es opcional.</h6>

      {etapas.map((etapa, etapaIndex) => (
        <div key={etapa.id} className="row border my-4">
          {/* Contenido de la etapa, como nombre y descripción */}
          <div className="col-1 border">
            <p className="text-sans-p-bold mb-0">Etapa {etapaIndex + 1}</p>
          </div>

          <div className="col">
            <div className="row ">
              <div className="col-2 p-2">
                <p className="text-sans-p-bold mb-0">Nombre de la etapa</p>
                <p className="text-sans-p-grayc">(Opcional)</p>
              </div>
              <div className="col p-2">
                <CustomInput
                  label=""
                  value={etapa.nombre_etapa || ''}
                  placeholder="Escribe el nombre de la etapa"
                  maxLength={500}
                  onChange={(valor) => handleInputChange(etapa.id, null, 'nombre_etapa', valor)}
                  onBlur={etapa.id !== ultimaEtapaId ? () => handleSave(etapa.id, null, true) : null}
                />
              </div>
            </div>

            <div className="row ">
              <div className="col-2 p-2">
                <p className="text-sans-p-bold mb-0">Descripción de la etapa</p>
                <p className="text-sans-p-grayc">(Opcional)</p>
              </div>
              <div className="col p-2">
                <CustomInput
                  label=""
                  value={etapa.descripcion_etapa || ''}
                  placeholder="Describe la etapa"
                  maxLength={500}
                  onChange={(valor) => handleInputChange(etapa.id, null, 'descripcion_etapa', valor)}
                  onBlur={etapa.id !== ultimaEtapaId ? () => handleSave(etapa.id, null, true) : null}
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
                          onChange={(valor) => handleInputChange(etapa.id, procedimiento.id, 'descripcion_procedimiento', valor)}
                          onBlur={etapa.id !== ultimoProcedimientoId ? () => handleSave(etapa.id, procedimiento.id, true) : null}
                        />
                      </div>
                      <div className="col-4">
                        <Controller
                          control={control}
                          name={`unidades_intervinientes_${procedimiento.id}`}
                          render={({ field }) => {
                            return (
                              <DropdownCheckbox
                                id={`unidades_intervinientes_${procedimiento.id}`}
                                name={`unidades_intervinientes_${procedimiento.id}`}
                                label="Unidades Intervinientes"
                                placeholder="Unidades"
                                options={opciones}
                                onSelectionChange={(selectedOptions) => {
                                  handleSave(etapa.id, procedimiento.id, 'unidades_intervinientes', selectedOptions);
                                  field.onChange(selectedOptions);
                                }}

                                readOnly={false}
                                selectedValues={procedimiento.unidades_intervinientes_label_value}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="col-1">
                        <button
                          className="btn-terciario-ghost ms-3"
                          onClick={() => eliminarElemento(etapa.id, procedimiento.id)}>
                          <i className="material-symbols-rounded me-2">delete</i>
                          <p className="mb-0 text-decoration-underline">Borrar</p>
                        </button>
                      </div>
                    </div>

                  </div>
                  <hr className="my-0" />
                </div>
              ))}
              <div className="row">
                <div className="p-2">
                  {mostrarBotonGuardarProcedimiento ? (
                    <button className="btn-primario-s m-2" onClick={() => handleSave(etapa.id, procedimientoEnEdicionId, true)}>
                      <i className="material-symbols-rounded me-2">save</i>
                      <p className="mb-0 text-decoration-underline">Guardar Procedimiento</p>
                    </button>
                  ) : (
                    <button className="btn-secundario-s" onClick={() => agregarProcedimiento(etapa.id)}>
                      <i className="material-symbols-rounded me-2">add</i>
                      <p className="mb-0 text-decoration-underline">Agregar Procedimiento</p>
                    </button>
                  )}
                </div>
                <hr className="my-0" />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end p-3">
            <button
              className="btn-terciario-ghost"
              onClick={() => eliminarElemento(etapa.id)}>
              <i className="material-symbols-rounded me-2">delete</i>
              <p className="mb-0 text-decoration-underline">Borrar Etapa</p>
            </button>
          </div>
        </div>
      ))}

      <div className="row">
        <div className="p-2">
          {mostrarBotonGuardarEtapa ? (
            <button className="btn-secundario-s m-2" onClick={() => handleSave(etapaEnEdicionId, null, false)}>
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

    </div>
  )
};
