import React, { useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionFluctuacion } from '../../../validaciones/esquemaFluctuacion';
import { FormGOREContext } from '../../../context/FormGore';

const inputNumberStyle = {
  // Estilos para ocultar flechas en navegadores que usan Webkit y Mozilla
  MozAppearance: 'textfield',
  '&::WebkitOuterSpinButton': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&::WebkitOuterSpinButton': {
    WebkitAppearance: 'none',
    margin: 0,
  },
};

export const Fluctuaciones = ({ id, dataGastos, solo_lectura }) => {
  const [datosGastos, setDatosGastos] = useState([]);
  const { updatePasoGore } = useContext(FormGOREContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);
  const [inputStatus, setInputStatus] = useState({});

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

  useEffect(() => {
  
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map((item) => {
        
        return {
          ...item,
          costo_anio_gore: item.costo_anio_gore?.map((costo) => {
            return {
              ...costo,
              estados: {
                loading: false,
                saved: false,
              },
            };
          }),
          estados:{
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



  if (!datosGastos.length) {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando datos...</div>;
  }


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

  const updateInputStatus = (arrayNameId, loading, saved) => {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [arrayNameId]: { loading, saved }
    }));
  };

  // Función de guardado
  const handleSave = async (subtituloId, costoAnioId, fieldName, fieldValue) => {
    const isDescripcion = fieldName === 'descripcion';
    const arrayNameId = isDescripcion ? `descripcion_${subtituloId}` : `costo_${costoAnioId}`;
    // Indica que el guardado está en proceso
    updateInputStatus(arrayNameId, true, false);
  
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
      updateInputStatus(arrayNameId, false, true);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      // En caso de error, actualiza el estado para reflejar el fallo
      updateInputStatus(arrayNameId, false, false);
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
                                style={inputNumberStyle}
                                disabled={solo_lectura}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                loading={inputStatus[`costo_${costoAnio?.id}`]?.loading ?? false}
                                saved={inputStatus[`costo_${costoAnio?.id}`]?.saved ?? false}
                                error={errors[`costo_${costoAnio?.id}`]?.message}
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
                              label="Descripción"
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
                              loading={inputStatus[`descripcion_${item.id}`]?.loading ?? false}
                              saved={inputStatus[`descripcion_${item.id}`]?.saved ?? false}
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