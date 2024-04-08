import { useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import DropdownSelect from '../../dropdown/select';
import { CheckboxRegion } from '../../dropdown/checkboxRegion';
import { FormSubdereContext } from '../../../context/RevisionFinalSubdere';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionTemporalidadGradualidad } from '../../../validaciones/temporalidadGradualidad';

export const Temporalidad = ({ temporalidad, solo_lectura }) => {
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [grupos, setGrupos] = useState(temporalidad);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validacionTemporalidadGradualidad),
    mode: 'onBlur',
  });

  useEffect(() => {
    setGrupos(Array.isArray(temporalidad) ? temporalidad : []);
  }, [temporalidad]);

  const [inputStatus, setInputStatus] = useState({
    justificacion_temporalidad: { loading: false, saved: false },
    gradualidad_meses: { loading: false, saved: false },
    justificacion_gradualidad: { loading: false, saved: false },
    temporalidad: { loading: false, saved: false },
    region_label_value: { loading: false, saved: false },
  });

  const agregarGrupo = async () => {
    const nuevoGrupoPayload = {};

    try {
      const respuesta = await updatePasoSubdere({
        temporalidad_gradualidad: [nuevoGrupoPayload],
      });
      if (respuesta && respuesta.grupoCreado) {
        setGrupos((gruposActuales) => [
          ...gruposActuales,
          respuesta.grupoCreado,
        ]);
      } else {
        console.error('El grupo no fue creada correctamente');
      }
    } catch (error) {
      console.error('Error al agregar grupo', error);
    }
  };

  const handleUpdate = async (grupoId, field, value) => {
    setInputStatus((prev) => ({
      ...prev,
      [grupoId]: {
        ...prev[grupoId],
        [field]: { value, loading: false, saved: false },
      },
    }));

    try {
      const payload = {
        temporalidad_gradualidad: [
          {
            id: grupoId,
            [field]: value,
          },
        ],
      };
      await updatePasoSubdere(payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [grupoId]: {
          ...prevStatus[grupoId],
          [field]: {
            ...prevStatus[grupoId][field],
            loading: false,
            saved: true,
          },
        },
      }));
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [grupoId]: {
          ...prevStatus[grupoId],
          [field]: { loading: false, saved: false },
        },
      }));
    }
  };

  const eliminarGrupo = async (idGrupo) => {
    const nuevosGrupos = grupos.filter((ficha) => ficha.id !== idGrupo);
    setGrupos(nuevosGrupos);
    try {
      await updatePasoSubdere({
        temporalidad_gradualidad: [
          {
            id: idGrupo,
            DELETE: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error eliminando la ficha:', error);
    }
  };

  const onSubmit = () => {
    agregarGrupo();
  };

  console.log();

  return (
    <>
      <div className="col-11">
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
            <div className="container-fluid">
              <form onSubmit={handleSubmit(onSubmit)}>
                {Array.isArray(grupos) && grupos.length > 0 ? (
                  grupos.map((grupo, index) => (
                    <div key={grupo.id}>
                      <div className="row border my-4">
                        <div className="col-1 border-end border-bottom">
                          <p className="text-sans-p-bold my-2">
                            Grupo {index + 1}
                          </p>
                        </div>

                        <div className="col">
                          <div className="col-8 mt-2 mb-4 mx-3 p-2">
                            <CheckboxRegion
                              label="Región (Obligatorio)"
                              placeholder="Elige la o las regiones donde se ejercerá la competencia"
                              options=""
                              onSelectionChange=""
                              selected=""
                              readOnly={solo_lectura}
                            />
                            {/* {errors.regiones && (
                              <p className="text-sans-h6-darkred mt-2 mb-0">
                                {errors.regiones.message}
                              </p>
                            )} */}
                          </div>
                          <div className="col">
                            <span className="mx-4 my-5 text-sans-h5">
                              Temporalidad
                            </span>
                            <div className="col-8 my-2 mx-3 p-2">
                              <Controller
                                name="temporalidad"
                                control={control}
                                render={() => (
                                  <DropdownSelect
                                    id="ambito_competencia"
                                    label="Elige el ámbito de la competencia (Obligatorio)"
                                    placeholder="Definitiva o temporal"
                                    name="temporalidad"
                                    options=""
                                    onSelectionChange=""
                                    selected=""
                                    readOnly={solo_lectura}
                                  />
                                )}
                              />
                            </div>
                            <div className="col-11 my-2 mx-3 p-2">
                              <Controller
                                control={control}
                                name={`grupos[${index}].justificacion_temporalidad`}
                                defaultValue={
                                  grupo.justificacion_temporalidad || ''
                                }
                                render={({ field, fieldState: { error } }) => (
                                  <CustomTextarea
                                    {...field}
                                    label="Justifica la temporalidad de este grupo"
                                    placeholder="Describe los costos de la plataforma o software"
                                    error={error?.message}
                                    readOnly={solo_lectura}
                                    maxLength={500}
                                    loading={
                                      inputStatus[grupo.id]
                                        ?.justificacion_temporalidad?.loading &&
                                      !error
                                    }
                                    saved={
                                      inputStatus[grupo.id]
                                        ?.justificacion_temporalidad?.saved &&
                                      !error
                                    }
                                    onBlur={(e) => {
                                      field.onBlur();
                                      if (
                                        grupo.justificacion_temporalidad !==
                                          e.target.value &&
                                        !error
                                      ) {
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
                                defaultValue={grupo.gradualidad_meses || ''}
                                render={({ field, fieldState: { error } }) => (
                                  <CustomTextarea
                                    {...field}
                                    label="Gradualidad en meses para este grupo"
                                    placeholder="meses"
                                    descripcion="Campo númerico"
                                    error={error?.message}
                                    readOnly={solo_lectura}
                                    maxLength={500}
                                    loading={
                                      inputStatus[grupo.id]?.gradualidad_meses
                                        ?.loading && !error
                                    }
                                    saved={
                                      inputStatus[grupo.id]?.gradualidad_meses
                                        ?.saved && !error
                                    }
                                    onBlur={(e) => {
                                      field.onBlur();
                                      if (
                                        grupo.gradualidad_meses !==
                                          e.target.value &&
                                        !error
                                      ) {
                                        handleUpdate(
                                          grupo.id,
                                          'gradualidad_meses',
                                          e.target.value
                                        );
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
                                render={({ field, fieldState: { error } }) => (
                                  <CustomTextarea
                                    {...field}
                                    label="Justifica la gradualidadn de este grupo"
                                    placeholder="Describe los costos de la plataforma o software"
                                    error={error?.message}
                                    readOnly={solo_lectura}
                                    maxLength={500}
                                    loading={
                                      inputStatus[grupo.id]
                                        ?.justificacion_gradualidad?.loading &&
                                      !error
                                    }
                                    saved={
                                      inputStatus[grupo.id]
                                        ?.justificacion_gradualidad?.saved &&
                                      !error
                                    }
                                    onBlur={(e) => {
                                      field.onBlur();
                                      if (
                                        grupo.justificacion_gradualidad !==
                                          e.target.value &&
                                        !error
                                      ) {
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
                        {/* {!solo_lectura && ( */}
                        <div className="d-flex justify-content-end p-3">
                          <button
                            className="btn-terciario-ghost"
                            onClick={() => eliminarGrupo(grupo.id)}
                          >
                            <i className="material-symbols-rounded me-2">
                              delete
                            </i>
                            <p className="mb-0 text-decoration-underline">
                              Borrar Etapa
                            </p>
                          </button>
                        </div>
                        {/* )} */}
                        {!solo_lectura && (
                          <button
                            className="btn-secundario-s m-2"
                            type="button"
                            onClick={agregarGrupo}
                          >
                            <i className="material-symbols-rounded me-2">add</i>
                            <p className="mb-0 text-decoration-underline">
                              Agregar ficha técnica
                            </p>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-info" >
                   No hay regiones con recomendación favorable en la selección. Esta sección del formulario es solo para las regiones con recomendación favorable.
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
