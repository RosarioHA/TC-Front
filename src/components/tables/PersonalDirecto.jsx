import { useState, useEffect, useContext } from "react";
import DropdownSelect from "../dropdown/select";
import InputCosto from "../forms/input_costo";
import CustomInput from "../forms/custom_input";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormularioContext } from "../../context/FormSectorial";
import { construirValidacionPaso5_Personal } from "../../validaciones/esquemaValidarPaso5Sectorial";

const PersonalDirecto = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  data_personal_directo,
  listado_estamentos,
  listado_calidades_juridicas,
  refetchTrigger
}) => {

  const [personas, setPersonas] = useState([]);
  const [nuevaCalidadJuridica, setNuevaCalidadJuridica] = useState('');
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [mostrarBotonFormulario, setMostrarBotonFormulario] = useState(true);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);
  const [opcionesCalidadJuridica, setOpcionesCalidadJuridica] = useState([]);

  const itemsJustificados = [
    { label: '01 - Personal de Planta', informado: paso5.sub21_total_personal_planta, justificado: paso5.sub21_personal_planta_justificado, por_justificar: paso5.sub21_personal_planta_justificar },
    { label: '02 - Personal de Contrata', informado: paso5.sub21_total_personal_contrata, justificado: paso5.sub21_personal_contrata_justificado, por_justificar: paso5.sub21_personal_contrata_justificar },
    { label: '03 - Otras Remuneraciones', informado: paso5.sub21_total_otras_remuneraciones, justificado: paso5.sub21_otras_remuneraciones_justificado, por_justificar: paso5.sub21_otras_remuneraciones_justificar },
    { label: '04 - Otros Gastos en Personal', informado: paso5.sub21_total_gastos_en_personal, justificado: paso5.sub21_gastos_en_personal_justificado, por_justificar: paso5.sub21_gastos_en_personal_justificar },
  ];

  const relacion_item_calidad = {
    "Planta": "01 - Personal de Planta",
    "Contrata": "02 - Personal de Contrata",
    "Honorario a suma alzada": "03 - Otras Remuneraciones",
    "Honorario asimilado a grado": "04 - Otros Gastos en Personal",
    "Comisión de servicio": "04 - Otros Gastos en Personal",
    "Otro": "04 - Otros Gastos en Personal",
  };

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    // Asegurarse de que el valor es un número. Convertir si es necesario.
    const valorNumerico = Number(numero);
    // Verificar si el valor es un número válido antes de intentar formatearlo
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    // Devolver un valor predeterminado o el mismo valor si no es un número
    return numero;
  };

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

  const arregloCalidadJuridica = Object.entries(personas).map(([calidadJuridica, personas]) => {
    return { calidadJuridica, personas };
  });

  useEffect(() => {
    const esquema = construirValidacionPaso5_Personal(arregloCalidadJuridica);
    setEsquemaValidacion(esquema);
  }, [personas]);

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });


  // Lógica para agregar una nueva persona a calidad juridica existente
  const agregarPersona = async (calidadJuridicaLabel) => {
    // Busca el objeto correspondiente en listado_calidades_juridicas basado en el label
    const calidadJuridicaObjeto = listado_calidades_juridicas.find(cj => cj.calidad_juridica === calidadJuridicaLabel);

    // Asegúrate de que el objeto fue encontrado antes de proceder
    if (!calidadJuridicaObjeto) {
      console.error('Calidad jurídica no encontrada:', calidadJuridicaLabel);
      return; // Termina la ejecución si no se encuentra la calidad jurídica
    }

    const payload = {
      'p_5_3_a_personal_directo': [{
        calidad_juridica: calidadJuridicaObjeto.id,
      }]
    };

    try {
      const response = await handleUpdatePaso(id, stepNumber, payload);

      if (response && response.data.p_5_3_a_personal_directo) {
        const listaActualizadaPersonal = response.data.p_5_3_a_personal_directo;

        const nuevaPersona = {
          ...listaActualizadaPersonal[listaActualizadaPersonal.length - 1], // Extrayendo el último elemento
        };

        // Actualiza el estado inmediatamente con la nueva persona
      setPersonas(prevPersonas => ({
        ...prevPersonas,
        [calidadJuridicaLabel]: [...(prevPersonas[calidadJuridicaLabel] || []), nuevaPersona]
      }));

      } else {
        console.error("La actualización no fue exitosa:", response ? response.message : "Respuesta vacía");
      }
    } catch (error) {
      console.error("Error al agregar la nueva calidad jurídica:", error);
    }   
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
      refetchTrigger();

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


  // Función para recargar campos por separado
  const updateFieldState = (personaId, fieldName, newState) => {
    setPersonas(prevPersonas => {
      const nuevasPersonas = { ...prevPersonas };
      // Iterar sobre cada calidad jurídica
      Object.keys(nuevasPersonas).forEach(calidadJuridica => {
        // Encontrar el índice de la persona a actualizar
        const index = nuevasPersonas[calidadJuridica].findIndex(persona => persona.id === personaId);
        // Si se encuentra la persona, actualizar su estado
        if (index !== -1) {
          nuevasPersonas[calidadJuridica][index] = {
            ...nuevasPersonas[calidadJuridica][index],
            [fieldName]: newState,
          };
        }
      });
      return nuevasPersonas;
    });
  };


  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (personaId, campo, valor) => {
    setPersonas(prevPersonas => {
      const nuevasPersonas = { ...prevPersonas };
      Object.keys(nuevasPersonas).forEach(calidadJuridica => {
        nuevasPersonas[calidadJuridica] = nuevasPersonas[calidadJuridica].map(persona => {
          if (persona.id === personaId) {
            return { ...persona, [campo]: valor };
          }
          return persona;
        });
      });
      return nuevasPersonas;
    });
  };


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


  const mostrarFormulario = () => {
    setMostrarFormularioNuevo(true);
  };

  const agregarNuevaCalidadJuridica = async (calidadJuridicaSeleccionada, labelSeleccionado) => {

    const payload = {
      'p_5_3_a_personal_directo': [{
        calidad_juridica: calidadJuridicaSeleccionada,
        nombre_calidad_juridica: labelSeleccionado
      }]
    };

    try {
      const response = await handleUpdatePaso(id, stepNumber, payload);

      if (response && response.data.p_5_3_a_personal_directo) {
        const listaActualizadaPersonalDirecto = response.data.p_5_3_a_personal_directo;

        const nuevaCalidadJuridicaDatos = {
          ...listaActualizadaPersonalDirecto[listaActualizadaPersonalDirecto.length - 1], // Extrayendo el último elemento
        };

        console.log('listado',nuevaCalidadJuridicaDatos)

        // Actualiza el estado para añadir el nuevo elemento al final
        setPersonas(prevPersonas => {
          // Si ya existen personas con esta calidad jurídica, simplemente añade al final
          const nuevasPersonas = { ...prevPersonas };
          // Asegura que la nueva calidad jurídica se añada al final
          nuevasPersonas[labelSeleccionado] = nuevasPersonas[labelSeleccionado] || [];
          nuevasPersonas[labelSeleccionado].push(nuevaCalidadJuridicaDatos);
          return nuevasPersonas;
        });
        // Limpia los campos del formulario y oculta el formulario
        setNuevaCalidadJuridica('');
        setMostrarFormularioNuevo(false); // Esto oculta el formulario

      } else {
        console.error("La actualización no fue exitosa:", response ? response.message : "Respuesta vacía");
      }
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
    // Convertir personas en un arreglo de sus claves (nombres de las calidades jurídicas)
    const calidadesEnUso = Object.keys(personas);

    // Filtrar listado_calidades_juridicas para excluir las calidades en uso
    const opcionesFiltradas = listado_calidades_juridicas.filter(calidad =>
      !calidadesEnUso.includes(calidad.calidad_juridica)
    );

    // Actualizar opcionesCalidadJuridica con las opciones filtradas
    const opcionesActualizadas = transformarEnOpciones(opcionesFiltradas, 'calidad_juridica');
    setOpcionesCalidadJuridica(opcionesActualizadas);

    // Si no hay más opciones disponibles, ocultar el formulario
    setMostrarBotonFormulario(opcionesActualizadas.length > 0);
  }, [personas, listado_calidades_juridicas]);

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, newValue) => {


    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;

    if (fieldName === 'calidad_juridica') {
      payload = {
        'p_5_3_a_personal_directo': [{
          id: arrayNameId,
          calidad_juridica: newValue,
        }]
      };
    } else if (fieldName === 'descripcion_funciones_personal_directo') {
      payload = {
        'paso5': {
          'descripcion_funciones_personal_directo': newValue,
        }
      };
    } else {

      let personaEncontrada = null;

      Object.values(personas).some(calidadJuridica => {
        const persona = calidadJuridica.find(e => e.id === arrayNameId);
        if (persona) {
          personaEncontrada = persona;
          return true; // Detiene el bucle una vez que se encuentra la persona
        }
        return false;
      });

      // Asegurar que la persona fue encontrada antes de proceder
      if (!personaEncontrada) {
        console.error('Persona no encontrada');
        return; // Termina la ejecución de la función si no se encuentra la persona
      }

      if (fieldName === 'estamento') {
        // Ajuste para enviar 'estamento' como un valor único, no un array
        // Asumiendo que newValue es un objeto de la opción seleccionada
        payload = {
          'p_5_3_a_personal_directo': [{
            id: arrayNameId,
            [fieldName]: newValue.value // Envía el valor seleccionado directamente
          }]
        };
      } else {
        // Payload para otros campos
        payload = {
          'p_5_3_a_personal_directo': [{ id: arrayNameId, [fieldName]: personaEncontrada[fieldName] }]
        };
      }

    }
    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(arrayNameId, fieldName, { loading: false, saved: true });
      refetchTrigger();

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, { type: 'server', message: serverErrors[field][0] });
        });
      }

      updateFieldState(arrayNameId, fieldName, { loading: false, saved: false });
    }
  };

  const onSubmitAgregarPersona = () => {
    agregarPersona();
  };



  return (
    <div className="my-4">

      <div className="col my-4">

        <form onSubmit={handleSubmit(onSubmitAgregarPersona)}>
          {Object.entries(personas).map(([calidad_juridica, personas], index) => (
            <div key={index}>

              <div>
                <span className="text-sans-p-bold mt-4">Calidad Jurídica: </span>
                <span>{calidad_juridica}</span>
              </div>
              {/* Encabezado para cada grupo */}
              <div className="row mt-3">
                <div className="col-1"> <p className="text-sans-p-bold">N°</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Estamento</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Renta bruta mensual ($M)</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Grado <br /> (Si corresponde)</p> </div>
                {!solo_lectura && (
                  <div className="col"> <p className="text-sans-p-bold">Acción</p> </div>
                )}
              </div>
              {personas.map((persona, personaIndex) => (
                <div
                  key={persona.id}
                  className={`row py-3 ${personaIndex % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>

                  <div className="col-1"> <p className="text-sans-p-bold mt-3">{personaIndex + 1}</p> </div>
                  <div className="col">
                    <Controller
                      control={control}
                      name={`estamento_${persona.id}`}
                      render={({ field }) => {
                        return (
                          <DropdownSelect
                            id={`estamento_${persona.id}`}
                            name={`estamento_${persona.id}`}
                            placeholder="Estamento"
                            options={opcionesEstamentos}
                            onSelectionChange={(selectedOption) => {
                              handleSave(persona.id, 'estamento', selectedOption);
                              field.onChange(selectedOption.value);
                            }}

                            readOnly={solo_lectura}
                            selected={persona.estamento_label_value}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="col pt-3">
                    <Controller
                      control={control}
                      name={`renta_bruta_${persona.id}`}
                      defaultValue={persona?.renta_bruta || ''}
                      render={({ field }) => {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) => {
                          clearErrors(`renta_bruta_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'renta_bruta', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () => {
                          const isFieldValid = await trigger(`renta_bruta_${persona.id}`);
                          if (isFieldValid) {
                            handleSave(persona.id, 'renta_bruta');
                          }
                          onBlur();
                        };

                        return (
                          <InputCosto
                            id={`renta_bruta_${persona.id}`}
                            placeholder="Renta bruta (M$)"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={persona.estados?.renta_bruta?.loading ?? false}
                            saved={persona.estados?.renta_bruta?.saved ?? false}
                            error={errors[`renta_bruta_${persona.id}`]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="col pt-3">
                    <Controller
                      control={control}
                      name={`grado_${persona.id}`}
                      defaultValue={persona?.grado || ''}
                      render={({ field }) => {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) => {
                          clearErrors(`grado_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'grado', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () => {
                          const isFieldValid = await trigger(`grado_${persona.id}`);
                          if (isFieldValid) {
                            handleSave(persona.id, 'grado');
                          }
                          onBlur();
                        };

                        return (
                          <CustomInput
                            id={`grado_${persona.id}`}
                            placeholder="Grado"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={persona.estados?.grado?.loading ?? false}
                            saved={persona.estados?.grado?.saved ?? false}
                            error={errors[`grado_${persona.id}`]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>

                  {!solo_lectura && (
                    <div className="col">
                      <button
                        className="btn-terciario-ghost"
                        onClick={() => eliminarPersona(calidad_juridica, persona.id)}
                      >
                        <i className="material-symbols-rounded me-2">delete</i>
                        <p className="mb-0 text-decoration-underline">Borrar</p>
                      </button>
                    </div>
                  )}
                </div>
              ))}



              {!solo_lectura && (
                <button
                  className="btn-secundario-s m-2"
                  onClick={() => agregarPersona(calidad_juridica)}
                >
                  <i className="material-symbols-rounded me-2">add</i>
                  <p className="mb-0 text-decoration-underline">Agregar {personas[0]?.nombre_calidad_juridica}</p>
                </button>
              )}

              {itemsJustificados.map((item, itemIndex) => {
                const itemCorrespondiente = Object.entries(relacion_item_calidad).find(([key, value]) =>
                  (value === item.label && key === calidad_juridica) ||
                  (Array.isArray(value) && value.includes(item.label) && key === calidad_juridica)
                );

                if (itemCorrespondiente) {
                  return (
                    <div key={itemIndex} className="my-4">
                      <p className="text-sans-p-bold">Resumen de justificación de costos de personal directo: {item.label}</p>
                      <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% del costo informado en el punto 5.1a para completar esta sección.</h6>
                      <div className="ps-3 my-4">
                        {/* Encabezado */}
                        <div className="d-flex justify-content-between py-3 fw-bold">
                          <div className="col-2">
                            <p className="text-sans-p-bold">Costo informado ($M)</p>
                          </div>
                          <div className="col-2 d-flex">
                            <p className="text-sans-p-bold">Costo justificado ($M)</p>
                          </div>
                          <div className="col-2 d-flex">
                            <p className="text-sans-p-bold">Diferencia por justificar ($M)</p>
                          </div>
                        </div>
                        {/* Items */}
                        <div className="d-flex justify-content-between py-3 fw-bold">
                          <div className="col-2">
                            <p className="text-sans-p-bold">{formatearNumero(item.informado)}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-sans-p-bold">{formatearNumero(item.justificado)}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-sans-p-bold">{formatearNumero(item.por_justificar)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}

            </div>
          ))}
        </form>
      </div>

      {mostrarFormularioNuevo && (
        <>
          <p>Primero elige la calidad jurídica que quieres agregar:</p>
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
        </>
      )}

      {mostrarBotonFormulario && !solo_lectura && (
        <button
          className="btn-secundario-s m-2"
          onClick={mostrarFormulario}
        >
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar Calidad Juridica</p>
        </button>
      )}


      <div className="mt-5">
        <Controller
          control={control}
          name={`descripcion_funciones_personal_directo`}
          defaultValue={paso5.descripcion_funciones_personal_directo || ''}
          render={({ field }) => {
            // Destructura las propiedades necesarias de field
            const { onChange, onBlur, value } = field;

            const handleChange = (e) => {
              clearErrors(`descripcion_funciones_personal_directo`);
              onChange(e.target.value);
              handleInputChange(null, 'descripcion_funciones_personal_directo', e.target.value);
            };

            // Función para manejar el evento onBlur
            const handleBlur = async () => {
              const isFieldValid = await trigger(`descripcion_funciones_personal_directo`);
              if (isFieldValid) {
                handleSave(null, 'descripcion_funciones_personal_directo', value);
              }
              onBlur();
            };

            return (
              <CustomTextarea
                id={`descripcion_funciones_personal_directo`}
                label="Descripción de funciones"
                placeholder="Describe las funciones asociadas a otras competencias."
                maxLength={1100}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                loading={paso5.descripcion_funciones_personal_directo.estados?.descripcion?.loading ?? false}
                saved={paso5.descripcion_funciones_personal_directo.estados?.descripcion?.saved ?? false}
                error={errors[`descripcion_${paso5.descripcion_funciones_personal_directo.id}`]?.message}
                readOnly={solo_lectura}
              />
            );
          }}
        />
        <div className="d-flex text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6>En el caso de que los/as funcionarios/as identificados/as realicen funciones asociadas a otras competencias, describa brevemente sus características, y si existe relación entre ellas y el ejercicio de la competencia en estudio.</h6>
        </div>
      </div>
    </div>
  )
}

export default PersonalDirecto;