import React, { useContext, useState, useEffect } from "react";
import { FormularioContext } from "../../context/FormSectorial";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";

export const GastosPromedioAnual = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  dataGastos
}) => {
  const [datosGastos, setDatosGastos] = useState(Array.isArray(dataGastos) ? dataGastos : []);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [inputStatus, setInputStatus] = useState({});

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    const valorNumerico = Number(numero);
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    return numero;
  };

  useEffect(() => {
    setDatosGastos(Array.isArray(dataGastos) ? dataGastos : []);
  }, [dataGastos]);

  const { control, trigger, clearErrors } = useForm({
    mode: 'onBlur',
  });

  // Manejadora de CustomInput y CustomTextArea
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

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName) => {
    const resumenSubtitulo = datosGastos.find(e => e.id === arrayNameId);

    setInputStatus(prevStatus => ({
      ...prevStatus,
      [arrayNameId]: {
        ...prevStatus[arrayNameId],
        [fieldName]: { loading: true, saved: false },
      },
    }));

    let payload = {
      'p_5_2_variacion_promedio': [{ id: arrayNameId, [fieldName]: resumenSubtitulo[fieldName] }]
    };

    try {
      await handleUpdatePaso(id, stepNumber, payload);

      setInputStatus(prevStatus => ({
        ...prevStatus,
        [arrayNameId]: {
          ...prevStatus[arrayNameId],
          [fieldName]: { loading: false, saved: true },
        },
      }));

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      setInputStatus(prevStatus => ({
        ...prevStatus,
        [arrayNameId]: {
          ...prevStatus[arrayNameId],
          [fieldName]: { loading: false, saved: false },
        },
      }));
    }
  };

  const añosVariacion = paso5?.años_variacion || {};

  return (
    <div className="mt-4">
      <span className="my-4 text-sans-m-semibold">Variación promedio del gasto anual respecto del año n-1</span>
      <div className="container me-5 p-0 mt-2 text-sans-h6-primary">
        <h6>
          Las variaciones se calcularan automáticamente a partir de la tabla anterior.
          Debes describir los motivos de las variaciones anuales sustantivas.
        </h6>
      </div>
      <div className="my-4">
        <table className="table table-borderless table-striped">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold px-2 pb-5">Subtitulo</th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {añosVariacion.n_5 || 0}</u>
                <p className="text-sans-h6-grey">(año n-5) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {añosVariacion.n_4 || 0}</u>
                <p className="text-sans-h6-grey">(año n-4) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {añosVariacion.n_3 || 0}</u>
                <p className="text-sans-h6-grey">(año n-3) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {añosVariacion.n_2 || 0}</u>
                <p className="text-sans-h6-grey">(año n-2) - (año n-1)</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {datosGastos.map((item, rowIndex) => (
              <React.Fragment key={item.id}>
                <tr>
                  <th scope="row" className="text-sans-p-bold pt-2"><u>{item.nombre_subtitulo}</u></th>
                  <td className="text-sans-p text-center">{formatearNumero(item.variacion_gasto_n_5)}</td>
                  <td className="text-sans-p text-center">{formatearNumero(item.variacion_gasto_n_4)}</td>
                  <td className="text-sans-p text-center">{formatearNumero(item.variacion_gasto_n_3)}</td>
                  <td className="text-sans-p text-center">{formatearNumero(item.variacion_gasto_n_2)}</td>
                </tr>
                <tr>
                  <td colSpan="7" className="px-0">
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
                            handleInputChange(item.id, 'descripcion', e.target.value);
                          };
                          const handleBlur = async () => {
                            const isFieldValid = await trigger(`descripcion_${item.id}`);
                            if (isFieldValid) {
                              handleSave(item.id, 'descripcion', field.value);
                            }
                            onBlur();
                          };
                          return (
                            <CustomTextarea
                              id={`descripcion_${item.id}`}
                              value={value}
                              label="Descripción"
                              placeholder="Describe la evolución del gasto por subtitulo"
                              maxLength={500}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${rowIndex % 2 === 0 ? "bg-color-even" : "bg-color-odd"}`}
                              readOnly={solo_lectura}
                              loading={inputStatus[item.id]?.descripcion?.loading}
                              saved={inputStatus[item.id]?.descripcion?.saved}
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
      </div>
    </div>
  );
};
