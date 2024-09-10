import React,{useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../fase1/forms/custom_textarea';
import {DropdownSelectSimple } from '../../fase1/dropdown/selectSimple';
import { CheckboxRegion2 } from '../../fase1/dropdown/checkboxRegiones2.0';
import { FormSubdereContext } from '../../../context/RevisionFinalSubdere';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionTemporalidadGradualidad } from '../../../validaciones/fase1/temporalidadGradualidad';

export const Temporalidad = ({
  temporalidad = [],
  solo_lectura = false,
  regiones_recomendadas = [],
  temporalidad_opciones = [],
  regiones_temporalidad = [],
}) =>
{
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [ grupos, setGrupos ] = useState(temporalidad);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validacionTemporalidadGradualidad),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() =>
  {
    const gruposOrdenados = Array.isArray(temporalidad)
      ? temporalidad.sort((a, b) => a.id - b.id)
      : [];
    setGrupos(gruposOrdenados);
  }, [ temporalidad ]);

  const [ inputStatus, setInputStatus ] = useState({
    justificacion_temporalidad: { loading: false, saved: false },
    gradualidad_meses: { loading: false, saved: false },
    justificacion_gradualidad: { loading: false, saved: false },
    temporalidad: { loading: false, saved: false },
    region: { loading: false, saved: false },
  });

  const agregarGrupo = async () =>
  {
    const nuevoGrupoPayload = {};

    try
    {
      const respuesta = await updatePasoSubdere({
        temporalidad_gradualidad: [ nuevoGrupoPayload ],
      });
      if (respuesta && respuesta.grupoCreado)
      {
        setGrupos((gruposActuales) =>
        {
          const nuevosGrupos = [ ...gruposActuales, respuesta.grupoCreado ];
          return nuevosGrupos.sort((a, b) => a.id - b.id);
        });
      } else
      {
        console.error('El grupo no fue creada correctamente');
      }
    } catch (error)
    {
      console.error('Error al agregar grupo', error);
    }
  };

  const handleUpdate = async (grupoId, field, value) =>
  {
    const grupoActual = grupos.find((grupo) => grupo.id === grupoId);
    const nuevoGrupo = {
      ...grupoActual,
      [ field ]: field === 'region' ? value.map(Number) : value, // Convertir a número si es la región
    };

    setInputStatus((prev) => ({
      ...prev,
      [ grupoId ]: {
        ...prev[ grupoId ],
        [ field ]: { value, loading: false, saved: false },
      },
    }));

    try
    {
      const payload = {
        temporalidad_gradualidad: [ nuevoGrupo ],
      };
      await updatePasoSubdere(payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ grupoId ]: {
          ...prevStatus[ grupoId ],
          [ field ]: {
            ...prevStatus[ grupoId ][ field ],
            loading: false,
            saved: true,
          },
        },
      }));
    } catch (error)
    {
      console.error('Error updating data', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ grupoId ]: {
          ...prevStatus[ grupoId ],
          [ field ]: { loading: false, saved: false },
        },
      }));
    }
  };

  const eliminarGrupo = async (idGrupo) =>
  {
    const nuevosGrupos = grupos.filter((ficha) => ficha.id !== idGrupo);
    setGrupos(nuevosGrupos);
    try
    {
      await updatePasoSubdere({
        temporalidad_gradualidad: [
          {
            id: idGrupo,
            DELETE: true,
          },
        ],
      });
    } catch (error)
    {
      console.error('Error eliminando la ficha:', error);
    }
  };

  const onSubmit = () =>
  {
    agregarGrupo();
  };

  const opcionesRegion = (regiones_temporalidad || []).map((region) => ({
    label: region?.label || '',
    value: region?.value || '',
  }));


  return (
    <>
      <div className="col-12">
        <div className="container-fluid">
          <h4 className="text-sans-h4">4.1 Temporalidad y Gradualidad</h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              En esta sección deberás mostrar el detalle de temporalidad y
              gradualidad para cada grupo de regiones con recomendación
              favorable. En caso de tener solo una región, solo podrás hacer un
              grupo. Todos los campos son obligatorios.{' '}
            </h6>
          </div>

          <div className="mb-4 col-11">
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                {Array.isArray(grupos) && grupos.length > 0 ? (
                  grupos.map((grupo, index) => (
                    <React.Fragment key={grupo.id}>
                      <div>
                        <div className="row border my-4">
                          <div className="col-1 border-end border-bottom">
                            <p className="text-sans-p-bold my-2">
                              Grupo {index + 1}
                            </p>
                          </div>

                          <div className="col">
                            <div className="col-8 mt-4 mb-4 p-2 mx-3">
                              {regiones_recomendadas.length === 1 ? (
                                <>
                                  Región:{' '}
                                  <div className="border-gris my-2 px-3 py-3">
                                    {grupo.region_label_value[ 0 ]?.label}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Controller
                                    control={control}
                                    name={`grupos[${index}].region`}
                                    defaultValue={grupo.region_label_value.map(item => ({ label: item.label, value: item.value }))}
                                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                      <CheckboxRegion2
                                        ref={ref}
                                        label="Región (Obligatorio)"
                                        options={opcionesRegion}
                                        selectedRegions={value}
                                        onSelectionChange={onChange}
                                        readOnly={solo_lectura}
                                        error={error?.message}
                                      />
                                    )}
                                  />

                                  {grupo.region_label_value.length > 1 && (
                                    <div className="mt-3">
                                      Regiones seleccionadas :{' '}
                                      <ol className="border-gris mt-2 px-3 py-3">
                                        {grupo.region_label_value.map(
                                          (item, index) => (
                                            <li
                                              key={index}
                                              className="px-2 mx-3"
                                            >
                                              {item.label}
                                            </li>
                                          )
                                        )}
                                      </ol>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="col">
                              <span className="mx-4 my-5 text-sans-h5">
                                Temporalidad
                              </span>
                              <div className=" d-flex  flex-row col my-2 mx-3 p-2">
                                <div className="col-6 me-2">
                                  <Controller
                                    control={control}
                                    name={`grupos[${index}].temporalidad`}
                                    defaultValue={grupo.temporalidad}
                                    render={({ field, fieldState: { error } }) => (
                                      <DropdownSelectSimple
                                        id={grupo.id}
                                        label="Elige la temporalidad para este grupo"
                                        placeholder="Definitiva o temporal"
                                        name={`grupos[${index}].temporalidad`}
                                        options={temporalidad_opciones.map(
                                          (opcion) => ({
                                            label: opcion.key,
                                            value: opcion.value,
                                          })
                                        )}
                                        onSelectionChange={(selectedOption) =>
                                        {
                                          const selectedValue =
                                            selectedOption.value;
                                          field.onChange(selectedValue);
                                          handleUpdate(
                                            grupo.id,
                                            'temporalidad',
                                            selectedValue
                                          );
                                        }}
                                        selected={
                                          field.value || grupo.temporalidad
                                        } // Asegúrate de que este valor se inicializa correctamente con el estado actual
                                        readOnly={solo_lectura}
                                        error={error?.message}
                                      />
                                    )}
                                  />
                                </div>
                                {grupo.temporalidad === 'Temporal' && (
                                  <div className="col-5 ms-3">
                                    <Controller
                                      control={control}
                                      name={`grupos[${index}].anios`}
                                      defaultValue={grupo.anios || ''}
                                      render={({
                                        field,
                                        fieldState: { error },
                                      }) => (
                                        <CustomTextarea
                                          {...field}
                                          label="Temporalidad en años"
                                          placeholder="Años"
                                          descripcion="Campo numérico"
                                          error={error?.message}
                                          readOnly={solo_lectura}
                                          loading={
                                            inputStatus[ grupo.id ]?.anios
                                              ?.loading && !error
                                          }
                                          saved={
                                            inputStatus[ grupo.id ]?.anios
                                              ?.saved && !error
                                          }
                                          onBlur={(e) =>
                                          {
                                            field.onBlur();
                                            if (
                                              grupo.anios !== e.target.value &&
                                              !error
                                            )
                                            {
                                              handleUpdate(
                                                grupo.id,
                                                'anios',
                                                e.target.value
                                              );
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="col-11 my-2 mx-3 p-2">
                                <Controller
                                  control={control}
                                  name={`grupos[${index}].justificacion_temporalidad`}
                                  defaultValue={
                                    grupo.justificacion_temporalidad || ''
                                  }
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <CustomTextarea
                                      {...field}
                                      label="Justifica la temporalidad de este grupo (Obligatorio)"
                                      placeholder="Describe los costos de la plataforma o software"
                                      error={error?.message}
                                      readOnly={solo_lectura}
                                      maxLength={500}
                                      loading={
                                        inputStatus[ grupo.id ]
                                          ?.justificacion_temporalidad
                                          ?.loading && !error
                                      }
                                      saved={
                                        inputStatus[ grupo.id ]
                                          ?.justificacion_temporalidad?.saved &&
                                        !error
                                      }
                                      onBlur={(e) =>
                                      {
                                        field.onBlur();
                                        if (
                                          grupo.justificacion_temporalidad !==
                                          e.target.value &&
                                          !error
                                        )
                                        {
                                          handleUpdate(
                                            grupo.id,
                                            'justificacion_temporalidad',
                                            e.target.value
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>

                            <div className="col">
                              <span className="mx-4 my-5 text-sans-h5">
                                Gradualidad
                              </span>
                              <div className="col-8 my-2 mx-3 p-2">
                                <Controller
                                  control={control}
                                  name={`grupos[${index}].gradualidad_meses`}
                                  defaultValue={grupo.gradualidad_meses ?? ''} // Manejar valores nulos
                                  render={({ field, fieldState: { error } }) => (
                                    <CustomTextarea
                                      {...field}
                                      label="Gradualidad en meses para este grupo"
                                      placeholder="meses"
                                      descripcion="Campo numérico"
                                      error={error?.message}
                                      readOnly={solo_lectura}
                                      loading={inputStatus[ grupo.id ]?.gradualidad_meses?.loading && !error}
                                      saved={inputStatus[ grupo.id ]?.gradualidad_meses?.saved && !error}
                                      onBlur={(e) =>
                                      {
                                        field.onBlur();
                                        const value = Number(e.target.value);
                                        if (!isNaN(value) && grupo.gradualidad_meses !== value && !error)
                                        {
                                          handleUpdate(grupo.id, 'gradualidad_meses', value);
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="col-11 my-2 mx-3 p-2">
                                <Controller
                                  control={control}
                                  name={`grupos[${index}].justificacion_gradualidad`}
                                  defaultValue={
                                    grupo.justificacion_gradualidad || ''
                                  }
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <CustomTextarea
                                      {...field}
                                      label="Justifica la gradualidad de este grupo (Obligatorio)"
                                      placeholder="Describe los costos de la plataforma o software"
                                      error={error?.message}
                                      readOnly={solo_lectura}
                                      maxLength={500}
                                      loading={
                                        inputStatus[ grupo.id ]
                                          ?.justificacion_gradualidad
                                          ?.loading && !error
                                      }
                                      saved={
                                        inputStatus[ grupo.id ]
                                          ?.justificacion_gradualidad?.saved &&
                                        !error
                                      }
                                      onBlur={(e) =>
                                      {
                                        field.onBlur();
                                        if (
                                          grupo.justificacion_gradualidad !==
                                          e.target.value &&
                                          !error
                                        )
                                        {
                                          handleUpdate(
                                            grupo.id,
                                            'justificacion_gradualidad',
                                            e.target.value
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <hr />
                          {!solo_lectura && (
                            <div className="d-flex justify-content-end p-3">
                              {regiones_recomendadas.length > 1 &&
                                temporalidad.length > 1 && (
                                  <button
                                    className="btn-terciario-ghost"
                                    onClick={() => eliminarGrupo(grupo.id)}
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
                          )}
                        </div>
                      </div>
                      {index === grupos.length - 1 &&
                        !solo_lectura &&
                        regiones_recomendadas.length > 1 &&
                        regiones_temporalidad.length > 0 && (
                          <>
                            <div className="d-flex justify-content-start ">
                              <button
                                className="btn-secundario-s m-2"
                                type="button"
                                onClick={agregarGrupo}
                              >
                                <i className="material-symbols-rounded me-2">
                                  add
                                </i>
                                <u>Agregar grupo</u>
                              </button>
                            </div>
                          </>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="alert alert-info">
                    No hay regiones con recomendación favorable en la selección.
                    Esta sección del formulario es solo para las regiones con
                    recomendación favorable.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
