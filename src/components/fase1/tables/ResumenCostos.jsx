import { useState, useContext, useEffect } from "react";
import CustomTextarea from "../forms/custom_textarea";
import { FormularioContext } from "../../../context/FormSectorial";
import { useForm, Controller } from "react-hook-form";

const ResumenCostos = ({
  id,
  region,
  data,
  paso5Id,
  costosTotales,
  descripcionCostosTotales,
  stepNumber,
  solo_lectura,
}) => {

  const [ResumenCostos, setResumenCostos] = useState(() => { return Array.isArray(data) ? data : []; });
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [descripcionCostosTotalesLoading, setDescripcionCostosTotalesLoading] = useState(false);
  const [descripcionCostosTotalesSaved, setDescripcionCostosTotalesSaved] = useState(false);
  const [inputStatus, setInputStatus] = useState({});

  const { control, trigger, clearErrors, setValue } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    setResumenCostos(Array.isArray(data) ? data : []);
  }, [data]);

  useEffect(() => {
    if (descripcionCostosTotales) {
      setValue("descripcionCostosTotales", descripcionCostosTotales);
    }
  }, [descripcionCostosTotales, setValue]);

  const formatearNumero = (numero) => {
    const valorNumerico = Number(numero);
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return numero;
  };

  const handleInputChange = (instanciaId, campo, valor) => {
    setResumenCostos(prevInstancia =>
      prevInstancia.map(elemento => {
        if (elemento.id === instanciaId) {
          return { ...elemento, [campo]: valor };
        }
        return elemento;
      })
    );
  };

  const handleSave = async (arrayNameId, fieldName, fieldValue) => {
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [arrayNameId]: {
        ...prevStatus[arrayNameId],
        [fieldName]: { loading: true, saved: false },
      },
    }));

    let payload;

    if (fieldName === 'descripcion') {
      payload = {
        regiones: [
          {
            region: region,
            'p_5_1_c_resumen_costos_por_subtitulo': [{ id: arrayNameId, [fieldName]: fieldValue }]
          }
        ]
      };
    } else if (fieldName === 'descripcion_costos_totales') {
      setDescripcionCostosTotalesLoading(true);
      setDescripcionCostosTotalesSaved(false);
      payload = {
        regiones: [
          {
            region: region,
            'paso5': [{ 
              "id": paso5Id,
              "descripcion_costos_totales": fieldValue 
            }]
          }
        ]
      };
    }

    try {
      await handleUpdatePaso(id, stepNumber, payload);

      if (fieldName === 'descripcion_costos_totales') {
        setDescripcionCostosTotalesLoading(false);
        setDescripcionCostosTotalesSaved(true);
      } else {
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [arrayNameId]: {
            ...prevStatus[arrayNameId],
            [fieldName]: { loading: false, saved: true },
          },
        }));
      }

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      if (fieldName === 'descripcion_costos_totales') {
        setDescripcionCostosTotalesLoading(false);
        setDescripcionCostosTotalesSaved(false);
      } else {
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [arrayNameId]: {
            ...prevStatus[arrayNameId],
            [fieldName]: { loading: false, saved: false },
          },
        }));
      }
    }
  };

  return (
    <div>
      <div className="ps-3 my-4">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="col-2">
            <p className="text-sans-p-bold mb-0 mt-1">Subtítulo</p>
          </div>
          <div className="col">
            <p className="text-sans-p-bold mb-0 mt-1">Total Anual (M$)</p>
          </div>
          <div className="col-7 d-flex">
            <p className="text-sans-p-bold mb-0 mt-1">Descripción</p>
            <p className="text-sans-p ms-2 mb-0">(Opcional)</p>
          </div>
        </div>

        {ResumenCostos.map((subtitulo, index) => (
          <div
            key={subtitulo.id}
            className={`row ${index % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
            <div className="d-flex justify-content-between py-3 fw-bold">
              <div className="col-2">
                <p className="text-sans-p-bold mb-0 mt-3 ms-4">{subtitulo.nombre_subtitulo}</p>
              </div>
              <div className="col">
                <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(subtitulo.total_anual)}</p>
              </div>
              <div className="col-7 ps-2">
                <Controller
                  control={control}
                  name={`descripcion_${subtitulo.id}`}
                  defaultValue={subtitulo?.descripcion || ''}
                  render={({ field }) => {
                    const { onChange, onBlur, value } = field;

                    const handleChange = (valor) => {
                      clearErrors(`descripcion_${subtitulo.id}`);
                      onChange(valor);
                      handleInputChange(subtitulo.id, 'descripcion', valor);
                    };

                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`descripcion_${subtitulo.id}`);
                      if (isFieldValid) {
                        handleSave(subtitulo.id, 'descripcion', value);
                      }
                      onBlur();
                    };

                    const handleKeyDown = (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        };


                    return (
                      <CustomTextarea
                        id={`descripcion_${subtitulo.id}`}
                        placeholder="Describe el costo por subtítulo."
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        loading={inputStatus[subtitulo.id]?.descripcion?.loading}
                            saved={inputStatus[subtitulo.id]?.descripcion?.saved}
                        readOnly={solo_lectura}
                        maxLength={300}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className={`row ${ResumenCostos.length % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="col-2">
              <p className="text-sans-p-bold mb-0 mt-3 ms-4">Costos <br /> totales</p>
            </div>
            <div className="col">
              <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(costosTotales)}</p>
            </div>
            <div className="col-7 ps-2">
              <Controller
                control={control}
                name="descripcionCostosTotales"
                defaultValue={descripcionCostosTotales || ''}
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;

                  const handleChange = (e) => {
                    clearErrors("descripcionCostosTotales");
                    onChange(e.target.value);
                  };

                  const handleBlur = async () => {
                    const isFieldValid = await trigger("descripcionCostosTotales");
                    if (isFieldValid) {
                      handleSave(null, 'descripcion_costos_totales', value);
                    }
                    onBlur();
                  };

                  return (
                    <CustomTextarea
                      id="descripcionCostosTotales"
                      name="descripcionCostosTotales"
                      placeholder="Describe el costo total."
                      value={value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      loading={descripcionCostosTotalesLoading}
                      saved={descripcionCostosTotalesSaved}
                      readOnly={solo_lectura}
                      maxLength={300}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};

export default ResumenCostos;
