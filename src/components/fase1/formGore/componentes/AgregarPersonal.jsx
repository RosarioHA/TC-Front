import { useState, useEffect, useContext } from 'react';
import DropdownSelect from '../../dropdown/select';
import InputCosto from '../../forms/input_costo';
import CustomInput from '../../forms/custom_input';
import { FormGOREContext } from '../../../../context/FormGore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionesCalidadJuridica } from '../../../../validaciones/fase1/esquemaCalidadJuridica';

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
}) => {
  const [nuevoPersonal, setNuevoPersonal] = useState([]);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);

  const itemsJustificados = [
    { label: '01 - Personal de Planta', informado: dataPersonal[`${prefix}_total_personal_planta`], justificado: dataPersonal[`${prefix}_personal_planta_justificado`], por_justificar: dataPersonal[`${prefix}_personal_planta_justificar`] },
    { label: '02 - Personal de Contrata', informado: dataPersonal[`${prefix}_total_personal_contrata`], justificado: dataPersonal[`${prefix}_personal_contrata_justificado`], por_justificar: dataPersonal[`${prefix}_personal_contrata_justificar`] },
    { label: '03 - Otras Remuneraciones', informado: dataPersonal[`${prefix}_total_otras_remuneraciones`], justificado: dataPersonal[`${prefix}_otras_remuneraciones_justificado`], por_justificar: dataPersonal[`${prefix}_otras_remuneraciones_justificar`] },
    { label: '04 - Otros Gastos en Personal', informado: dataPersonal[`${prefix}_total_gastos_en_personal`], justificado: dataPersonal[`${prefix}_gastos_en_personal_justificado`], por_justificar: dataPersonal[`${prefix}_gastos_en_personal_justificar`] },
  ];

  const relacion_item_calidad = {
    "Planta": "01 - Personal de Planta",
    "Contrata": "02 - Personal de Contrata",
    "Honorario a suma alzada": "03 - Otras Remuneraciones",
    "Honorario asimilado a grado": "04 - Otros Gastos en Personal",
    "Comisión de servicio": "04 - Otros Gastos en Personal",
    "Otro": "04 - Otros Gastos en Personal",
  };

  const formatNumber = (number) => {
    // Verificar si el número es 0 para manejar el caso "No informado"
    if (number === 0) return "No informado";
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(number);
  };

  const { control, handleSubmit, clearErrors, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(validacionesCalidadJuridica),
    mode: 'onBlur',
  });

  const [inputStatus, setInputStatus] = useState({
    estamento_label_value: { loading: false, saved: false },
    renta_bruta: { loading: false, saved: false },
    grado: { loading: false, saved: false },
  });

  useEffect(() => {
    const personalFiltrado = Array.isArray(personalGore)
      ? personalGore.filter(
        (personal) =>
          personal.calidad_juridica == idCalidad &&
          personal.nombre_calidad_juridica === calidadJuridica
      ).sort((a, b) => a.id - b.id)
      : [];
    setNuevoPersonal(personalFiltrado);
  }, [personalGore, idCalidad, calidadJuridica]);

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map((dato) => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString(),
    }));
  };

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (estamentos) {
      const opcionesDeEstamentos = transformarEnOpciones(
        estamentos,
        'estamento'
      );
      setOpcionesEstamentos(opcionesDeEstamentos);
    }
  }, [estamentos]);

  // Botón para agregar personal dentro de la calidad jurídica
  const agregarPersonal = async () => {
    const nuevaPersonaPayload = {
      calidad_juridica: idCalidad,
    };

    try {
      const respuesta = await updatePasoGore({
        [seccion]: [nuevaPersonaPayload],
      });
      if (respuesta && respuesta.personaCreada) {
        setNuevoPersonal((personasActuales) => [
          ...personasActuales,
          respuesta.personaCreada,
        ]);
      } else {
        console.error('El nuevo personal no fue creado correctamente');
      }
    } catch (error) {
      console.error('Error al agregar personal nuevo', error);
    }
  };

  // Guardar campos
  const handleUpdate = async (fichaId, field, value) => {
    let finalValue = value;
    if (field === 'renta_bruta') {
      finalValue = value.replace(/\./g, '');
    } else if (
      typeof value === 'object' &&
      value !== null &&
      field === 'estamento_label_value'
    ) {
      finalValue = { ...value };
    }

    setInputStatus((prev) => ({
      ...prev,
      [fichaId]: {
        ...prev[fichaId],
        [field]: { value: finalValue, loading: false, saved: false },
      },
    }));

    try {
      const payload = {
        [seccion]: [
          {
            id: fichaId,
            [field]: finalValue,
          },
        ],
      };
      await updatePasoGore(payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: {
            ...prevStatus[fichaId][field],
            loading: false,
            saved: true,
          },
        },
      }));
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: { loading: false, saved: false },
        },
      }));
    }
  };

  const eliminarPersonal = async (idPersonal) => {
    const nuevosPersonal = nuevoPersonal.filter(
      (personal) => personal.id !== idPersonal
    );
    setNuevoPersonal(nuevosPersonal);
    try {
      await updatePasoGore({
        [seccion]: [
          {
            id: idPersonal,
            DELETE: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error eliminando personal:', error);
    }
  };

  function MensajeErrorPresupuesto({ por_justificar }) {
    if (por_justificar == 0) {
      return <p></p>
    } else {
      return <p className="col-3 text-sans-h6-bold-darkred">Debes justificar el total del costo</p>;
    }
  }

  const onSubmit = () => {
    agregarPersonal();
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
            <div className="col pe-5">
              <p className="text-sans-p-bold ms-3">
                Comision de servicio
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
                className={`row py-3 ${index % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}
                key={personal.id}
              >
                <div className="col-3 d-flex">
                  <span className="text-sans-p-bold me-3 mt-3">{index + 1}</span>

                  <div className="col-10">
                    <Controller
                      control={control}
                      name={`estamento_${personal.id}`}
                      render={({ field, fieldState: { error } }) => (
                        <DropdownSelect
                          id={`estamento_${personal.id}`}
                          name={`estamento_${personal.id}`}
                          placeholder="Estamento"
                          options={opcionesEstamentos}
                          onSelectionChange={(selectedOption) => {
                            handleUpdate(
                              personal.id,
                              'estamento',
                              selectedOption.value
                            );
                            field.onChange(selectedOption.value);
                          }}
                          readOnly={solo_lectura}
                          selected={personal.estamento_label_value}
                          error={error?.message}
                        />
                      )}
                    />
                  </div>
                </div>
                {title === 'indirecto' && (
                  <div className="d-flex col px-2">
                    <Controller
                      name={`personal[${index}].numero_personas_gore`}
                      control={control}
                      defaultValue={personal.numero_personas_gore || ''}
                      render={({ field, fieldState: { error } }) => (
                        <CustomInput
                          {...field}
                          placeholder="número"
                          loading={
                            inputStatus[personal.id]?.numero_personas_gore
                              ?.loading && !error
                          }
                          saved={
                            inputStatus[personal.id]?.numero_personas_gore
                              ?.saved && !error
                          }
                          error={error?.message}
                          disabled={solo_lectura}
                          onBlur={(e) => {
                            field.onBlur();
                            if (
                              personal.numero_personas_gore !==
                              e.target.value &&
                              !error
                            ) {
                              handleUpdate(
                                personal.id,
                                `numero_personas_gore`,
                                e.target.value
                              );
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                )}
                <div className="col">
                  <Controller
                    name={`personal[${index}].renta_bruta`}
                    control={control}
                    defaultValue={personal?.renta_bruta || ''}
                    render={({ field }) => {
                      const { onChange, onBlur, value } = field;

                      const handleBlur = async () => {
                        // Dispara la validación
                        const isFieldValid = await trigger(`personal[${index}].renta_bruta`);
                        // Si el campo es válido y el valor ha cambiado, actualiza el servidor
                        if (isFieldValid && personal.renta_bruta !== value) {
                          handleUpdate(personal.id, 'renta_bruta', value.replace(/\./g, ''));
                        }
                        onBlur();
                      };
                      return (
                        <InputCosto
                          id={`renta_bruta_${personal.id}`}
                          placeholder="Costo (M$)"
                          loading={inputStatus[personal.id]?.renta_bruta?.loading}
                          saved={inputStatus[personal.id]?.renta_bruta?.saved}
                          error={errors[`personal[${index}].renta_bruta`]?.message}
                          disabled={solo_lectura}
                          value={value}
                          onChange={onChange}
                          onBlur={handleBlur}
                        />
                      );
                    }}
                  />
                </div>

                <div className="col">
                  <Controller
                    name={`personal[${index}].grado`}
                    control={control}
                    defaultValue={personal.grado || ''}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        placeholder="Grado"
                        loading={
                          inputStatus[personal.id]?.grado?.loading && !error
                        }
                        saved={inputStatus[personal.id]?.grado?.saved && !error}
                        error={error?.message}
                        disabled={solo_lectura}
                        onBlur={(e) => {
                          field.onBlur();
                          if (personal.grado !== e.target.value && !error) {
                            handleUpdate(personal.id, `grado`, e.target.value);
                          }
                        }}
                      />
                    )}
                  />
                </div>
                {title === 'directo' && (
                  <div className="col">
                    <span className="text-sans-p-bold-blue">
                      {personal.comision_servicio ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {title === 'indirecto' && (
                  <div className="col-2 border">
                    <span className="text-sans-p-bold-blue">
                      $ {formatNumber(personal.total_rentas)}
                    </span>
                  </div>
                )}

                {!solo_lectura && (
                  <div className="col ps-0">
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
              {relacion_item_calidad[calidadJuridica] || 'Categoría desconocida'}
            </p>
          </span>
          <h6 className="text-sans-h6-primary mt-3">
            Debes justificar el 100% del costo informado en el paso 2 para
            completar esta sección.
          </h6>
        </div>
        {itemsJustificados.map((item, itemIndex) => {
          const itemCorrespondiente = Object.entries(relacion_item_calidad).find(([key, value]) =>
            (value === item.label && key === calidadJuridica) ||
            (Array.isArray(value) && value.includes(item.label) && key === calidadJuridica)
          );

          const counterClass = (item.por_justificar) == 0
            ? "text-sans-p-bold"
            : "text-sans-h6-bold-darkred";

          if (itemCorrespondiente) {
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
                    <tbody className="table-secondary">
                      {/* Items */}
                      <tr key={itemIndex} className="my-5">
                        <td className="col-2">
                          <p className="text-sans-p-bold">{formatNumber(item.informado)}</p>
                        </td>
                        <td className="col-2">
                          <p className="text-sans-p-bold">{formatNumber(item.justificado)}</p>
                        </td>
                        <td className="col-2">
                          <p className={counterClass}>{formatNumber(item.por_justificar)}</p>
                          <div className="d-flex justify-content-end p-0 m-0">
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
