import { useState, useEffect, useContext, useCallback } from "react";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import CustomInput from "../../forms/custom_input";
import CustomTextarea from "../../forms/custom_textarea";
import { RadioButtons } from "../../forms/radio_btns";
import DropdownCheckbox from "../../dropdown/checkbox";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { esquemaEditarPaso2_4 } from "../../../validaciones/esquemaEditarFormularioSectorial";

export const Subpaso_dosPuntoCuatro = ({
  id,
  data,
  stepNumber,
  listado_etapas,
  setRefreshSubpasoDos_tres,
  refreshSubpasoDos_cuatro,
}) => {

  const {
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaEditarPaso2_4),
    mode: 'onBlur',
  });

  // Lógica para recargar opciones de etapa cuando se crean o eliminan en paso 2.3
  const [dataDirecta, setDataDirecta] = useState(null);
  const [opcionesEtapas, setOpcionesEtapas] = useState([]);
  const [ etapasSeleccionadas, setEtapasSeleccionadas ] = useState([]);

  // Llamada para recargar componente
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
      label: dato.nombre_etapa,
      value: dato.id.toString() // Convertimos el ID a string para mantener consistencia
    }));
  };

  useEffect(() => {
    if (refreshSubpasoDos_cuatro) {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [refreshSubpasoDos_cuatro, setRefreshSubpasoDos_tres, id, stepNumber]);

  // Efecto para manejar la actualización de opciones basado en dataDirecta
  useEffect(() => {
    if (dataDirecta?.listado_unidades) {
      const nuevasOpciones = transformarEnOpciones(dataDirecta.listado_unidades);
      setOpcionesEtapas(nuevasOpciones);
    }
  }, [dataDirecta]);

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_etapas) {
      const listaInicial = transformarEnOpciones(listado_etapas);
      setOpcionesEtapas(listaInicial);
    }
  }, [listado_etapas]);

  const handleEtapasChange = useCallback((selectedOptions) => {
    const etapasIds = selectedOptions.map(option => option.value);
    setEtapasSeleccionadas(selectedOptions);
    setValue('etapas', etapasIds);
  }, [setValue]);

  const { handleUpdatePaso } = useContext(FormularioContext);

  const initialState = data.map(item => ({
    ...item,
    estados: {
      nombre_plataforma: { loading: false, saved: false },
      descripcion_tecnica: { loading: false, saved: false },
      costo_adquisicion: { loading: false, saved: false },
      costo_mantencion_anual: { loading: false, saved: false },
      descripcion_costos: { loading: false, saved: false },
      funcion_plataforma: { loading: false, saved: false },
      etapas: { loading: false, saved: false },
      capacitacion_plataforma: { loading: false, saved: false }
    }
  }));

  const updateFieldState = (plataformaId, fieldName, newState) => {
    setPlataformasySoftwares(prevPlataformas =>
      prevPlataformas.map(plataforma => {
        if (plataforma.id === plataformaId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...plataforma.estados, [fieldName]: { ...newState } };
          return { ...plataforma, estados: updatedEstados };
        }
        return plataforma;
      })
    );
  };
  
  const [plataformasySoftwares, setPlataformasySoftwares] = useState(initialState);

  // Lógica para agregar una nueva tabla Plataformas
  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const [ultimaPlataformaId, setUltimaPlataformaId] = useState(null);
  const [mostrarBotonGuardarPlataforma, setMostrarBotonGuardarPlataforma] = useState(false);

  const agregarPlataforma = () => {
    const nuevaPlataformaId = generarIdUnico();
    // Asegúrate de que la nueva plataforma tenga un estado inicial completo
    const nuevaPlataforma = {
      id: nuevaPlataformaId,
      nombre_plataforma: '',
      descripcion_tecnica: '',
      costo_adquisicion: null,
      costo_mantencion_anual: null,
      descripcion_costos: '',
      funcion_plataforma: '',
      etapas: [],
      capacitacion_plataforma: false,
      editando: false,
      estados: { // Estado inicial para 'estados'
        nombre_plataforma: { loading: false, saved: false },
        descripcion_tecnica: { loading: false, saved: false },
        costo_adquisicion: { loading: false, saved: false },
        costo_mantencion_anual: { loading: false, saved: false },
        descripcion_costos: { loading: false, saved: false },
        funcion_plataforma: { loading: false, saved: false },
        etapas: { loading: false, saved: false },
        capacitacion_plataforma: { loading: false, saved: false },
      },
    };
  
    setPlataformasySoftwares(prevPlataformas => [...prevPlataformas, nuevaPlataforma]);
    setMostrarBotonGuardarPlataforma(true);
  };
  

  // Lógica para eliminar una fila de un organismo
  const eliminarElemento = async (plataformaId) => {

    // Preparar payload para eliminar una etapa
    const payload = {
      'p_2_4_plataformas_y_softwares': [{
        id: plataformaId,
        DELETE: true
      }]
    };

    // Actualizar el estado local para reflejar la eliminación
    setPlataformasySoftwares(prevPlataformas => prevPlataformas.filter(plataforma => plataforma.id !== plataformaId));

    // Llamar a la API para actualizar los datos
    try {
      await handleUpdatePaso(id, stepNumber, payload);

      setMostrarBotonGuardarPlataforma(false);

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }


  // Lógica para editar sectores existentes
  // Actualiza el estado cuando los campos cambian

  const [plataformaEnEdicionId, setPlataformaEnEdicionId] = useState(null);


  const handleInputChange = (plataformaId, campo, valor) => {
    setPlataformasySoftwares(prevPlataformas =>
      prevPlataformas.map(plataforma => {
        // Verifica si es la plataforma que estamos actualizando
        if (plataforma.id === plataformaId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...plataforma, [campo]: valor };
        }
        // Si no es la plataforma que estamos actualizando, la retorna sin cambios
        return plataforma;
      })
    );
  };


  const handleSave = async (plataformaId, esGuardadoPorBlur, fieldName) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general
    if (!esGuardadoPorBlur) {
      setMostrarBotonGuardarPlataforma(false);
    }

    const plataforma = plataformasySoftwares.find(e => e.id === plataformaId);

    updateFieldState(plataformaId, fieldName, { loading: true, saved: false });
    
    let payload;

    if (esGuardadoPorBlur) {
        // Guardar solo el campo específico
        payload = {
          'p_2_4_plataformas_y_softwares': [{ id: plataformaId, [fieldName]: plataforma[fieldName] }]
        };
    } else {
        // Guardar todos los campos de la plataforma
        payload = {
            'p_2_4_plataformas_y_softwares': [{
              id: plataformaId,
              nombre_plataforma: plataforma.nombre_plataforma,
              descripcion_tecnica: plataforma.descripcion_tecnica,
              costo_adquisicion: plataforma.costo_adquisicion,
              costo_mantencion_anual: plataforma.costo_mantencion_anual,
              descripcion_costos: plataforma.descripcion_costos,
              funcion_plataforma: plataforma.funcion_plataforma,
              etapas: etapasSeleccionadas.map(r => r.value),
              capacitacion_plataforma: plataforma.capacitacion_plataforma,
            }]
        };
    }

    try {
        // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
        const response = await handleUpdatePaso(id, stepNumber, payload);

        // Actualiza el estado de carga y guardado
        updateFieldState(plataformaId, fieldName, { loading: false, saved: true });

        if (!esGuardadoPorBlur) {
          setMostrarBotonGuardarPlataforma(false);
        }

    } catch (error) {
        console.error("Error al guardar los datos:", error);
        updateFieldState(plataformaId, fieldName, { loading: false, saved: false });
    }
};



  return (
    <div>
      <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>

      {/* Renderiza las tablas para cada plataforma */}
      {plataformasySoftwares.map((plataforma, index) => (
        <div key={plataforma.id} className="col border">
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold mb-0">{index + 1}</p>
              <p className="text-sans-p-bold ms-2">Nombre de Plataforma o Sofware</p>
            </div>
            <div className="col ms-5">
              <CustomTextarea
                label=""
                placeholder="Escribe el nombre de la plataforma o software"
                maxLength={500}
                value={plataforma.nombre_plataforma || ''}
                onChange={(e) => handleInputChange(plataforma.id, 'nombre_plataforma', e.target.value)}
                onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'nombre_plataforma') : null}
                loading={plataforma.estados?.nombre_plataforma?.loading ?? false}
                saved={plataforma.estados?.nombre_plataforma?.saved ?? false}
              />
            </div>
          </div>

          <hr />
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
            </div>
            <div className="col ms-5">
              <CustomTextarea
                placeholder="Indique la versión y una descripción técnica del software o plataforma"
                maxLength={500}
                name="descripcion_tecnica"
                value={plataforma.descripcion_tecnica || ''}
                onChange={(e) => handleInputChange(plataforma.id, 'descripcion_tecnica', e.target.value)}
                onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'descripcion_tecnica') : null}
                loading={plataforma.estados?.descripcion_tecnica?.loading ?? false}
                saved={plataforma.estados?.descripcion_tecnica?.saved ?? false}
              />
            </div>
          </div>

          <hr />
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
            </div>
            <div className="col ms-5">
              <div className="row d-flex">
                <div className="col">
                  <Controller
                    name="costo_adquisicion"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        id="costo_adquisicion"
                        label="Costo de adquisición"
                        placeholder="Costo de adquisión M$"
                        value={plataforma.costo_adquisicion || ''}
                        onChange={(valor) => handleInputChange(plataforma.id, 'costo_adquisicion', valor)}
                        onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'costo_adquisicion') : null}
                        loading={plataforma.estados?.costo_adquisicion?.loading ?? false}
                        saved={plataforma.estados?.costo_adquisicion?.saved ?? false}
                        error={errors.costo_adquisicion?.message}
                        {...field}
                      />
                    )}
                  />
                  <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                </div>
                <div className="col">
                  <CustomInput
                    label="Costo de Mantención Anual"
                    placeholder="Costo de mantención M$"
                    value={plataforma.costo_mantencion_anual || ''}
                    onChange={(valor) => handleInputChange(plataforma.id, 'costo_mantencion_anual', valor)}
                    onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'costo_mantencion_anual') : null}
                    loading={plataforma.estados?.costo_mantencion_anual?.loading ?? false}
                    saved={plataforma.estados?.costo_mantencion_anual?.saved ?? false}
                  />
                  <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                </div>
              </div>
              <div className="row mt-4">
                <CustomTextarea
                  label="Descripción de costos"
                  placeholder="Describe los costos de la plataforma o software"
                  maxLength={500}
                  value={plataforma?.descripcion_costos}
                  onChange={(e) => handleInputChange(plataforma.id, 'descripcion_costos', e.target.value)}
                  onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'descripcion_costos') : null}
                  loading={plataforma.estados?.descripcion_costos?.loading ?? false}
                  saved={plataforma.estados?.descripcion_costos?.saved ?? false}
                />
              </div>
            </div>
          </div>

          <hr />
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold ms-2">Función en el ejercicio de la competencia identificando perfiles de usuario</p>
            </div>
            <div className="col ms-5">
              <CustomTextarea
                placeholder="Describe la función en el ejercicio de la competencia y los perfiles de usuario."
                maxLength={500}
                value={plataforma?.funcion_plataforma}
                onChange={(e) => handleInputChange(plataforma.id, 'funcion_plataforma', e.target.value)}
                onBlur={plataforma.id !== ultimaPlataformaId ? () => handleSave(plataforma.id, true, 'funcion_plataforma') : null}
                loading={plataforma.estados?.funcion_plataforma?.loading ?? false}
                saved={plataforma.estados?.funcion_plataforma?.saved ?? false}  
                />
            </div>
          </div>

          <hr />
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold ms-2 mb-0">Etapas donde se utiliza</p>
              <p className="text-sans-p ms-2">(Opcional)</p>
            </div>
            <div className="col ms-5">
              <DropdownCheckbox
                placeholder="Etapa"
                options={opcionesEtapas}
                onSelectionChange={handleEtapasChange}
                selected={etapasSeleccionadas}
                />
            </div>
          </div>

          <hr />
          <div className="row p-3">
            <div className="col-2">
              <p className="text-sans-p-bold ms-2 mb-0">¿El uso de la plataforma o software requirió capacitación?</p>
            </div>
            <div className="col ms-5">
              <RadioButtons
                altA="Si"
                altB="No"
              />
            </div>
          </div>

          <div className="col d-flex align-items-center">
            <button
              className="btn-terciario-ghost"
              onClick={() => eliminarElemento(plataforma.id)}>
              <i className="material-symbols-rounded me-2">delete</i>
              <p className="mb-0 text-decoration-underline">Borrar</p>
            </button>
          </div>
        </div>
      ))}

      <div className="row">
        <div className="p-2">
          {mostrarBotonGuardarPlataforma ? (
            <button className="btn-secundario-s m-2" onClick={() => handleSave(plataformaEnEdicionId, false)}>
              <i className="material-symbols-rounded me-2">save</i>
              <p className="mb-0 text-decoration-underline">Guardar</p>
            </button>
            ) : (
            <button className="btn-secundario-s" onClick={agregarPlataforma}>
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar ficha técnica</p>
            </button>
          )}
        </div>
      </div>

    </div>
  )
};