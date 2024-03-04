import React,{ useContext, useState, useEffect } from "react";
import { FormularioContext } from "../../context/FormSectorial";
import CustomTextarea from "../forms/custom_textarea";
import CustomInput from "../forms/custom_input";
import InputCosto from "../forms/input_costo";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { construirValidacionPaso5_2evolucion } from "../../validaciones/esquemaValidarPaso5Sectorial";

const inputNumberStyle = {
  // Estilos para ocultar flechas en navegadores que usan Webkit y Mozilla
  MozAppearance: 'textfield',
  '&::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&::WebkitOuterSpinButton': {
    WebkitAppearance: 'none',
    margin: 0,
  },
};

export const GastosEvolucionVariacion = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  dataGastos,
  setRefreshSubpaso_CincoDosVariacion

}) => {

  const [datosGastos, setDatosGastos] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);
  const [glosasEspecificasLoading, setGlosasEspecificasLoading] = useState(false);
  const [glosasEspecificasSaved, setGlosasEspecificasSaved] = useState(false)

  useEffect(() => {
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map(item => ({
        ...item,
        costo_anio: item?.costo_anio?.map(costo => ({
          ...costo,
          estados: {
            loading: false,
            saved: false
          }
        })),
        estados: {
          descripcion: {
            loading: false,
            saved: false
          }
        }
      }));
      setDatosGastos(formattedData);
    }
  }, [dataGastos]);

  useEffect(() => {
    const esquema = construirValidacionPaso5_2evolucion(datosGastos);
    setEsquemaValidacion(esquema);
  }, [datosGastos]);

  const { control, trigger, clearErrors, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  if (!datosGastos) {
    return <div>Cargando datos...</div>;
  }

  if (!datosGastos || datosGastos.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  const headers = paso5.años

  // Función para recargar campos por separado
  const updateFieldState = (subtituloId, costoAnioId, fieldName, newState) => {
    setDatosGastos(prevDatosGastos =>
      prevDatosGastos.map(subtitulo => {
        if (subtitulo.id === subtituloId) {
          if (fieldName === 'costo' && costoAnioId) {
            // Encuentra el costo específico para actualizar su estado
            const updatedCostoAnio = subtitulo.costo_anio.map(costoAnio => {
              if (costoAnio.id === costoAnioId) {
                return { ...costoAnio, estados: { ...costoAnio.estados, ...newState } };
              }
              return costoAnio;
            });
            return { ...subtitulo, costo_anio: updatedCostoAnio };
          } else {
            // Actualiza el estado de la descripción del subtitulo
            return { ...subtitulo, estados: { ...subtitulo.estados, descripcion: { ...newState } } };
          }
        }
        return subtitulo;
      })
    );
  };
    

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (instanciaId, campo, valor) => {
    setDatosGastos(prevInstancia =>
      prevInstancia.map(elemento => {
        // Verifica si es la costo que estamos actualizando
        if (elemento.id === instanciaId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...elemento, [campo]: valor };
        }
        // Si no es la costo que estamos actualizando, la retorna sin cambios
        return elemento;
      })
    );
  };

  // Función de guardado
  const handleSave = async (subtituloId, costoAnioId, fieldName, fieldValue) => {

    updateFieldState(subtituloId, costoAnioId, fieldName, { loading: true, saved: false });

    let payload;

    if (fieldName === 'descripcion') {
      payload = {
        'p_5_2_evolucion_gasto_asociado': [{ id: subtituloId, [fieldName]: fieldValue}]
      };
    } else if (fieldName === 'costo') {
      
      // Payload para otros campos
      payload = {
        'p_5_2_evolucion_gasto_asociado': [{
          id:subtituloId,
          'costo_anio': [{
            id: costoAnioId,
            costo: fieldValue
          }]
        }]
      };
    } else {
      setGlosasEspecificasLoading(true);
      setGlosasEspecificasSaved(false);
      payload = {
        'paso5': { "glosas_especificas": fieldValue }
      };
    }

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(subtituloId, costoAnioId, fieldName, { loading: false, saved: true });
      setGlosasEspecificasLoading(false);
      setGlosasEspecificasSaved(true);
      setRefreshSubpaso_CincoDosVariacion(true);

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      updateFieldState(subtituloId, costoAnioId, fieldName, { loading: false, saved: false });
      setGlosasEspecificasLoading(false);
      setGlosasEspecificasSaved(false);
    }
  };


  return (
    <div className="mt-4">
      <div className="my-4">
        <table className="table table-borderless table-striped">

          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold pt-2">Subtítulo</th>
              {headers && headers.map((year, index) => (
                <th key={index} scope="col" className="text-sans-p text-center">
                  <u>{year}</u>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {datosGastos.map((item, rowIndex) => (
              <React.Fragment key={item.id}>
                <tr>
                  <th scope="row" className="text-sans-p-bold pt-2"><u>{item.nombre_subtitulo}</u></th>
                  {headers.map((year, colIndex) => {
                    // Encuentra el costo correspondiente al año
                    const costoAnio = item?.costo_anio?.find(anio => anio.anio === parseInt(year));
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
                              handleInputChange(item.id, costoAnio.id, 'costo', valor);
                            };

                            // Función para manejar el evento onBlur
                            const handleBlur = async () => {
                              const isFieldValid = await trigger(`costo_${costoAnio.id}`);
                              if (isFieldValid) {
                                handleSave(item.id, costoAnio.id, 'costo', field.value);
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
                            handleInputChange(item.id, null, 'descripcion', e.target.value);
                          };

                          const handleBlur = async () => {
                            const isFieldValid = await trigger(`descripcion_${item.id}`);
                            if (isFieldValid) {
                              handleSave(item.id, null, 'descripcion', field.value);
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
                              className={`form-control ${rowIndex % 2 === 0 ? "bg-color-even" : "bg-color-odd"}`}
                              readOnly={solo_lectura}
                              loading={item.estados?.descripcion?.loading ?? false}
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
        <div className="mt-4">
          <Controller
            control={control}
            name="glosas_especificas"
            defaultValue={paso5.glosas_especificas || ''}
            render={({ field }) => {
              // Destructura las propiedades necesarias de field
              const { onChange, onBlur, value } = field;

              const handleChange = (e) => {
                clearErrors("glosas_especificas");
                onChange(e.target.value);
                handleInputChange('glosas_especificas', e.target.value);
              };

              // Función para manejar el evento onBlur
              const handleBlur = async () => {
                const isFieldValid = await trigger("glosas_especificas");
                if (isFieldValid) {
                  handleSave(null, null, 'glosas_especificas', value);
                }
                onBlur();
              };

              return (
                <CustomTextarea
                  id="glosas_especificas"
                  name="glosas_especificas"
                  label="Glosas específicas (Opcional)"
                  placeholder="Describe las glosas específicas."
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  loading={glosasEspecificasLoading}
                  saved={glosasEspecificasSaved}
                  readOnly={solo_lectura}
                />
              );
            }}
          />
          <div className="d-flex mb-3 pt-0">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1 text-sans-h6-primary">Si existen glosas especificas para el ejercicio de la competencia,
              deben ser incluidas describiendo aquello que permite financiar.</h6>
          </div>
        </div>
      </div>
    </div>
  );
}