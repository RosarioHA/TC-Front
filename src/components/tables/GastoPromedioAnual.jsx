import React, { useContext, useState, useEffect } from "react";
import { FormularioContext } from "../../context/FormSectorial";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";

export const GastosPromedioAnual = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  dataGastos,
  refetchTrigger
}) => {

  const [datosGastos, setDatosGastos] = useState([]);
  const { handleUpdatePaso } = useContext(FormularioContext);

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    // Asegurarse de que el valor es un número. Convertir si es necesario.
    const valorNumerico = Number(numero);
    // Verificar si el valor es un número válido antes de intentar formatearlo
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    // Devolver un valor predeterminado o el mismo valor si no es un número
    return numero;
  };

  useEffect(() => {
    if (Array.isArray(dataGastos)) {
      const formattedData = dataGastos.map(item => ({
        ...item,
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

  const { control, trigger, clearErrors} = useForm({
    mode: 'onBlur',
  });

  // Función para recargar campos por separado
  const updateFieldState = (instanciaId, fieldName, newState) => {
    setDatosGastos(previnstancia =>
      previnstancia.map(instancia => {
        if (instancia.id === instanciaId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...instancia.estados, [fieldName]: { ...newState } };
          return { ...instancia, estados: updatedEstados };
        }
        return instancia;
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
  const handleSave = async (arrayNameId, fieldName) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const resumenSubtitulo = datosGastos.find(e => e.id === arrayNameId);

    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;
    // Payload para otros campos
    payload = {
      'p_5_2_variacion_promedio': [{ id: arrayNameId, [fieldName]: resumenSubtitulo[fieldName] }]
    };

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(arrayNameId, fieldName, { loading: false, saved: true });
      refetchTrigger();

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      updateFieldState(arrayNameId, fieldName, { loading: false, saved: false });
    }
  };


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
                <u>Variación con {paso5.años_variacion.n_5}</u>
                <p className="text-sans-h6-grey">(año n-5) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {paso5.años_variacion.n_4}</u>
                <p className="text-sans-h6-grey">(año n-4) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {paso5.años_variacion.n_3}</u>
                <p className="text-sans-h6-grey">(año n-3) - (año n-1)</p>
              </th>
              <th scope="col" className="text-sans-p text-center">
                <u>Variación con {paso5.años_variacion.n_2}</u>
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
                              id={`descripcion_${item?.id}`}
                              value={value}
                              label="Descripción"
                              placeholder="Describe la evolución del gasto por subtitulo"
                              maxLength={500}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`form-control ${rowIndex % 2 === 0 ? "bg-color-even" : "bg-color-odd"}`}
                              readOnly={solo_lectura}
                              loading={item.estados?.descripcion?.loading ?? false}
                              saved={item.estados?.descripcion?.saved ?? false}
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
}