import { useContext, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { validacionFichaInformaticos } from '../../../validaciones/esquemasFichas';
import { FormGOREContext } from '../../../context/FormGore';

export const FichaInformatico = ({ dataInformatico, solo_lectura }) => {
  const [fichasTecnicas, setFichasTecnicas] = useState(dataInformatico);
  const { updatePasoGore } = useContext(FormGOREContext);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validacionFichaInformaticos),
    mode: 'onBlur',
  });

  useEffect(() => {
    setFichasTecnicas(Array.isArray(dataInformatico) ? dataInformatico : []);
  }, [dataInformatico]);

  const [inputStatus, setInputStatus] = useState({
    nombre_plataforma: { loading: false, saved: false },
    descripcion_tecnica: { loading: false, saved: false },
    costo: { loading: false, saved: false },
    funcion: { loading: false, saved: false },
  });

  const agregarFichaTecnica = async () => {
    const nuevaFichaPayload = {
      nombre_plataforma: '',
      descripcion_tecnica: '',
      costo: null,
      funcion: '',
      sector: null,
      sector_nombre: '',
      subtitulo_label_value: { label: 'Sub. 29', value: '9' },
      item_subtitulo: 43,
      item_subtitulo_label_value: {
        label: '07 - Programas Informáticos',
        value: '43',
      },
    };

    try {
      const respuesta = await updatePasoGore({
        p_3_2_a_sistemas_informaticos: [nuevaFichaPayload],
      });
      if (respuesta && respuesta.fichaCreada) {
        setFichasTecnicas((fichasActuales) => [
          ...fichasActuales,
          respuesta.fichaCreada,
        ]);
      } else {
        console.error('La ficha técnica no fue creada correctamente');
      }
    } catch (error) {
      console.error('Error al agregar la ficha técnica', error);
    }
  };

  const handleUpdate = async (fichaId, field, value) => {
    let finalValue = value;
    if (field === 'costo') {
      finalValue = value.replace(/\./g, '');
    }
    setInputStatus((prev) => ({
      ...prev,
      [fichaId]: {
        ...prev[fichaId],
        [field]: { value, loading: false, saved: false },
      },
    }));

    try {
      const payload = {
        p_3_2_a_sistemas_informaticos: [
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

  const eliminarFichaTecnica = async (idFicha) => {
    const nuevasFichas = fichasTecnicas.filter((ficha) => ficha.id !== idFicha);
    setFichasTecnicas(nuevasFichas);
    try {
      await updatePasoGore({
        p_3_2_a_sistemas_informaticos: [
          {
            id: idFicha,
            DELETE: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error eliminando la ficha:', error);
    }
  };

  const onSubmit = () => {
    agregarFichaTecnica();
  };

  return (
    <>
      <div>
        <div className="pe-5 me-5 mt-4 col-12">
          <span className="my-4 text-sans-h4">
            a. Ficha de sistemas informáticos
          </span>
          <form onSubmit={handleSubmit(onSubmit)}>
            {Array.isArray(fichasTecnicas) &&
              fichasTecnicas?.map((ficha, index) => (
                <div key={ficha.id} className="col-10 mt-5 mb-3 border-bottom">
                  {/* Nombre de Plataforma o Software */}
                  <div className="d-flex flex-row col">
                    <div className="mt-2 me-3">{index + 1}</div>
                    <div className="my-2 col-3 text-sans-p-bold">
                      Nombre de Plataforma o Software
                    </div>
                    <div className="mb-2 pt-2 col ms-3">
                      <Controller
                        control={control}
                        name={`fichas[${index}].nombre_plataforma`}
                        defaultValue={ficha.nombre_plataforma || ''}
                        render={({ field, fieldState: { error } }) => (
                          <CustomTextarea
                            {...field}
                            placeholder="Escribe el nombre de la plataforma o software"
                            error={error?.message}
                            readOnly={solo_lectura}
                            maxLength={500}
                            loading={
                              inputStatus[ficha.id]?.nombre_plataforma
                                ?.loading && !error
                            }
                            saved={
                              inputStatus[ficha.id]?.nombre_plataforma?.saved &&
                              !error
                            }
                            onBlur={(e) => {
                              field.onBlur();
                              if (
                                ficha.nombre_plataforma !== e.target.value &&
                                !error
                              ) {
                                handleUpdate(
                                  ficha.id,
                                  'nombre_plataforma',
                                  e.target.value
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Descripción técnica y versiones */}
                  <div className="d-flex flex-row col">
                    <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                      Descripción técnica y versiones
                    </div>
                    <div className="my-3 col">
                      <Controller
                        control={control}
                        name={`fichas[${index}].descripcion_tecnica`}
                        defaultValue={ficha.descripcion_tecnica || ''}
                        render={({ field, fieldState: { error } }) => (
                          <CustomTextarea
                            {...field}
                            placeholder="Indique la versión y una descripción técnica del software o plataforma"
                            error={error?.message}
                            readOnly={solo_lectura}
                            maxLength={500}
                            loading={
                              inputStatus[ficha.id]?.descripcion_tecnica
                                ?.loading && !error
                            }
                            saved={
                              inputStatus[ficha.id]?.descripcion_tecnica
                                ?.saved && !error
                            }
                            onBlur={(e) => {
                              field.onBlur();
                              if (
                                ficha.descripcion_tecnica !== e.target.value &&
                                !error
                              ) {
                                handleUpdate(
                                  ficha.id,
                                  'descripcion_tecnica',
                                  e.target.value
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Costo */}
                  <div className="d-flex flex-row col">
                    <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                      Costo (M$)
                    </div>
                    <div className="d-flex flex-row col">
                      <div className="my-3 col-5 me-3">
                        <Controller
                          name={`fichas[${index}].costo`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <InputCosto
                              {...field}
                              value={ficha.costo || ''}
                              placeholder="Costo del recurso"
                              error={error?.message}
                              disabled={solo_lectura}
                              loading={
                                inputStatus[ficha.id]?.costo?.loading && !error
                              }
                              saved={
                                inputStatus[ficha.id]?.costo?.saved && !error
                              }
                              onBlur={(e) => {
                                field.onBlur();
                                if (ficha.costo !== e.target.value && !error) {
                                  handleUpdate(
                                    ficha.id,
                                    'costo',
                                    e.target.value
                                  );
                                }
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="d-flex col-10 mb-5 mt-3">
                        <div className="border border-1 col-3  py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc px-2 my-3 text-center">
                            {ficha.subtitulo_label_value?.label}
                          </div>
                        </div>
                        <div className="border border-1 col-3 py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc  px-1 m-1">
                            {ficha.item_subtitulo_label_value?.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Función en el ejercicio de la competencia identificando perfiles de usuario */}
                  <div className="d-flex flex-row col">
                    <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                      Función en el ejercicio de la competencia identificando
                      perfiles de usuario
                    </div>
                    <div className="my-3 col">
                      <Controller
                        name={`fichas[${index}].funcion`}
                        control={control}
                        defaultValue={ficha.funcion || ''}
                        render={({ field, fieldState: { error } }) => (
                          <CustomTextarea
                            {...field}
                            readOnly={solo_lectura}
                            placeholder="Describe la función en el ejercicio de la competencia y los perfiles de usuario."
                            maxLength={500}
                            error={error?.message}
                            loading={
                              inputStatus[ficha.id]?.funcion?.loading && !error
                            }
                            saved={
                              inputStatus[ficha.id]?.funcion?.saved && !error
                            }
                            onBlur={(e) => {
                              field.onBlur();
                              if (ficha.funcion !== e.target.value && !error) {
                                handleUpdate(
                                  ficha.id,
                                  'funcion',
                                  e.target.value
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Botón para borrar la ficha */}
                  <div className="col-12 d-flex justify-content-end">
                    {fichasTecnicas.length > 1 && (
                      <button
                        className="btn-terciario-ghost ms-2 mb-2"
                        onClick={() => eliminarFichaTecnica(ficha.id)}
                      >
                        <i className="material-symbols-rounded me-2">delete</i>
                        <p className="mb-0 text-decoration-underline">
                          Borrar ficha
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              ))}

            <div>
              {!solo_lectura && (
                <button
                  className="btn-secundario-s m-2"
                  type="button"
                  onClick={agregarFichaTecnica}
                >
                  <i className="material-symbols-rounded me-2">add</i>
                  <p className="mb-0 text-decoration-underline">
                    Agregar ficha técnica
                  </p>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
