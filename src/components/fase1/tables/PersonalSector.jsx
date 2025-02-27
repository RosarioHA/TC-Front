import { useState, useEffect, useContext } from "react";
import DropdownSelect from "../dropdown/select";
import InputCosto from "../forms/input_costo";
import CustomInput from "../forms/custom_input";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormularioContext } from "../../../context/FormSectorial";
import { construirValidacionPaso5_Personal } from "../../../validaciones/fase1/esquemaValidarPaso5Sectorial";

const PersonalSectorial = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  data_personal,
  listado_estamentos,
  listado_calidades_juridicas,
  region,
  prefix,
  payloadModel,
  descripcionModelo,
  personalPendiente
}) =>
{

  // Verificar que paso5 no sea null o undefined y proporcionar valores por defecto
  const paso5Data = Array.isArray(paso5) && paso5.length > 0 ? paso5[ 0 ] : {};
  const [ personas, setPersonas ] = useState([]);
  const [ nuevaCalidadJuridica, setNuevaCalidadJuridica ] = useState('');
  const [ mostrarFormularioNuevo, setMostrarFormularioNuevo ] = useState(false);
  const [ mostrarBotonFormulario, setMostrarBotonFormulario ] = useState(true);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [ esquemaValidacion, setEsquemaValidacion ] = useState(null);

  const [ opcionesEstamentos, setOpcionesEstamentos ] = useState([]);
  const [ opcionesCalidadJuridica, setOpcionesCalidadJuridica ] = useState([]);
  const [ inputStatus, setInputStatus ] = useState({});
  const [ descripcionLoading, setDescripcionLoading ] = useState(false);
  const [ descripcionSaved, setDescripcionSaved ] = useState(false);

  const itemsJustificados = [
    { label: '01 - Personal de Planta', informado: paso5Data[ `${prefix}_total_personal_planta` ], justificado: paso5Data[ `${prefix}_personal_planta_justificado` ], por_justificar: paso5Data[ `${prefix}_personal_planta_justificar` ] },
    { label: '02 - Personal de Contrata', informado: paso5Data[ `${prefix}_total_personal_contrata` ], justificado: paso5Data[ `${prefix}_personal_contrata_justificado` ], por_justificar: paso5Data[ `${prefix}_personal_contrata_justificar` ] },
    { label: '03 - Otras Remuneraciones', informado: paso5Data[ `${prefix}_total_otras_remuneraciones` ], justificado: paso5Data[ `${prefix}_otras_remuneraciones_justificado` ], por_justificar: paso5Data[ `${prefix}_otras_remuneraciones_justificar` ] },
    { label: '04 - Otros Gastos en Personal', informado: paso5Data[ `${prefix}_total_gastos_en_personal` ], justificado: paso5Data[ `${prefix}_gastos_en_personal_justificado` ], por_justificar: paso5Data[ `${prefix}_gastos_en_personal_justificar` ] },
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
  const formatearNumero = (numero) =>
  {
    // Asegurarse de que el valor es un número. Convertir si es necesario.
    const valorNumerico = Number(numero);
    // Verificar si el valor es un número válido antes de intentar formatearlo
    if (!isNaN(valorNumerico))
    {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    // Devolver un valor predeterminado o el mismo valor si no es un número
    return numero;
  };

  // Función para agrupar los datos por organismo_display
  const agruparPorCalidadJuridica = (datos) =>
  {
    const agrupados = datos.reduce((acc, item) =>
    {
      const displayKey = item.nombre_calidad_juridica;
      acc[ displayKey ] = acc[ displayKey ] || [];
      acc[ displayKey ].push(item);
      return acc;
    }, {});

    setPersonas(agrupados);
  };

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() =>
  {
    agruparPorCalidadJuridica(data_personal);
  }, [ data_personal ]);

  const arregloCalidadJuridica = Object.entries(personas).map(([ calidadJuridica, personas ]) =>
  {
    return { calidadJuridica, personas };
  });

  useEffect(() =>
  {
    const esquema = construirValidacionPaso5_Personal(arregloCalidadJuridica);
    setEsquemaValidacion(esquema);
  }, [ personas ]);

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });


  const agregarPersona = async (calidadJuridicaLabel) =>
  {
    // Busca el objeto correspondiente en listado_calidades_juridicas basado en el label
    const calidadJuridicaObjeto = listado_calidades_juridicas.find(cj => cj.calidad_juridica === calidadJuridicaLabel);

    // Asegúrate de que el objeto fue encontrado antes de proceder
    if (!calidadJuridicaObjeto)
    {
      console.error('Calidad jurídica no encontrada:', calidadJuridicaLabel);
      return; // Termina la ejecución si no se encuentra la calidad jurídica
    }

    const payload = {
      regiones: [
        {
          region: region,
          [ payloadModel ]: [ {
            calidad_juridica: calidadJuridicaObjeto.id,
          } ],
        },
      ],
    };

    try
    {
      const response = await handleUpdatePaso(id, stepNumber, payload);

      if (response && response.data[ payloadModel ])
      {
        const listaActualizadaPersonal = response.data[ payloadModel ];

        const nuevaPersona = {
          ...listaActualizadaPersonal[ listaActualizadaPersonal.length - 1 ], // Extrayendo el último elemento
        };

        // Actualiza el estado inmediatamente con la nueva persona
        setPersonas(prevPersonas => ({
          ...prevPersonas,
          [ calidadJuridicaLabel ]: [ ...(prevPersonas[ calidadJuridicaLabel ] || []), nuevaPersona ]
        }));

      } else
      {
        console.error("La actualización no fue exitosa:", response ? response.message : "Respuesta vacía");
      }
    } catch (error)
    {
      console.error("Error al agregar la nueva calidad jurídica:", error);
    }
  };


  // Lógica para eliminar una fila de un organismo
  const eliminarPersona = async (persona, idFila) =>
  {
    const payload = {
      regiones: [
        {
          region: region,
          [ payloadModel ]: [ {
            id: idFila,
            DELETE: true
          } ]
        }
      ]
    };

    try
    {
      // Llamar a la API para actualizar los datos
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualizar el estado local para reflejar la eliminación
      setPersonas(prevPersonas =>
      {
        const filasActualizadas = prevPersonas[ persona ].filter(fila => fila.id !== idFila);

        // Si después de la eliminación no quedan filas, eliminar también el organismo
        if (filasActualizadas.length === 0)
        {
          const nuevasPersonas = { ...prevPersonas };
          delete nuevasPersonas[ persona ];
          return nuevasPersonas;
        }

        return {
          ...prevPersonas,
          [ persona ]: filasActualizadas
        };
      });

    } catch (error)
    {
      console.error("Error al eliminar la fila:", error);
    }
  };

  // Manejadora de CustomInput, CustomTextArea y DropdownSelect
  const handleInputChange = (personaId, campo, valor) =>
  {
    setPersonas(prevPersonas =>
    {
      return Object.fromEntries(
        Object.entries(prevPersonas).map(([ calidadJuridica, personas ]) => [
          calidadJuridica,
          personas.map(persona =>
          {
            if (persona.id === personaId)
            {
              // Si el campo es un objeto (como en DropdownSelect), guardamos su valor
              const newValue = typeof valor === 'object' ? valor.value : valor;
              return { ...persona, [ campo ]: newValue };
            }
            return persona;
          })
        ])
      );
    });
  };

  const manejarDropdownCalidadJuridica = (opcionSeleccionada) =>
  {
    setNuevaCalidadJuridica(opcionSeleccionada);
    setMostrarFormularioNuevo(false);
  };

  useEffect(() =>
  {
    if (nuevaCalidadJuridica)
    {
      const ejecutarAgregarNuevaCalidadJuridica = async () =>
      {
        await agregarNuevaCalidadJuridica(nuevaCalidadJuridica.value, nuevaCalidadJuridica.label);
      };
      ejecutarAgregarNuevaCalidadJuridica();
    }
  }, [ nuevaCalidadJuridica ]);


  const agregarNuevaCalidadJuridica = async (calidadJuridicaSeleccionada, labelSeleccionado) =>
  {
    const payload = {
      regiones: [
        {
          region: region,
          [ payloadModel ]: [ {
            calidad_juridica: calidadJuridicaSeleccionada,
            nombre_calidad_juridica: labelSeleccionado
          } ]
        }
      ]
    };

    try
    {
      const response = await handleUpdatePaso(id, stepNumber, payload);
      if (response && response.data[ payloadModel ])
      {
        const listaActualizadaPersonal = response.data[ payloadModel ];
        const nuevaCalidadJuridicaDatos = {
          ...listaActualizadaPersonal[ listaActualizadaPersonal.length - 1 ], // Extrayendo el último elemento
        };

        setPersonas(prevPersonas =>
        {
          const nuevasPersonas = { ...prevPersonas };
          nuevasPersonas[ labelSeleccionado ] = nuevasPersonas[ labelSeleccionado ] || [];
          nuevasPersonas[ labelSeleccionado ].push(nuevaCalidadJuridicaDatos);
          return nuevasPersonas;
        });

        // Limpia los campos del formulario y oculta el formulario
        setNuevaCalidadJuridica('');
        setMostrarFormularioNuevo(false);

      } else
      {
        console.error("La actualización no fue exitosa:", response ? response.message : "Respuesta vacía");
      }
    } catch (error)
    {
      console.error("Error al agregar la nueva calidad jurídica:", error);
    }
  };

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) =>
  {
    return datos.map(dato => ({
      label: dato[ propiedadLabel ], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString()
    }));
  };

  // Efecto para manejar la carga inicial de opciones
  useEffect(() =>
  {
    if (listado_estamentos)
    {
      const opcionesDeEstamentos = transformarEnOpciones(listado_estamentos, 'estamento');
      setOpcionesEstamentos(opcionesDeEstamentos);
    }
  }, [ listado_estamentos ]);

  useEffect(() =>
  {
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
  }, [ personas, listado_calidades_juridicas ]);

  const startSavingField = (fieldId) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ fieldId ]: {
        loading: true,
        saved: false
      },
    }));
  };

  const finishSavingField = (fieldId, success) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ fieldId ]: {
        loading: false,
        saved: success
      },
    }));
  };

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, newValue) =>
  {
    const fieldId = `${fieldName}_${arrayNameId}`;
    startSavingField(fieldId);

    let payload = createPayload(fieldName, arrayNameId, newValue);
    if (!payload)
    {
      console.error('Error al crear el payload');
      setError(fieldId, { type: 'manual', message: 'Error al crear el payload. Intenta de nuevo.' });
      finishSavingField(fieldId, false);
      return;
    }

    const nullField = containsNull(payload);
    if (nullField)
    {
      setError(`${nullField}_${arrayNameId}`, { type: 'manual', message: 'Error de guardado. Borra e ingresa el dato otra vez.' });
      finishSavingField(fieldId, false);
      return; // Terminar ejecución si se encuentra un valor null
    }

    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      finishSavingField(fieldId, true);
      updateUIStates(fieldName, true);
    } catch (error)
    {
      console.error(`Error al guardar los datos para el campo ${fieldName}:`, error);
      handleServerError(error);
      finishSavingField(fieldId, false);
      updateUIStates(fieldName, false);
    }
  };


  function containsNull(obj, parentKey = '')
  {
    if (obj === null) return parentKey; // Retorna la clave padre si el valor es null
    if (typeof obj === 'object')
    {
      for (const key in obj)
      {
        // Uso de hasOwnProperty mediante Object.prototype.call para evitar problemas de prototipo
        if (Object.prototype.hasOwnProperty.call(obj, key))
        {
          const result = containsNull(obj[ key ], key);
          if (result) return result; // Retorna el nombre del campo que tiene el valor nulo
        }
      }
    }
    return false;
  }


  function createPayload(fieldName, arrayNameId, newValue)
  {
    const personaEncontrada = findPersona(arrayNameId);

    switch (fieldName)
    {
      case 'calidad_juridica':
        return {
          regiones: [ { region, [ payloadModel ]: [ { id: arrayNameId, calidad_juridica: newValue } ] } ]
        };
      case `descripcion_funciones_personal_${descripcionModelo}`:
        return {
          regiones: [ { region, paso5: [ { id: arrayNameId, [ `descripcion_funciones_personal_${descripcionModelo}` ]: newValue } ] } ]
        };
      case 'estamento':
        return {
          regiones: [ { region, [ payloadModel ]: [ { id: arrayNameId, [ fieldName ]: newValue.value } ] } ]
        };
      default:
        if (!personaEncontrada)
        {
          console.error('Persona no encontrada');
          return null;
        }
        return {
          regiones: [ { region, [ payloadModel ]: [ { id: arrayNameId, [ fieldName ]: personaEncontrada[ fieldName ] } ] } ]
        };
    }
  }

  function findPersona(arrayNameId)
  {
    for (const calidadJuridica of Object.values(personas))
    {
      const persona = calidadJuridica.find(e => e.id === arrayNameId);
      if (persona) return persona;
    }
    return null;
  }

  function handleServerError(error)
  {
    if (error.response && error.response.data.errors)
    {
      const serverErrors = error.response.data.errors;
      Object.keys(serverErrors).forEach(field =>
      {
        setError(field, { type: 'server', message: serverErrors[ field ][ 0 ] });
      });
    }
  }

  function updateUIStates(fieldName, isSuccessful)
  {
    if (fieldName.startsWith('descripcion_funciones_personal_'))
    {
      setDescripcionLoading(false);
      setDescripcionSaved(isSuccessful);
    }
  }

  const onSubmitAgregarPersona = () =>
  {
    agregarPersona();
  };

  const ColumnHeaders = ({ descripcionModelo, soloLectura }) =>
  {
    return (
      <div className="row mt-3">
        <div className="col-1"> <p className="text-sans-p-bold">N°</p> </div>
        <div className={descripcionModelo === "directo" ? "col" : "col-2"}>
          <p className="text-sans-p-bold">Estamento</p>
        </div>
        {descripcionModelo === "indirecto" && (
          <div className="col"> <p className="text-sans-p-bold">N° de personas</p> </div>
        )}
        <div className="col"> <p className="text-sans-p-bold">Renta bruta mensual ($M)</p> </div>
        {descripcionModelo === "indirecto" && (
          <div className="col"> <p className="text-sans-p-bold">Total rentas</p> </div>
        )}
        <div className="col"> <p className="text-sans-p-bold">Grado <br /> (Si corresponde)</p> </div>
        {descripcionModelo === "directo" && !soloLectura && (
          <div className="col"> <p className="text-sans-p-bold">Acción</p> </div>
        )}
        {descripcionModelo === "indirecto" && !soloLectura && (
          <div className="col d-none d-xxl-block"> <p className="text-sans-p-bold">Acción</p> </div>
        )}
      </div>
    );
  };

  function MensajeErrorPresupuesto({ por_justificar })
  {
    if (por_justificar == 0)
    {
      return <p></p>
    } else
    {
      return <p className="col-3 text-sans-h6-bold-darkred">Debes justificar el total del costo</p>;
    }
  }

  return (
    <div className="my-4">
      <div className="col my-4">

        <form onSubmit={handleSubmit(onSubmitAgregarPersona)}>
          {Object.entries(personas).map(([ calidad_juridica, personas ], index) => (
            <div key={index}>

              <div>
                <span className="text-sans-p-bold mt-4">Calidad Jurídica: </span>
                <span>{calidad_juridica}</span>
              </div>

              {/* Encabezado para cada grupo */}
              <ColumnHeaders descripcionModelo={descripcionModelo} soloLectura={solo_lectura} />

              {personas.map((persona, personaIndex) => (
                <div
                  key={persona.id}
                  className={`row py-3 ${personaIndex % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>

                  <div className="col-1"> <p className="text-sans-p-bold mt-3">{personaIndex + 1}</p> </div>
                  <div className="col-3 col-xxl">
                    <Controller
                      control={control}
                      name={`estamento_${persona.id}`}
                      render={({ field }) =>
                      {
                        return (
                          <DropdownSelect
                            id={`estamento_${persona.id}`}
                            name={`estamento_${persona.id}`}
                            placeholder="Estamento"
                            options={opcionesEstamentos}
                            onSelectionChange={(selectedOption) =>
                            {
                              // Primero, actualizar el estado local del formulario
                              field.onChange(selectedOption.value);
                              // Segundo, actualizar el estado global de personas
                              handleInputChange(persona.id, 'estamento', selectedOption.value);
                              // Finalmente, guardar el cambio
                              handleSave(persona.id, 'estamento', selectedOption);
                            }}
                            readOnly={solo_lectura}
                            selected={persona.estamento_label_value}
                          />
                        );
                      }}
                    />

                  </div>

                  {descripcionModelo === "indirecto" && (
                    <div className="col-2 col-xxl">
                      <Controller
                        control={control}
                        name={`numero_personas_${persona.id}`}
                        defaultValue={persona?.numero_personas || ''}
                        render={({ field }) =>
                        {
                          // Destructura las propiedades necesarias de field
                          const { onChange, onBlur, value } = field;

                          const handleChange = (valor) =>
                          {
                            clearErrors(`numero_personas_${persona.id}`);
                            onChange(valor);
                            handleInputChange(persona.id, 'numero_personas', valor);
                          };

                          // Función para manejar el evento onBlur
                          const handleBlur = async () =>
                          {
                            const isFieldValid = await trigger(`numero_personas_${persona.id}`);
                            if (isFieldValid)
                            {
                              handleSave(persona.id, 'numero_personas');
                            }
                            onBlur();
                          };

                          return (
                            <InputCosto
                              id={`numero_personas_${persona.id}`}
                              placeholder="N° personas"
                              value={value}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              loading={inputStatus[ `numero_personas_${persona.id}` ]?.loading ?? false}
                              saved={inputStatus[ `numero_personas_${persona.id}` ]?.saved ?? false}
                              error={errors[ `numero_personas_${persona.id}` ]?.message}
                              disabled={solo_lectura}
                            />
                          );
                        }}
                      />
                    </div>
                  )}

                  <div className="col-2 col-xxl">
                    <Controller
                      control={control}
                      name={`renta_bruta_${persona.id}`}
                      defaultValue={persona?.renta_bruta || ''}
                      render={({ field }) =>
                      {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) =>
                        {
                          clearErrors(`renta_bruta_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'renta_bruta', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () =>
                        {
                          const isFieldValid = await trigger(`renta_bruta_${persona.id}`);
                          if (isFieldValid)
                          {
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
                            loading={inputStatus[ `renta_bruta_${persona.id}` ]?.loading ?? false}
                            saved={inputStatus[ `renta_bruta_${persona.id}` ]?.saved ?? false}
                            error={errors[ `renta_bruta_${persona.id}` ]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>

                  {descripcionModelo === "indirecto" && (
                    <div className="col d-flex justify-content-center">
                      <p className="text-sans-p-blue mb-0">{formatearNumero(persona.total_rentas)}</p>
                    </div>
                  )}

                  <div className="col">
                    <Controller
                      control={control}
                      name={`grado_${persona.id}`}
                      defaultValue={persona?.grado || ''}
                      render={({ field }) =>
                      {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) =>
                        {
                          clearErrors(`grado_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'grado', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () =>
                        {
                          const isFieldValid = await trigger(`grado_${persona.id}`);
                          if (isFieldValid)
                          {
                            handleSave(persona.id, 'grado');
                          }
                          onBlur();
                        };

                        const handleKeyDown = (e) =>
                        {
                          if (e.key === 'Enter')
                          {
                            e.preventDefault();
                          }
                        };

                        return (
                          <CustomInput
                            id={`grado_${persona.id}`}
                            placeholder="Grado"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            loading={inputStatus[ `grado_${persona.id}` ]?.loading ?? false}
                            saved={inputStatus[ `grado_${persona.id}` ]?.saved ?? false}
                            error={errors[ `grado_${persona.id}` ]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>

                  {descripcionModelo === "directo" && !solo_lectura && (
                    <div className="col">
                      <button
                        className="btn-terciario-ghost mt-2"
                        onClick={() => eliminarPersona(calidad_juridica, persona.id)}
                      >
                        <i className="material-symbols-rounded me-2">delete</i>
                        <p className="mb-0 text-decoration-underline">Borrar</p>
                      </button>
                    </div>
                  )}
                  {descripcionModelo === "indirecto" && !solo_lectura && (
                    <div className="col-5 col-xxl">
                      <button
                        className="btn-terciario-ghost mt-2"
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
                  <p className="mb-0 text-decoration-underline">Agregar {personas[ 0 ]?.nombre_calidad_juridica}</p>
                </button>
              )}

              {itemsJustificados.map((item, itemIndex) =>
              {
                const itemCorrespondiente = Object.entries(relacion_item_calidad).find(([ key, value ]) =>
                  (value === item.label && key === calidad_juridica) ||
                  (Array.isArray(value) && value.includes(item.label) && key === calidad_juridica)
                );

                const counterClass = (item.por_justificar) == 0
                  ? "text-sans-p-bold"
                  : "text-sans-h6-bold-darkred";

                if (itemCorrespondiente)
                {
                  return (
                    <div key={itemIndex} className="my-4">
                      <div className="subrayado col-12 h-auto">
                        <span className="py-2 ps-2 my-2 align-self-center text-sans-p-bold">
                          Resumen de justificación de costos de personal {descripcionModelo === "directo" ? "directo" : "indirecto"}: {item.label}
                        </span>
                      </div>
                      <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% del costo informado en el punto {descripcionModelo === "directo" ? "5.1a" : "5.1b"} para completar esta sección.</h6>
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
                        <div className="d-flex justify-content-between pt-3 fw-bold">
                          <div className="col-2">
                            <p className="text-sans-p-bold">{formatearNumero(item.informado)}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-sans-p-bold">{formatearNumero(item.justificado)}</p>
                          </div>
                          <div className="col-2">
                            <p className={counterClass}>{formatearNumero(item.por_justificar)}</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end p-0 m-0">
                          <MensajeErrorPresupuesto
                            por_justificar={item.por_justificar}
                          />
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
      {personalPendiente.length >= 1 ? (
        <>
          <h6 className="text-sans-h6-primary mt-3">Te recordamos que estos son los subtítulos para los que debes justificar personal:</h6>
          <div className="d-flex ">
            {personalPendiente.map((item, index) => (
              <div key={index} className="badge-info mx-2 my-2">{item}</div>))}
          </div></>) : ("")}

      {mostrarFormularioNuevo && (
        <>
          <p>Primero elige la calidad jurídica que quieres agregar:</p>
          <div className="row">
            <div className="col-2">
              <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
            </div>
            <div className="col-3">
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
          onClick={() => setMostrarFormularioNuevo(true)}
        >
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar Calidad Juridica</p>
        </button>
      )}


      <div className="mt-5">
        <Controller
          control={control}
          name={`descripcion_funciones_personal_${descripcionModelo}`}
          defaultValue={paso5Data.descripcion_funciones_personal_directo || ''}
          render={({ field }) =>
          {
            // Destructura las propiedades necesarias de field
            const { onChange, onBlur, value } = field;

            const handleChange = (e) =>
            {
              clearErrors(`descripcion_funciones_personal_${descripcionModelo}`);
              onChange(e.target.value);
              handleInputChange(paso5Data.id, 'descripcion_funciones_personal_directo', e.target.value);
            };

            // Función para manejar el evento onBlur
            const handleBlur = async () =>
            {
              const isFieldValid = await trigger(`descripcion_funciones_personal_${descripcionModelo}`);
              if (isFieldValid)
              {
                handleSave(paso5Data.id, `descripcion_funciones_personal_${descripcionModelo}`, value);
              }
              onBlur();
            };

            return (
              <CustomTextarea
                id={`descripcion_funciones_personal_${descripcionModelo}`}
                label="Descripción de funciones (Opcional)"
                placeholder="Describe las funciones asociadas a otras competencias."
                maxLength={1100}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                loading={descripcionLoading}
                saved={descripcionSaved}
                error={errors[ `descripcion_funciones_personal_${descripcionModelo}` ]?.message}
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

export default PersonalSectorial;