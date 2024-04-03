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

export const Fluctuaciones = ({ id, dataGastos, solo_lectura }) => {
  const [datosGastos, setDatosGastos] = useState([]);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);

  useEffect(() => {
    // Intenta leer los datos almacenados de localStorage
    const storedDataJSON = localStorage.getItem('datosGastosState');
    const storedData = storedDataJSON ? JSON.parse(storedDataJSON) : null;
  
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map((item) => {
        // Encuentra el item correspondiente en el estado almacenado, si existe
        const storedItem = storedData ? storedData.find(storedItem => storedItem.id === item.id) : null;
        return {
          ...item,
          costo_anio_gore: item.costo_anio_gore?.map((costo) => {
            const storedCosto = storedItem?.costo_anio_gore.find(storedCosto => storedCosto.id === costo.id);
            return {
              ...costo,
              estados: storedCosto?.estados || {
                loading: false,
                saved: false,
              },
            };
          }),
          estados: storedItem?.estados || {
            descripcion: {
              loading: false,
              saved: false,
            },
          },
        };
      });
      // Actualiza el estado con los datos formateados
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
    setDatosGastos((prevDatosGastos) => {
      const newDatosGastos = prevDatosGastos.map((subtitulo) => {
        if (subtitulo.id === subtituloId) {
          // Clonando subtitulo para evitar mutaciones directas del estado
          let updatedSubtitulo = { ...subtitulo };
          if (fieldName === 'costo' && costoAnioId) {
            // Actualizando el estado del costo específico
            updatedSubtitulo.costo_anio_gore = subtitulo.costo_anio_gore.map((costoAnio) => {
              if (costoAnio.id === costoAnioId) {
                return {
                  ...costoAnio,
                  estados: { ...costoAnio.estados, ...newState },
                };
              }
              return costoAnio;
            });
          } else if (fieldName === 'descripcion') {
            // Actualizando el estado de la descripción
            updatedSubtitulo.estados = { ...subtitulo.estados, descripcion: { ...newState } };
          }
          return updatedSubtitulo;
        }
        return subtitulo;
      });
      // Almacenar el nuevo estado en Local Storage para persistencia entre recargas
      localStorage.setItem('datosGastosState', JSON.stringify(newDatosGastos));
      return newDatosGastos;
    });
  };

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
  const handleSave = async (subtituloId, costoAnioId, fieldName, fieldValue) => {
    // Indica que el guardado está en proceso
    updateFieldState(subtituloId, costoAnioId, fieldName, {
      loading: true,
      saved: false,
    });
  
    // Prepara el payload específico para el campo actualizado
    let specificPayload;
    if (fieldName === 'descripcion') {
      specificPayload = { descripcion: fieldValue };
    } else if (fieldName === 'costo') {
      specificPayload = { 
        costo_anio_gore: [{
          id: costoAnioId, 
          costo: fieldValue
        }]
      };
    }
    // Payload general para el envío
    const payload = {
      id: id, // El ID del formulario o entidad a actualizar
      p_2_1_c_fluctuaciones_presupuestarias: [{
        id: subtituloId,
        ...specificPayload,
      }],
    };
  
    try {
      // Envío de la actualización al backend
      await updatePasoGore(payload);
      // Si la actualización es exitosa, actualiza el estado para reflejar el éxito
      updateFieldState(subtituloId, costoAnioId, fieldName, {
        loading: false,
        saved: true,
      });
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      // En caso de error, actualiza el estado para reflejar el fallo
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
                                //disabled={solo_lectura}
                                readOnly={solo_lectura}
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