import { useState, useEffect, useContext } from 'react';
import DropdownSelect from '../../dropdown/select';
import InputCosto from '../../forms/input_costo';
import CustomInput from '../../forms/custom_input';
import { FormGOREContext } from '../../../context/FormGore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionesCalidadJuridica } from '../../../validaciones/esquemaCalidadJuridica';

export const AgregarPersonal = ({
  solo_lectura,
  calidadJuridica,
  personalGore,
  estamentos,
  seccion,
  idCalidad,
  dataPersonal,
  title,
}) => {
  const [nuevoPersonal, setNuevoPersonal] = useState([]);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);

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
      )
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

  const onSubmit = () => {
    agregarPersonal();
  };

  function crearArrays(dataPersonal) {
    // Crear objetos para almacenar los datos según el id de la palabra clave
    const categorias = {
      personal_planta: { id: 1, datos: {} },
      personal_contrata: { id: 2, datos: {} },
      otras_remuneraciones: { id: 3, datos: {} },
      gastos_en_personal: { id: 4, datos: {} },
    };

    // Recorrer la lista de datos
    for (const clave in dataPersonal) {
      // Preparar la clave para análisis
      let nuevaClave = clave.replace(/sub21[b_]?_/g, '');

      // Determinar la categoría y el tipo de dato
      Object.keys(categorias).forEach((categoria) => {
        if (nuevaClave.includes(categoria)) {
          // Determinar si es justificado, justificar o total
          if (nuevaClave.includes('justificado')) {
            categorias[categoria].datos['justificado'] = dataPersonal[clave];
          } else if (nuevaClave.includes('justificar')) {
            categorias[categoria].datos['justificar'] = dataPersonal[clave];
          } else if (nuevaClave.includes('total')) {
            categorias[categoria].datos['total'] = dataPersonal[clave];
          }
        }
      });
    }

    // Retornar los arrays creados
    return Object.values(categorias);
  }

  const arrays = crearArrays(dataPersonal);

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
                className="row align-items-center d-flex mb-3"
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

                      const handleChange = valor => {
                        clearErrors(`personal[${index}].renta_bruta`);
                        onChange(valor);
                        handleUpdate(personal.id, `renta_bruta`, valor);
                      };

                      const handleBlur = async () => {
                        const isFieldValid = await trigger(`renta_bruta_${personal.id}`);
                        if (!isFieldValid) {
                          handleUpdate(personal.id, `renta_bruta`, value);
                        }
                        onBlur();
                      };

                      return (
                        <InputCosto
                          id={`renta_bruta_${personal.id}`}
                          placeholder="Costo (M$)"
                          loading={
                            inputStatus[personal.id]?.renta_bruta?.loading}
                          saved={inputStatus[personal.id]?.renta_bruta?.saved}
                          error={errors[`renta_bruta_${personal.id}`]?.message}
                          disabled={solo_lectura}
                          value={value}
                          onChange={handleChange}
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
                      $ {Number(personal.total_rentas).toLocaleString('es-CL')}
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
          <button className="btn-secundario-s m-2" onClick={agregarPersonal}>
            <i className="material-symbols-rounded me-2">add</i>
            <p className="mb-0 text-decoration-underline">
              Agregar {calidadJuridica}
            </p>
          </button>
        )}

        <div className="my-4">
          <p className="subrayado text-sans-p-bold">
            Resumen de justificación de costos de personal {title} : {''}
            {calidadJuridica}
          </p>
          <h6 className="text-sans-h6-primary mt-3">
            Debes justificar el 100% del costo informado en el paso 2 para
            completar esta sección.
          </h6>
          <div className="ps-3 my-4">
            {/* Encabezado */}
            <table className="table my-4">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="py-2">#</span>
                  </th>
                  <th scope="col">
                    <span className="py-2">item</span>
                  </th>
                  <th scope="col">
                    <span className="py-2">
                      Costo adicional <br />
                      informado por <br />
                      GORE ($M)
                    </span>
                  </th>
                  <th scope="col ps-4 py-2">Costo justificado</th>
                  <th scope="col ps-4 py-2 ">
                    Pendiente por <br />
                    justificar
                  </th>
                </tr>
              </thead>
              <tbody className="table-secondary">
                {Array.isArray(arrays) &&
                  arrays
                    .filter((dato) => Number(dato.id) === Number(idCalidad))
                    .map((dato, index) => (
                      <tr key={index} className="my-5">
                        <td>{index + 1}</td>
                        <td className="col">{calidadJuridica}</td>
                        <td>{dato.datos.total || ''}</td>
                        <td>{dato.datos.justificado || ''}</td>
                        <td>{dato.datos.justificar || ''}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
