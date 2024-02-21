import { useState, useEffect, useContext } from "react";
import DropdownSelect from "../dropdown/select";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormularioContext } from "../../context/FormSectorial";

const PersonalDirecto = ({
  id,
  paso5,
  formulario_enviado,
  stepNumber,
  data_personal_directo,
  listado_estamentos,
  listado_calidades_juridicas
}) => {

  const [personas, setPersonas] = useState([]);
  const [nuevaCalidadJuridica, setNuevaCalidadJuridica] = useState('');
  const [ mostrarFormularioNuevo, setMostrarFormularioNuevo ] = useState(false);
  const [nuevaPersonaCalJuridica, setNuevaPersonaCalJuridica] = useState('');
  const [nuevaPersonaEstamento, setNuevaPersonaEstamento] = useState('');
  const [nuevaPersonaRentaBruta, setNuevaPersonaRentaBruta] = useState('');
  const [nuevaPersonaGrado, setNuevaPersonaGrado] = useState('');
  const [ultimaFilaId, setUltimaFilaId] = useState(null);
  const { handleUpdatePaso } = useContext(FormularioContext);

  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);
  const [opcionesCalidadJuridica, setOpcionesCalidadJuridica] = useState([]);

  const [calidadJuridica, setCalidadJuridica] = useState([{ id: 1 }]);
  const [mostrarSeccionDinamica, setMostrarSeccionDinamica] = useState(false);

  // Función para agrupar los datos por organismo_display
  const agruparPorCalidadJuridica = (datos) => {
    const agrupados = datos.reduce((acc, item) => {
      const displayKey = item.nombre_calidad_juridica;
      acc[displayKey] = acc[displayKey] || [];
      acc[displayKey].push(item);
      return acc;
    }, {});

    setPersonas(agrupados);
  };

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() => {
    agruparPorCalidadJuridica(data_personal_directo);
  }, [data_personal_directo]);

  /*useEffect(() => {
    const esquema = construirValidacionPaso5_1ab(costosIndirectos);
    setEsquemaValidacion(esquema);
  }, [costosIndirectos]);*/

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    //resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  // Lógica para agregar una nueva calidad juridica
  const agregarPersona = (persona) => {
    const nuevaFilaId = Math.floor(Date.now() / 1000);

    const calidadJuridica = opcionesCalidadJuridica[persona] || "ValorPorDefectoSiNoExiste";

    setUltimaFilaId(nuevaFilaId);
    const nuevaFila = {
      id: nuevaFilaId,
      calidad_juridica: calidadJuridica,
      estamento: [],
      renta_bruta: null,
      grado: null
    };
    setPersonas(prevPersonas => ({
      ...prevPersonas,
      [persona]: [...prevPersonas[persona], nuevaFila]
    }));
  };

  // Lógica para eliminar una fila de un organismo
  const eliminarPersona = async (persona, idFila) => {
    const payload = {
      'p_5_3_a_personal_directo': [{
        id: idFila,
        DELETE: true
      }]
    };

    try {
      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualizar el estado local para reflejar la eliminación
      setPersonas(prevPersonas => {
        const filasActualizadas = prevPersonas[persona].filter(fila => fila.id !== idFila);

        // Si después de la eliminación no quedan filas, eliminar también el organismo
        if (filasActualizadas.length === 0) {
          const nuevasPersonas = { ...prevPersonas };
          delete nuevasPersonas[persona];
          return nuevasPersonas;
        }

        return {
          ...prevPersonas,
          [persona]: filasActualizadas
        };
      });

    } catch (error) {
      console.error("Error al eliminar la fila:", error);
    }
  };

  /*

  // Función para recargar campos por separado
  const updateFieldState = (costoDirectoId, fieldName, newState) => {
    setCostosDirectos(prevCostosDirectos =>
      prevCostosDirectos.map(costoDirecto => {
        if (costoDirecto.id === costoDirectoId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...costoDirecto.estados, [fieldName]: { ...newState } };
          return { ...costoDirecto, estados: updatedEstados };
        }
        return costoDirecto;
      })
    );
  };


  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (costoDirectoId, campo, valor) => {
    setCostosDirectos(prevCostosDirectos =>
      prevCostosDirectos.map(costoDirecto => {
        // Verifica si es la costo que estamos actualizando
        if (costoDirecto.id === costoDirectoId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...costoDirecto, [campo]: valor };
        }
        // Si no es la costo que estamos actualizando, la retorna sin cambios
        return costoDirecto;
      })
    );
  };

  */

  const manejarDropdownCalidadJuridica = (opcionSeleccionada) => {
    setNuevaCalidadJuridica(opcionSeleccionada);
  };
  

  useEffect(() => {
    if (nuevaCalidadJuridica) {
      const ejecutarAgregarNuevaCalidadJuridica = async () => {
        await agregarNuevaCalidadJuridica(nuevaCalidadJuridica.value, nuevaCalidadJuridica.label);
      };
      ejecutarAgregarNuevaCalidadJuridica();
    }
  }, [nuevaCalidadJuridica]); 
  

  const mostrarFormulario = () =>
  {
    setMostrarFormularioNuevo(true);
  };

  const agregarNuevaCalidadJuridica = async (calidadJuridicaSeleccionada, labelSeleccionado) => {
    const nuevaCalidadJuridicaDatos = {
      id: Math.floor(Date.now() / 1000),
      calidad_juridica: calidadJuridicaSeleccionada,
      nombre_calidad_juridica: labelSeleccionado
    };
  
    const payload = {
      'p_5_3_a_personal_directo': [nuevaCalidadJuridicaDatos]
    };
  
    try {
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado para añadir el nuevo elemento
  setPersonas(prevPersonas => {
    // Si ya existen personas con esta calidad jurídica, añádelas al final
    const nuevasPersonas = { ...prevPersonas };
    if (!nuevasPersonas[calidadJuridicaSeleccionada]) {
      nuevasPersonas[calidadJuridicaSeleccionada] = [];
    }
    // Añade la nueva persona al final del array existente
    nuevasPersonas[calidadJuridicaSeleccionada].push(nuevaCalidadJuridicaDatos);
    
    return nuevasPersonas;
  })
      // Limpia los campos del formulario y oculta el formulario
      setNuevaCalidadJuridica('');
      setMostrarFormularioNuevo(false); // Esto oculta el formulario
    } catch (error) {
      console.error("Error al agregar la nueva calidad jurídica:", error);
    }
  };

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map(dato => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString()
    }));
  };

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_estamentos) {
      const opcionesDeEstamentos = transformarEnOpciones(listado_estamentos, 'estamento');
      setOpcionesEstamentos(opcionesDeEstamentos);
    }
  }, [listado_estamentos]);

  useEffect(() => {
    if (listado_calidades_juridicas) {
      const opcionesDeCalidadJuridica = transformarEnOpciones(listado_calidades_juridicas, 'calidad_juridica');
      setOpcionesCalidadJuridica(opcionesDeCalidadJuridica);
    }
  }, [listado_calidades_juridicas]);

  // Función para manejar la adición de una nueva calidad jurídica
  useEffect(() => {
    const calidadesConPersonas = Object.keys(personas);
    const calidadesSinPersonas = listado_calidades_juridicas.filter(({ calidad_juridica }) => 
      !calidadesConPersonas.includes(calidad_juridica)
    ).map(({ id, calidad_juridica }) => ({
      label: calidad_juridica,
      value: id.toString()
    }));
  
    setOpcionesCalidadJuridica(calidadesSinPersonas);
  
    // Si ya no quedan calidades jurídicas sin asignar, ocultar el formulario
    if (calidadesSinPersonas.length === 0) {
      setMostrarFormularioNuevo(false);
    }
  }, [personas, listado_calidades_juridicas]);
  
  



  return (
    <div className="my-4">

      <p className="text-sans-m-semibold mt-4">a. Personal que ejerce directamente la competencia</p>
      <h6 className="text-sans-h6-primary mt-3">Por ejercicio directo se entenderán todas aquellas tareas y procedimientos específicos y exclusivos de la competencia. En la renta bruta se deben considerar aquellas asignaciones propias del cargo. </h6>


      <div className="col my-4">
        {/* Renderiza automáticamente basado en la presencia de datos en personas */}
        {Object.entries(personas).map(([calidad_juridica, personas], index) => (
          <div key={index}>

            <p className="text-sans-p-bold mt-3">Calidad Jurídica</p><p>{personas[0]?.nombre_calidad_juridica}</p>
            {/* Encabezado para cada grupo */}
            <div className="row">
              <div className="col-1"> <p className="text-sans-p-bold">N°</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Estamento</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Renta bruta mensual</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Grado <br /> (Si corresponde)</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Acción</p> </div>
            </div>
            {personas.map((persona, personaIndex) => (
              <div
                key={persona.id}
                className={`row py-3 ${personaIndex % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>

                <div className="col-1"> <p className="text-sans-p-bold mt-3">{personaIndex + 1}</p> </div>
                <div className="col">
                  <Controller
                    control={control}
                    name={`estamento`}
                    render={() => {
                      return (
                        <DropdownSelect
                          id={`estamento`}
                          defaultValue={persona.nombre_estamento}
                          name={`estamento`}
                          placeholder="Estamento"
                          options={opcionesEstamentos}
                          onSelectionChange={(selectedOption) => {
                            setCalidadJuridica(selectedOption);
                            setMostrarSeccionDinamica(true);
                          }}

                          readOnly={formulario_enviado}
                        />
                      );
                    }}
                  />
                </div>
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center" defaultValue={persona.renta_bruta} />
                </div>
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center" defaultValue={persona.grado} />
                </div>
                <div className="col">
                  <button
                    className="btn-terciario-ghost"
                    onClick={() => eliminarPersona(calidad_juridica, persona.id)}
                  >
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">Borrar</p>
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn-secundario-s m-2"
              onClick={() => agregarPersona(calidad_juridica)}
            >
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar {personas[0]?.nombre_calidad_juridica}</p>
            </button>
          </div>
        ))}
      </div>

      {mostrarFormularioNuevo && (
        <div className="row">
          <div className="col-1">
            <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
          </div>
          <div className="col-2">
            <DropdownSelect
              placeholder="Calidad Jurídica"
              options={opcionesCalidadJuridica}
              onSelectionChange={manejarDropdownCalidadJuridica}
              />
          </div>
        </div>
      )}


      <button
        className="btn-secundario-s m-2"
        onClick={mostrarFormulario}
      >
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Calidad Juridica</p>
      </button>


      <div className="mt-5">
        <CustomTextarea
          label="Descripción de funciones"
          placeholder="Describe las funciones asociadas a otras competencias"
          maxLength={1100} />
        <div className="d-flex text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6>En el caso de que los/as funcionarios/as identificados/as realicen funciones asociadas a otras competencias, describa brevemente sus características, y si existe relación entre ellas y el ejercicio de la competencia en estudio.</h6>
        </div>
      </div>


    </div>


  )
}

export default PersonalDirecto;