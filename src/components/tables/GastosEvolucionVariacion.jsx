import React, { useContext, useState, useEffect } from "react";
import { FormularioContext } from "../../context/FormSectorial";
import CustomTextarea from "../forms/custom_textarea";
import InputCosto from "../forms/input_costo";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { construirValidacionPaso5_2evolucion } from "../../validaciones/esquemaValidarPaso5Sectorial";

const inputNumberStyle = {
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
  años,
  region,
}) => {
  const [datosGastos, setDatosGastos] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [esquemaValidacion, setEsquemaValidacion] = useState(null);
  const [glosasEspecificasLoading, setGlosasEspecificasLoading] = useState(false);
  const [glosasEspecificasSaved, setGlosasEspecificasSaved] = useState(false);
  const [inputStatus, setInputStatus] = useState({});

  useEffect(() => {
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map(item => ({
        ...item,
        costo_anio: item?.costo_anio?.map(costo => ({ ...costo }))
      }));
      setDatosGastos(formattedData);
    }
  }, [dataGastos]);

  const paso5Data = Array.isArray(paso5) && paso5.length > 0 ? paso5[0] : {};

  const {
    id: paso5Id,
    glosas_especificas
  } = paso5Data;

  useEffect(() => {
    const esquema = construirValidacionPaso5_2evolucion(datosGastos);
    setEsquemaValidacion(esquema);
  }, [datosGastos]);

    
  const { control, trigger, clearErrors, formState: { errors } } = useForm({
    resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  if (!datosGastos) {
    return <div className="text-center text-sans-h5-medium-blue ">Cargando datos...</div>;
  }

  if (datosGastos.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  const headers = años || [];

  const handleInputChange = (instanciaId, campo, valor) => {
    setDatosGastos(prevInstancia =>
      prevInstancia.map(elemento => {
        if (elemento.id === instanciaId) {
          return { ...elemento, [campo]: valor };
        }
        return elemento;
      })
    );
  };

  const handleSave = async (subtituloId, costoAnioId, fieldName, fieldValue) => {
    const arrayNameId = fieldName === 'descripcion' ? `descripcion_${subtituloId}` : `costo_${costoAnioId}`;
  
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [arrayNameId]: {
        loading: true,
        saved: false,
      },
    }));
  
    let payload;
    if (fieldName === 'descripcion') {
      payload = {
        regiones: [
          {
            region: region,
            'p_5_2_evolucion_gasto_asociado': [{ id: subtituloId, [fieldName]: fieldValue }]
          },
        ],
      };
    } else if (fieldName === 'costo') {
      payload = {
        regiones: [
          {
            region: region,
            'p_5_2_evolucion_gasto_asociado': [{
              id: subtituloId,
              'costo_anio': [{
                id: costoAnioId,
                costo: fieldValue
              }]
            }]
          }
        ]
      };
    } else {
      setGlosasEspecificasLoading(true);
      setGlosasEspecificasSaved(false);
      payload = {
        regiones: [
          {
            region: region,
            'paso5': [{ 
              "id": paso5Id,
              "glosas_especificas": fieldValue 
            }]
          }
        ]
      };
    }
  
    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [arrayNameId]: {
          loading: false,
          saved: true,
        },
      }));
  
      if (fieldName === 'glosas_especificas') {
        setGlosasEspecificasLoading(false);
        setGlosasEspecificasSaved(true);
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [arrayNameId]: {
          loading: false,
          saved: false,
        },
      }));
  
      if (fieldName === 'glosas_especificas') {
        setGlosasEspecificasLoading(false);
        setGlosasEspecificasSaved(false);
      }
    }
  };
  
  return (
    <div className="mt-4">
      <div className="my-4">
        <table className="table table-borderless table-striped">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold pt-2">Subtítulo</th>
              {headers.map((year, index) => (
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
                    const costoAnio = item?.costo_anio?.find(anio => anio.anio === parseInt(year));
                    const isLastYear = parseInt(year) === Math.max(...headers.map(Number));
                    return (
                      <td key={`${rowIndex}-${colIndex}`} className="px-1">
                        <Controller
                          control={control}
                          name={`costo_${costoAnio?.id}`}
                          defaultValue={costoAnio?.costo || ''}
                          render={({ field }) => {
                            const { onChange, onBlur, value } = field;
                            const handleChange = (valor) => {
                              onChange(valor);
                              handleInputChange(item.id, costoAnio.id, 'costo', valor);
                            };
                            const handleBlur = async () => {
                              const isFieldValid = await trigger(`costo_${costoAnio.id}`);
                              if (isFieldValid) {
                                handleSave(item.id, costoAnio.id, 'costo', value);
                              }
                              onBlur();
                            };
                            return (
                              <InputCosto
                                id={`costo_${costoAnio?.id}`}
                                placeholder="Costo (M$)"
                                value={costoAnio?.costo || ''}
                                style={inputNumberStyle}
                                disabled={solo_lectura || isLastYear}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                loading={inputStatus[`costo_${costoAnio?.id}`]?.loading ?? false}
                                saved={inputStatus[`costo_${costoAnio?.id}`]?.saved ?? false}
                                error={errors[`costo_${costoAnio}`]?.message}
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
                              id={`descripcion_${item.id}`}
                              value={value}
                              label="Descripción (Opcional)"
                              placeholder="Describe la evolución del gasto por subtitulo"
                              maxLength={500}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${rowIndex % 2 === 0 ? "bg-color-even" : "bg-color-odd"}`}
                              readOnly={solo_lectura}
                              loading={inputStatus[`descripcion_${item.id}`]?.loading ?? false}
                              saved={inputStatus[`descripcion_${item.id}`]?.saved ?? false}
                              error={errors[`descripcion_${item}`]?.message}
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
            defaultValue={glosas_especificas || ''}
            render={({ field }) => {
              const { onChange, onBlur, value } = field;

              const handleChange = (e) => {
                clearErrors("glosas_especificas");
                onChange(e.target.value);
                handleInputChange('glosas_especificas', e.target.value);
              };

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
                  maxLength={1100}
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
};
