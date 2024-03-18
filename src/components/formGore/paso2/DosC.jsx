import React, { useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionFluctuacion } from '../../../validaciones/esquemaFluctuacion';
import { FormGOREContext } from '../../../context/FormGore';

// const inputNumberStyle = {
//   // Estilos para ocultar flechas en navegadores que usan Webkit y Mozilla
//   MozAppearance: 'textfield',
//   '&::-webkit-outer-spin-button': {
//     WebkitAppearance: 'none',
//     margin: 0,
//   },
//   '&::WebkitOuterSpinButton': {
//     WebkitAppearance: 'none',
//     margin: 0,
//   },
// };

export const Fluctuaciones = ({ id, dataGastos, solo_lectura, stepNumber }) => {
  const [datosGastos, setDatosGastos] = useState([]);
  const { updatePasoGore, refetchTriggerGore } = useContext(FormGOREContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  useEffect(() => {
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map((item) => ({
        ...item,
        costo_anio_gore: item.costo_anio_gore?.map((costo) => ({
          ...costo,
          estados: {
            loading: false,
            saved: false,
          },
        })),
        estados: {
          descripcion: {
            loading: false,
            saved: false,
          },
        },
      }));
      setDatosGastos(formattedData);
    }
  }, [dataGastos]);

  useEffect(() => {
    const esquema = validacionFluctuacion(datosGastos);
    setEsquemaValidacion(esquema);
  }, [datosGastos]);

  const {
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  if (!datosGastos.length) {
    return <div>Cargando datos...</div>;
  }

  // Función para recargar campos por separado
  const updateFieldState = (subtituloId, costoAnioId, fieldName, newState) => {
    setDatosGastos((prevDatosGastos) =>
      prevDatosGastos.map((subtitulo) => {
        if (subtitulo.id === subtituloId) {
          if (fieldName === 'costo' && costoAnioId) {
            // Encuentra el costo específico para actualizar su estado
            const updatedCostoAnio = subtitulo.costo_anio_gore.map(
              (costoAnio) => {
                if (costoAnio.id === costoAnioId) {
                  return {
                    ...costoAnio,
                    estados: { ...costoAnio.estados, ...newState },
                  };
                }
                return costoAnio;
              }
            );
            return { ...subtitulo, costo_anio_gore: updatedCostoAnio };
          } else {
            // Actualiza el estado de la descripción del subtitulo
            return {
              ...subtitulo,
              estados: { ...subtitulo.estados, descripcion: { ...newState } },
            };
          }
        }
        return subtitulo;
      })
    );
  };

  console.log(dataGastos);
  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (subtituloId, campo, valor) => {
    // Actualiza el estado con la nueva estructura
    setDatosGastos((prev) =>
      prev.map((item) => {
        if (item.id === subtituloId) {
          return { ...item, [campo]: valor };
        }
        return item;
      })
    );
  };

  // Función de guardado
  const handleSave = async (
    subtituloId,
    costoAnioId,
    fieldName,
    fieldValue
  ) => {
    // Simula el inicio de una operación de guardado
    updateFieldState(subtituloId, costoAnioId, fieldName, {
      loading: true,
      saved: false,
    });

    let payload;

    if (fieldName === 'descripcion') {
      payload = {
        p_2_1_c_fluctuaciones_presupuestarias: [
          { id: subtituloId, descripcion: fieldValue },
        ],
      };
    } else if (fieldName === 'costo') {
      payload = {
        p_2_1_c_fluctuaciones_presupuestarias: [
          {
            id: subtituloId,
            costo_anio_gore: [{ id: costoAnioId, costo: fieldValue }],
          },
        ],
      };
    }

    try {
      await updatePasoGore(id, stepNumber, payload);
      updateFieldState(subtituloId, costoAnioId, fieldName, {
        loading: false,
        saved: true,
      });
      refetchTriggerGore();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      updateFieldState(subtituloId, costoAnioId, fieldName, {
        loading: false,
        saved: false,
      });
    }
  };

  // Asume que tienes una lista de headers para los años, necesaria para renderizar las columnas
  const headers =
    datosGastos.length > 0
      ? datosGastos[0].costo_anio_gore.map((costo) => costo.anio.toString())
      : [];

  return (
    <div className="pe-5 me-5 mt-5 col-12">
      <span className="my-4 text-sans-h4">
        c. Fluctuaciones presupuestarias
      </span>
      <div className="text-sans-h6-primary my-3 col-11">
        <h6>
          Se deben incorporar, desagregados por subtitulo, los montos anuales
          asociados al ejercicio de la competencia, donde n+1 corresponde al año
          en que el Gobierno Regional comenzaria a ejercer la competencia. Este
          ejercicio debe considerar la variacion presupuestaria reportada por el
          Ministerio o Servicio de origen en la Tabla N°11, asi como los
          recursos que el propio Gobierno Regional proyecte inyectar al
          ejercicio de la competencia para mejorar su desempeño. Se deben
          detallar las fluctuaciones presupuestarias contempladas para el
          periodo de ejercicio en régimen de la competencia, el que abarca los
          años n+1, n+2, n+3, n+4, y n+5:{' '}
        </h6>
      </div>
      <div className="my-4 col-11 mt-5">
        <table className="table table-borderless table-striped">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold pt-2">
                Subtítulo
              </th>
              {headers &&
                headers.map((year, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="text-sans-p text-center"
                  >
                    <u>{year}</u>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {datosGastos.map((item, rowIndex) => (
              <React.Fragment key={item.id}>
                <tr>
                  <th scope="row" className="text-sans-p-bold pt-2">
                    <u>{item.nombre_subtitulo}</u>
                  </th>
                  {headers.map((year, colIndex) => {
                    // Encuentra el costo correspondiente al año
                    const costoAnio = item?.costo_anio_gore?.find(
                      (anio) => anio.anio === parseInt(year)
                    );
                    return (
                      <td key={`${rowIndex}-${colIndex}`} className="px-1">
                        <Controller
                          control={control}
                          name={`costo_${costoAnio?.id}`}
                          defaultValue={costoAnio?.costo || ''}
                          render={({ field }) => {
                            // Destructura las propiedades necesarias de field
                            const { onChange, onBlur, value } = field;

                            const handleChange = (valor) => {
                              clearErrors(`costo_${costoAnio.id}`);
                              onChange(valor);
                              handleInputChange(
                                item.id,
                                costoAnio.id,
                                'costo',
                                valor
                              );
                            };

                            // Función para manejar el evento onBlur
                            const handleBlur = async () => {
                              const isFieldValid = await trigger(
                                `costo_${costoAnio.id}`
                              );
                              if (isFieldValid) {
                                handleSave(
                                  item.id,
                                  costoAnio.id,
                                  'costo',
                                  field.value
                                );
                              }
                              onBlur();
                            };
                            return (
                              <InputCosto
                                id={`costo_${costoAnio?.id}`}
                                placeholder="Costo (M$)"
                                value={value}
                                // style={inputNumberStyle}
                                disabled={solo_lectura}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                loading={costoAnio.estados?.loading ?? false}
                                saved={costoAnio.estados?.saved ?? false}
                                error={errors[`costo_${costoAnio.id}`]?.message}
                              />
                            );
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td colSpan={headers.length + 1} className="px-0 my-5">
                    <div className="mt-2">
                      <Controller
                        control={control}
                        name={`descripcion_${item.id}`}
                        defaultValue={item?.descripcion || ''}
                        render={({ field }) => {
                          // Destructura las propiedades necesarias de field
                          const { onChange, onBlur, value } = field;

                          const handleChange = (e) => {
                            clearErrors(`descripcion_${item.id}`);
                            onChange(e.target.value);
                            handleInputChange(
                              item.id,
                              null,
                              'descripcion',
                              e.target.value
                            );
                          };

                          const handleBlur = async () => {
                            const isFieldValid = await trigger(
                              `descripcion_${item.id}`
                            );
                            if (isFieldValid) {
                              handleSave(
                                item.id,
                                null,
                                'descripcion',
                                field.value
                              );
                            }
                            onBlur();
                          };

                          return (
                            <CustomTextarea
                              id={`descripcion_${item?.id}`}
                              value={value}
                              label="Descripción (Opcional)"
                              placeholder="Describe la evolución del gasto por subtitulo"
                              maxLength={500}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${
                                rowIndex % 2 === 0
                                  ? 'bg-color-even'
                                  : 'bg-color-odd'
                              }`}
                              readOnly={solo_lectura}
                              loading={
                                item.estados?.descripcion?.loading ?? false
                              }
                              saved={item.estados?.descripcion?.saved ?? false}
                              error={errors[`descripcion_${item.id}`]?.message}
                            />
                          );
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <hr />
      </div>
    </div>
  );
};
