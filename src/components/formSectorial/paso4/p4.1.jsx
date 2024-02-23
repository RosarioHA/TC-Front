import { useContext, useState, useEffect, useCallback } from "react";
import DropdownSelect from "../../dropdown/select";
import CustomTextarea from "../../forms/custom_textarea";
// import useRecargaDirecta from "../../../hooks/formulario/useRecargaDirecta";
import { useUpdateFormRefresh } from "../../../hooks/formulario/useUpdateFormRefresh";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_CuatroUno = ({ data, listaIndicadores, id, stepNumber, solo_lectura }) =>
{
  const { patchStep } = useUpdateFormRefresh((datosActualizados) =>
  {
    setIndicadores(datosActualizados.indicador_desempeno || []);
    // setDatosGuardados(true);
  });
  const [ formData, setFormData ] = useState({
    data: data.indicador_desempeno || {
      forma_juridica_organismo: data.forma_juridica_organismo,
      mision_institucional: data.mision_institucional,
      descripcion_archivo_marco_juridico: data.descripcion_archivo_marco_juridico,
      informacion_adicional_marco_juridico: data.informacion_adicional_marco_juridico,
      indicador: data.indicador
    }
  });
  // const { dataDirecta } = useRecargaDirecta(id, stepNumber);
  const [ indicadores, setIndicadores ] = useState(data.indicador_desempeno || [ { id: generarIdTemp() } ]);
  // const [ datosGuardados, setDatosGuardados ] = useState(false);
  const [ inputStatus, setInputStatus ] = useState({
    formula_calculo: { loading: false, saved: false },
    descripcion_indicador: { loading: false, saved: false },
    medios_calculo: { loading: false, saved: false },
    verificador_asociado: { loading: false, saved: false },
  });
  const [message, setMessage] = useState({ text: '', type: '' }); 


  const { handleUpdatePaso } = useContext(FormularioContext);


  function generarIdTemp()
  {
    return `temp-${Date.now()}-${Math.random()}`;
  }

  // useEffect(() =>
  // {
  //   if (dataDirecta?.indicador_desempeno)
  //   {
  //     setIndicadores([ ...dataDirecta.indicador_desempeno, { id: null } ]);
  //   }
  // }, [ dataDirecta ]);

  const handleInputChange = useCallback((idIndicador, campo, evento) =>
  {
    const valor = evento.target.value;
    setIndicadores(indicadoresActuales =>
      indicadoresActuales.map(indicador =>
        indicador.id === idIndicador ? { ...indicador, [ campo ]: valor } : indicador
      )
    );
  }, []);

  useEffect(() =>
  {
    const savedData = localStorage.getItem('formData');
    if (savedData)
    {
      setFormData(JSON.parse(savedData));
    }
  }, []);


  useEffect(() =>
  {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [ formData ]);

  const handleChangeInput = (idIndicador, campo, evento) =>
  {
    const valor = evento.target.value;
    setIndicadores(indicadoresActuales =>
      indicadoresActuales.map(indicador =>
        indicador.id === idIndicador ? { ...indicador, [ campo ]: valor } : indicador
      )
    );
  };

  const agregarIndicador = () =>
  {
    const ultimoIndicador = indicadores[ indicadores.length - 1 ];
    if (!ultimoIndicador.id || !todosLosCamposCompletos(ultimoIndicador))
    {
      alert("Por favor, completa todos los campos del último indicador antes de agregar uno nuevo.");
      return;
    }
    setIndicadores([ ...indicadores, { id: null } ]);
    // setDatosGuardados(false);
  };


  const todosLosCamposCompletos = (indicador) =>
  {
    return indicador.indicador && indicador.formula_calculo && indicador.descripcion_indicador && indicador.medios_calculo && indicador.verificador_asociado;
  };


  const eliminarIndicador = async (idIndicador) =>
  {
    // Construir el payload con la estructura deseada
    const payload = {
      indicador_desempeno: [ {
        id: idIndicador,
        DELETE: true
      } ]
    };

    try
    {
      await patchStep(id, stepNumber, payload);

      setIndicadores(indicadoresActuales =>
        indicadoresActuales.filter(indicador => indicador.id !== idIndicador));
    } catch (error)
    {
      console.error("Error al eliminar el indicador:", error);
    }
  };

  // Transformar listaIndicadores a un array de opciones para el DropdownSelect
  const opcionesIndicadores = Object.entries(listaIndicadores).map(([ key, label ]) => ({
    value: key,  // Clave del indicador
    label: label // Etiqueta del indicador
  }));

  const handleDropdownChange = (idIndicador, valorSeleccionado) =>
  {
    setIndicadores(indicadoresActuales =>
      indicadoresActuales.map(indicador =>
        indicador.id === idIndicador
          ? { ...indicador, indicador: valorSeleccionado.value, indicador_display: valorSeleccionado.label }
          : indicador
      )
    );
    if (idIndicador)
    {
      guardarCambioIndicador(idIndicador, valorSeleccionado.value);
    }
  };


  const guardarCambioIndicador = async (idIndicador, nuevoValor) =>
  {
    const indicadorActualizado = indicadores.find(indicador => indicador.id === idIndicador);

    if (!indicadorActualizado) return;

    const payload = {
      ...indicadorActualizado,
      indicador: nuevoValor
    };

    try
    {
      await patchStep(id, stepNumber, { indicador_desempeno: [ payload ] });
    } catch (error)
    {
      console.error("Error al guardar el cambio de indicador:", error);
    }
  };


  const handleSave = async () =>
  {
    try
    {
      const todosCompletos = indicadores.every((indicador) =>
      {
        return (
          indicador.indicador &&
          indicador.formula_calculo &&
          indicador.descripcion_indicador &&
          indicador.medios_calculo &&
          indicador.verificador_asociado
        );
      });
      
      if (!todosCompletos) {
        setMessage({ text: "Por favor, completa todos los campos antes de guardar.", type: 'error' });
        return;
      }
      const datosPaso = {
        indicador_desempeno: indicadores,
      };
      const exito = await patchStep(id, stepNumber, datosPaso);
      if (exito) {
        setMessage({ text: "Datos guardados exitosamente", type: 'success' });
        // setDatosGuardados(true);
      } else {
        setMessage({ text: "Error al guardar los datos", type: 'error' });
      }
    } catch (error) {
      console.error("Error en handleSave:", error);
      setMessage({ text: "Error al guardar. Inténtalo de nuevo.", type: 'error' });
    }
  };

  const inputSave = async (idIndicador, campo) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ idIndicador ]: {
        ...prevStatus[ idIndicador ] || {}, // Asegura que el objeto exista
        [ campo ]: { loading: true, saved: false }
      }
    }));

    // Aquí debes asegurarte de enviar solo los datos relevantes del indicador específico
    const indicadorASalvar = indicadores.find(indicador => indicador.id === idIndicador);
    const success = await handleUpdatePaso(id, stepNumber, { indicador_desempeno: [ indicadorASalvar ] });
    if (success)
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ idIndicador ]: {
          ...prevStatus[ idIndicador ],
          [ campo ]: { loading: false, saved: true }
        }
      }));
    } else
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ idIndicador ]: { ...prevStatus[ idIndicador ], [ campo ]: { loading: false, saved: false } }
      }));
    }
  };

  const todosIndicadoresGuardados = indicadores.every(indicador => typeof indicador.id === 'number');



  return (
    <>
      <div className="container">
        <div className="d-flex mb-2">
          <div className="ms-4">#</div>
          <div className="col-3 ms-3">
            <p className="text-sans-p-bold mb-0">Tipo de indicador </p>
            <p className="text-sans-p-grayc">(Obligatorio)</p>
          </div>
          <div className="ms-4">
            <p className="text-sans-p-bold mb-0">Fórmula de cálculo </p>
            <p className="text-sans-p-grayc">(Obligatorio)</p>
          </div>
        </div>

        {indicadores.map((indicador, index) => (
          <div key={indicador.id ? `indicador-${indicador.id}` : `nuevo-${index}`}>
            <div className="d-flex neutral-line p-2 col-11">
              <p className="text-sans-p-bold mx-3 mt-4">{index + 1}</p>
              <div className="col-3 mt-2">
                <DropdownSelect
                  placeholder="Tipo de indicador"
                  options={opcionesIndicadores}
                  selected={indicador.indicador}
                  onSelectionChange={(valorSeleccionado) => handleDropdownChange(indicador.id, valorSeleccionado)}
                  readOnly={solo_lectura}
                />
              </div>
              <div className="col me-1 ms-3 my-2">
                <CustomTextarea
                  placeholder="Formula de cálculo"
                  maxLength={300}
                  value={indicador.formula_calculo || ""}
                  onChange={(evento) => handleChangeInput(indicador.id, 'formula_calculo', evento)}
                  onBlur={() => indicador.id ? inputSave(indicador.id, 'formula_calculo') : null}
                  loading={inputStatus[ indicador.id ]?.formula_calculo?.loading || false}
                  saved={inputStatus[ indicador.id ]?.formula_calculo?.saved || false}
                  readOnly={solo_lectura}
                />
              </div>

              {index >= 0 && indicadores.length > 1 && !solo_lectura && (
                <div className="col-1 me-4">
                  <button
                    className="btn-terciario-ghost mt-3"
                    onClick={() => eliminarIndicador(indicador.id)}
                  >
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">Borrar</p>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 mx-3 my-4">
              <CustomTextarea
                label="Descripción (Obligatorio)"
                placeholder="Describe el indicador de desempeño"
                maxLength={300}
                value={indicador.descripcion_indicador}
                onChange={(evento) => handleChangeInput(indicador.id, 'descripcion_indicador', evento)}
                onBlur={() => indicador.id ? inputSave(indicador.id, 'descripcion_indicador') : null}
                loading={inputStatus[ indicador.id ]?.descripcion_indicador?.loading || false}
                saved={inputStatus[ indicador.id ]?.descripcion_indicador?.saved || false}
                readOnly={solo_lectura}
              />
            </div>
            <div className="mt-2 mx-3 my-4">
              <CustomTextarea
                label="Medios utilizados para su cálculo (Obligatorio)"
                placeholder="Describe los medios utilizados para su cálculo"
                maxLength={300}
                value={indicador.medios_calculo || ""}
                onChange={(evento) => handleChangeInput(indicador.id, 'medios_calculo', evento)}
                onBlur={() => indicador.id ? inputSave(indicador.id, 'medios_calculo') : null}
                loading={inputStatus[ indicador.id ]?.medios_calculo?.loading || false}
                saved={inputStatus[ indicador.id ]?.medios_calculo?.saved || false}
                readOnly={solo_lectura}
              />
            </div>
            <div className="mt-2 mx-3 my-4">
              <CustomTextarea
                label="Verificador asociado al indicador (Obligatorio)"
                placeholder="Describe los medios de verificación del indicador"
                maxLength={300}
                value={indicador.verificador_asociado || ""}
                onChange={(evento) => handleInputChange(indicador.id, 'verificador_asociado', evento)}
                onBlur={() => indicador.id ? inputSave(indicador.id, 'verificador_asociado') : null}
                loading={inputStatus[ indicador.id ]?.verificador_asociado?.loading || false}
                saved={inputStatus[ indicador.id ]?.verificador_asociado?.saved || false}
                readOnly={solo_lectura}
              />
            </div>

          </div>
        ))}
        {!solo_lectura && (
        <div className="d-flex">
          {todosIndicadoresGuardados ? (
            <button
              className="btn-secundario-s m-2"
              onClick={agregarIndicador}
            >
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar indicador</p>
            </button>
          ) : (
            <div>
            {message.text && (
              <div className={`text-sans-h6-darkred mt-1 mb-0  mx-2 ${message.type}`}>
                {message.text}
              </div>
            )}
            <button
              className="btn-primario-s m-2"
              onClick={handleSave}
            >
              <i className="material-symbols-rounded me-2">save</i>
              Guardar Indicador
            </button>
            </div>
          )}
        </div>
        )}
      </div>
    </>
  )
};