import { useState, useEffect, useContext } from 'react';
import DropdownSelect from '../../dropdown/select';
import InputCosto from '../../forms/input_costo';
import CustomInput from '../../forms/custom_input';
import { FormGOREContext } from '../../../context/FormGore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionesCalidadJuridica } from '../../../validaciones/esquemaPersonalGore';

export const AgregarPersonal = ({
  solo_lectura,
  calidadJuridica,
  personalGore,
  estamentos,
  seccion,
  idCalidad,
  dataPersonal,
  title,
  prefix
}) =>
{
  const [ nuevoPersonal, setNuevoPersonal ] = useState([]);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [ opcionesEstamentos, setOpcionesEstamentos ] = useState([]);

  const itemsJustificados = [
    { label: '01 - Personal de Planta', informado: dataPersonal[ `${prefix}_total_personal_planta` ], justificado: dataPersonal[ `${prefix}_personal_planta_justificado` ], por_justificar: dataPersonal[ `${prefix}_personal_planta_justificar` ] },
    { label: '02 - Personal de Contrata', informado: dataPersonal[ `${prefix}_total_personal_contrata` ], justificado: dataPersonal[ `${prefix}_personal_contrata_justificado` ], por_justificar: dataPersonal[ `${prefix}_personal_contrata_justificar` ] },
    { label: '03 - Otras Remuneraciones', informado: dataPersonal[ `${prefix}_total_otras_remuneraciones` ], justificado: dataPersonal[ `${prefix}_otras_remuneraciones_justificado` ], por_justificar: dataPersonal[ `${prefix}_otras_remuneraciones_justificar` ] },
    { label: '04 - Otros Gastos en Personal', informado: dataPersonal[ `${prefix}_total_gastos_en_personal` ], justificado: dataPersonal[ `${prefix}_gastos_en_personal_justificado` ], por_justificar: dataPersonal[ `${prefix}_gastos_en_personal_justificar` ] },
  ];

  const relacion_item_calidad = {
    "Planta": "01 - Personal de Planta",
    "Contrata": "02 - Personal de Contrata",
    "Honorario a suma alzada": "03 - Otras Remuneraciones",
    "Honorario asimilado a grado": "04 - Otros Gastos en Personal",
    "Comisión de servicio": "04 - Otros Gastos en Personal",
    "Otro": "04 - Otros Gastos en Personal",
  };

  const formatNumber = (number) =>
  {
    if (number === 0) return "No informado";
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(number);
  };

  const { control, handleSubmit, clearErrors, trigger, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(validacionesCalidadJuridica),
    mode: 'onBlur',
    defaultValues: {
      personal: [ {} ]
    }
  });

  const [ inputStatus, setInputStatus ] = useState({
    estamento_label_value: { loading: false, saved: false },
    renta_bruta: { loading: false, saved: false },
    grado: { loading: false, saved: false },
  });

  useEffect(() =>
  {
    const personalFiltrado = Array.isArray(personalGore)
      ? personalGore.filter(
        (personal) =>
          personal.calidad_juridica == idCalidad &&
          personal.nombre_calidad_juridica === calidadJuridica
      ).sort((a, b) => a.id - b.id)
      : [];
    setNuevoPersonal(personalFiltrado);
  }, [ personalGore, idCalidad, calidadJuridica ]);

  const transformarEnOpciones = (datos, propiedadLabel) =>
  {
    return datos.map((dato) => ({
      label: dato[ propiedadLabel ],
      value: dato.id.toString(),
    }));
  };

  useEffect(() =>
  {
    if (estamentos)
    {
      const opcionesDeEstamentos = transformarEnOpciones(
        estamentos,
        'estamento'
      );
      setOpcionesEstamentos(opcionesDeEstamentos);
    }
  }, [ estamentos ]);

  const agregarPersonal = async () =>
  {
    const personalValues = getValues('personal');
    console.log(personalValues);
    const isValid = await trigger('personal');

    if (!isValid)
    {
      console.log('Datos no válidos. No se enviará la solicitud.');
      return; // No hace nada si la validación falla
    }
    try
    {
      const respuesta = await updatePasoGore({ [ seccion ]: [ { calidad_juridica: idCalidad } ] });
      if (respuesta && respuesta.personaCreada)
      {
        setNuevoPersonal(prev => [ ...prev, respuesta.personaCreada ]);
      } else
      {
        console.error('El nuevo personal no fue creado correctamente');
      }
    } catch (error)
    {
      console.error('Error al agregar personal nuevo', error);
    }
  };

  const handleUpdate = async (fichaId, field, value) =>
  {
    let finalValue = field === 'renta_bruta' ? value.replace(/\./g, '') : value;

    setInputStatus(prev => ({
      ...prev,
      [ fichaId ]: {
        ...prev[ fichaId ],
        [ field ]: { value: finalValue, loading: false, saved: false },
      },
    }));

    try
    {
      const payload = { [ seccion ]: [ { id: fichaId, [ field ]: finalValue } ] };
      await updatePasoGore(payload);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ fichaId ]: {
          ...prevStatus[ fichaId ],
          [ field ]: { loading: false, saved: true },
        },
      }));
    } catch (error)
    {
      console.error('Error updating data', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ fichaId ]: {
          ...prevStatus[ fichaId ],
          [ field ]: { loading: false, saved: false },
        },
      }));
    }
  };

  const eliminarPersonal = async (idPersonal) =>
  {
    const nuevosPersonal = nuevoPersonal.filter(
      (personal) => personal.id !== idPersonal
    );
    setNuevoPersonal(nuevosPersonal);
    try
    {
      await updatePasoGore({
        [ seccion ]: [
          {
            id: idPersonal,
            DELETE: true,
          },
        ],
      });
    } catch (error)
    {
      console.error('Error eliminando personal:', error);
    }
  };

  function MensajeErrorPresupuesto({ por_justificar })
  {
    if (por_justificar === 0)
    {
      return <p></p>;
    } else
    {
      return <p className="text-sans-h6-bold-darkred">Debes justificar el total del costo</p>;
    }
  }

  const onSubmit = async () =>
  {
    const isValid = await trigger();
    if (!isValid)
    {
      console.error('Errores de validación:', errors);
      return;
    }
    await agregarPersonal();
  };

  return (
    <div className="my-4">
      <div className="col my-4">
        {/* Encabezado para cada grupo */}
        <div className="row mt-3">
          <div className="col-3 d-flex">
            <p className="text-sans-p-bold">N°</p>
            <p className="text-sans-p-bold ms-3">Estamento</p>
          </div>
          {title === 'indirecto' && (
            <div className="col ps-0">
              <p className="text-sans-p-bold">
                Número de personas
              </p>
            </div>
          )}
          <div className="col">
            <p className="text-sans-p-bold">
              Renta bruta <br /> mensual ($M)
            </p>
          </div>
          <div className="col">
            <p className="text-sans-p-bold ">
              Grado (Si <br /> corresponde)
            </p>
          </div>
          {title === 'directo' && (
            <div className="col-3">
              <p className="text-sans-p-bold">
                Comision <p>de servicio</p>
              </p>
            </div>
          )}
          {title === 'indirecto' && (
            <div className="col">
              <p className="text-sans-p-bold ms-3">
                Total rentas
              </p>
            </div>
          )}
          {!solo_lectura && (
            <div className="col">
              <p className="text-sans-p-bold ps-4">Acción</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(nuevoPersonal) &&
            nuevoPersonal?.map((personal, index) => (
              <div
                className={`row py-3 ${index % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center`}
                key={personal.id}
              >
                <div className="col-3 d-flex">
                  <span className="text-sans-p-bold me-1 mt-3">{index + 1}</span>

                  <div className="col-12 pe-1">
                    <Controller
                      control={control}
                      name={`personal[${index}].estamento`}
                      defaultValue={personal?.estamento || ''}
                      render={({ field, fieldState: { error } }) => (
                        <DropdownSelect
                          id={`estamento_${personal.id}`}
                          placeholder="Estamento"
                          options={opcionesEstamentos}
                          onSelectionChange={(selectedOption) =>
                          {
                            handleUpdate(personal.id, 'estamento', selectedOption.value);
                            field.onChange(selectedOption.value);
                            clearErrors(`personal[${index}].estamento`); // Limpiar errores aquí
                          }}
                          readOnly={solo_lectura}
                          selected={personal.estamento_label_value || ''}
                          error={error?.message}
                        />
                      )}
                    />
                  </div>
                </div>
                {title === 'indirecto' && (
                  <div className="col-2 me-2">
                    <Controller
                      name={`personal[${index}].numero_personas_gore`}
                      control={control}
                      defaultValue={personal.numero_personas_gore || ''}
                      render={({ field, fieldState: { error } }) => (
                        <CustomInput
                          {...field}
                          placeholder="número"
                          loading={
                            inputStatus[ personal.id ]?.numero_personas_gore?.loading && !error
                          }
                          saved={
                            inputStatus[ personal.id ]?.numero_personas_gore?.saved && !error
                          }
                          error={error?.message}
                          disabled={solo_lectura}
                          onBlur={(e) =>
                          {
                            field.onBlur();
                            const value = e.target.value;

                            // Realiza la validación manualmente
                            const isValid = !error && value !== '' && value !== null;

                            if (isValid && personal.numero_personas_gore !== value)
                            {
                              handleUpdate(
                                personal.id,
                                `numero_personas_gore`,
                                value
                              );
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                )}

                <div className="col-2 px-0">
                  <Controller
                    name={`personal[${index}].renta_bruta`}
                    control={control}
                    defaultValue={personal?.renta_bruta || ''}
                    render={({ field, fieldState: { error } }) =>
                    {
                      const { onChange, onBlur, value } = field;

                      const handleBlur = async () =>
                      {
                        // Dispara la validación
                        const isFieldValid = await trigger(`personal[${index}].renta_bruta`);
                        if (isFieldValid && personal.renta_bruta !== value)
                        {
                          handleUpdate(personal.id, 'renta_bruta', value.replace(/\./g, ''));
                        }
                        onBlur();
                      };

                      return (
                        <InputCosto
                          id={`renta_bruta_${personal.id}`}
                          placeholder="Costo (M$)"
                          loading={inputStatus[ personal.id ]?.renta_bruta?.loading}
                          saved={inputStatus[ personal.id ]?.renta_bruta?.saved}
                          error={error?.message} // Asegúrate de que el error se pase al componente
                          value={value}
                          onChange={(e) =>
                          {
                            onChange(e); // Cambia el valor en el formulario
                          }}
                          onBlur={handleBlur} // Dispara la validación y maneja la actualización
                          disabled={solo_lectura}
                        />
                      );
                    }}
                  />
                </div>

                <div className="col-1 px-0">
                  <Controller
                    name={`personal[${index}].grado`}
                    control={control}
                    defaultValue={personal.grado || ''}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        placeholder="Grado"
                        loading={
                          inputStatus[ personal.id ]?.grado?.loading && !error
                        }
                        saved={inputStatus[ personal.id ]?.grado?.saved && !error}
                        error={error?.message}
                        disabled={solo_lectura}
                        onBlur={async (e) =>
                        {
                          field.onBlur();
                          if (personal.grado !== e.target.value)
                          {
                            const isValid = await trigger(`personal[${index}].grado`);
                            if (isValid && !error)
                            {
                              handleUpdate(personal.id, `grado`, e.target.value);
                            }
                          }
                        }}
                      />
                    )}
                  />
                </div>
                {title === 'directo' && (
                  <div className="col-3 px-4 ms-5">
                    <span className="text-sans-p-bold-blue">
                      {personal.comision_servicio ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {title === 'indirecto' && (
                  <div className="col-2 border px-4 mx-2">
                    <span className="text-sans-p-bold-blue mx-1">
                      {formatNumber(personal.total_rentas)}
                    </span>
                  </div>
                )}

                {!solo_lectura && (
                  <div className="col-1 px-0">
                    <button
                      className="btn-terciario-ghost"
                      onClick={() => eliminarPersonal(personal.id)}
                    >
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">Borrar</p>
                    </button>
                  </div>
                )}
              </div>
            ))}
        </form>

        {!solo_lectura && (
          <button className="btn-secundario-s m-2" onClick={agregarPersonal} type='button'>
            <i className="material-symbols-rounded me-2">add</i>
            <p className="mb-0 text-decoration-underline">
              Agregar {calidadJuridica}
            </p>
          </button>
        )}

        <div className="my-4">
          <span className="py-2 my-2 align-self-center subrayado col-12">
            <p className="text-sans-p-bold ms-2">
              Resumen de justificación de costos de personal {title} : {''}
              {relacion_item_calidad[ calidadJuridica ] || 'Categoría desconocida'}
            </p>
          </span>
          <h6 className="text-sans-h6-primary mt-3">
            Debes justificar el 100% del costo informado en el paso 2 para
            completar esta sección.
          </h6>
        </div>
        {itemsJustificados.map((item, itemIndex) =>
        {
          const itemCorrespondiente = Object.entries(relacion_item_calidad).find(([ key, value ]) =>
            (value === item.label && key === calidadJuridica) ||
            (Array.isArray(value) && value.includes(item.label) && key === calidadJuridica)
          );

          const counterClass = (item.por_justificar) == 0
            ? "text-sans-p-bold"
            : "text-sans-h6-bold-darkred";

          if (itemCorrespondiente)
          {
            return (
              <div key={itemIndex}>
                <div>
                  {/* Encabezado */}
                  <table className="table mb-5">
                    <thead>
                      <tr>
                        <th scope="col-2">
                          Costo adicional informado<br />
                          por GORE ($M)
                        </th>
                        <th scope="col-2">Costo justificado</th>
                        <th scope="col-2">
                          Pendiente por <br />
                          justificar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-secondary my-auto">
                      {/* Items */}
                      <tr key={itemIndex} className="my-3">
                        <td className="col-3">
                          <p className="text-sans-p-bold mx-5 my-3">{formatNumber(item.informado)}</p>
                        </td>
                        <td className="col-3">
                          <p className="text-sans-p-bold  mx-5 my-3">{formatNumber(item.justificado)}</p>
                        </td>
                        <td className="col-3">
                          <p className={`mx-3 my-3 ${counterClass}`}>{formatNumber(item.por_justificar)}</p>
                        </td>
                        <td className="col-4">
                          <div className="my-3 ">
                            <MensajeErrorPresupuesto
                              por_justificar={item.por_justificar}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
