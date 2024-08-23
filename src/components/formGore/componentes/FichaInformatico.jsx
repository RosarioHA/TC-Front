import { useContext, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { validacionFichaInformaticos } from '../../../validaciones/esquemasFichas';
import { FormGOREContext } from '../../../context/FormGore';

export const FichaInformatico = ({
  idItem,
  dataInformatico,
  sufijo_costos,
  solo_lectura,
  nombre_costo
}) => {
  const [fichasTecnicas, setFichasTecnicas] = useState(dataInformatico);
  const { updatePasoGore } = useContext(FormGOREContext);
  const { control, handleSubmit, reset, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(validacionFichaInformaticos),
    mode: 'onBlur',
  });

  useEffect(() => {
    setFichasTecnicas(Array.isArray(dataInformatico) ? dataInformatico : []);
  }, [dataInformatico]);

  useEffect(() => {
    if (reset) {
      reset({
        fichas: fichasTecnicas
      });
    }
  }, [fichasTecnicas, reset]);
  

  const [inputStatus, setInputStatus] = useState({
    nombre_plataforma: { loading: false, saved: false },
    descripcion_tecnica: { loading: false, saved: false },
    costo: { loading: false, saved: false },
    funcion: { loading: false, saved: false },
  });

  const agregarFichaTecnica = async () => {
    const nuevaFichaPayload = {
      item_subtitulo: idItem,
      tipo_costo: nombre_costo
    };
  
    try {
      await updatePasoGore({
        p_3_2_a_sistemas_informaticos: [nuevaFichaPayload],
      });
      // Actualiza el estado local para reflejar la nueva ficha añadida
      setFichasTecnicas(prev => [...prev, nuevaFichaPayload]);
    } catch (error) {
      console.error('Error al agregar la ficha técnica', error);
    }
  };

  const handleAddFichaTecnica = async () => {
    const fichasLength = fichasTecnicas.length;
  
    // Validar solo los campos de la última ficha técnica antes de agregar una nueva
    const isValid = await trigger([
      `fichas[${fichasLength - 1}].nombre_plataforma`,
      `fichas[${fichasLength - 1}].descripcion_tecnica`,
      `fichas[${fichasLength - 1}].costo`,
      `fichas[${fichasLength - 1}].funcion`,
    ]);
  
    if (isValid) {
      agregarFichaTecnica();
    } else {
      console.error('Hay errores en los campos obligatorios de la ficha anterior');
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
        [field]: { value, loading: true, saved: false },
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

        <span className="my-4 text-sans-h4">
          a. Ficha de sistemas informáticos {`${sufijo_costos} `}
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            Tomando como base la informacion aportada por el Ministerio o
            Servicio de origen, agregue todas aquellas fichas técnicas de
            programas o softwares requeridos y que el Gobierno Regional no
            posee:
          </h6>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {console.log(fichasTecnicas)}
          {Array.isArray(fichasTecnicas) &&
            fichasTecnicas?.map((ficha, index) => (
              <div key={ficha?.id || `ficha_${index}`} className="col-11 mt-5 mb-3 border-bottom">
                {/* Nombre de Plataforma o Software */}
                {console.log(ficha, ficha.id)}
                <div className="d-flex flex-row col">
                  <div className="mt-2 me-3">{index + 1}</div>
                  <div className="my-2 col-3 text-sans-p-bold">
                    Nombre de Plataforma o Software
                  </div>
                  <div className="mb-2 pt-2 col ms-3">
                    <Controller
                      control={control}
                      name={`fichas[${index}].nombre_plataforma`}
                      defaultValue={ficha?.nombre_plataforma || ''}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextarea
                          {...field}
                          placeholder="Escribe el nombre de la plataforma o software"
                          error={error?.message}
                          readOnly={solo_lectura}
                          maxLength={500}
                          loading={inputStatus[ ficha.id ]?.nombre_plataforma?.loading && !error}
                          saved={inputStatus[ ficha.id ]?.nombre_plataforma?.saved && !error}
                          onBlur={async (e) =>
                          {
                            field.onBlur();  // React Hook Form manages the blur event
                            const isFieldValid = await trigger(`fichas[${index}].nombre_plataforma`);
                            if (isFieldValid && ficha?.nombre_plataforma !== e.target.value)
                            {
                              handleUpdate(ficha?.id, 'nombre_plataforma', e.target.value);
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
                      defaultValue={ficha?.descripcion_tecnica || ''}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextarea
                          {...field}
                          placeholder="Indique la versión y una descripción técnica del software o plataforma"
                          error={error?.message}
                          readOnly={solo_lectura}
                          maxLength={500}
                          loading={
                            inputStatus[ficha?.id]?.descripcion_tecnica
                              ?.loading && !error
                          }
                          saved={
                            inputStatus[ficha?.id]?.descripcion_tecnica?.saved &&
                            !error
                          }
                          onBlur={async (e) => {
                            field.onBlur();
                            const isFieldValid = await trigger(`fichas[${index}].descripcion_tecnica`);
                            if (isFieldValid && ficha?.descripcion_tecnica !== e.target.value) {
                              handleUpdate(ficha?.id, 'descripcion_tecnica', e.target.value);
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
                    <div className="my-3 col-4 me-3">
                      <Controller
                        name={`fichas[${index}].costo`}
                        control={control}
                        defaultValue={ficha?.costo || ''}
                        render={({ field, fieldState: { error } }) =>
                        {
                          const { onChange, onBlur, value } = field;

                          const handleBlur = async () =>
                          {
                            // Dispara la validación
                            const isFieldValid = await trigger(`fichas[${index}].costo`);
                            // Si el campo es válido y el valor ha cambiado, actualiza el servidor
                            if (isFieldValid && ficha?.costo !== value)
                            {
                              handleUpdate(ficha?.id, 'costo', value.replace(/\./g, ''));
                            }
                            onBlur();
                          };
                          return (
                            <InputCosto
                              id={`costo_${ficha?.id}`}
                              placeholder="Costo (M$)"
                              loading={inputStatus[ ficha?.id ]?.costo?.loading}
                              saved={inputStatus[ ficha?.id ]?.costo?.saved}
                              error={error?.message}
                              disabled={solo_lectura}
                              value={value}
                              onChange={onChange}
                              onBlur={handleBlur}
                            />
                          );
                        }}
                      />
                    </div>
                    <div className="d-flex col-5 mb-5 mt-3 gap-0">
                      <div className="border border-1 col">
                        <div className="text-sans-p-grayc px-2 my-3 mx-1 text-center">
                          {ficha.subtitulo_label_value?.label}
                        </div>
                      </div>
                      <div className="border border-1 col mx-2 px-1 ">
                        <div className="text-sans-p-grayc mx-2 my-1 w-auto text-wrap">
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
                      control={control}
                      name={`fichas[${index}].funcion`}
                      defaultValue={ficha?.funcion || ''}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextarea
                          {...field}
                          placeholder="Describe la función o rol del sistema"
                          error={error?.message}
                          readOnly={solo_lectura}
                          maxLength={500}
                          loading={
                            inputStatus[ficha?.id]?.funcion?.loading && !error
                          }
                          saved={
                            inputStatus[ficha?.id]?.funcion?.saved && !error
                          }
                          onBlur={async (e) => {
                            field.onBlur();
                            const isFieldValid = await trigger(`fichas[${index}].funcion`);
                            if (isFieldValid && ficha?.funcion !== e.target.value) {
                              handleUpdate(ficha?.id, 'funcion', e.target.value);
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
                onClick={handleAddFichaTecnica}
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
    </>
  );
};