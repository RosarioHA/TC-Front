import { useContext, useState, useEffect } from 'react';
import { DropdownSelectSimple } from '../../dropdown/selectSimple';
import CustomTextarea from '../../forms/custom_textarea';
import { FormularioContext } from '../../../context/FormSectorial';
import { useForm, Controller } from 'react-hook-form';

export const Subpaso_CuatroUno = ({
  data,
  listaIndicadores,
  id,
  stepNumber,
  solo_lectura,
  region,
}) => {
  const { handleUpdatePaso } = useContext(FormularioContext);
  const { control, handleSubmit, clearErrors, setError } = useForm({
    mode: 'onBlur',
  });

  const opcionesIndicadores = Object.entries(listaIndicadores).map(
    ([key, label]) => ({
      value: key,
      label: label,
    })
  );

  const [indicadores, setIndicadores] = useState(data || []);
  const [isComplete, setIsComplete] = useState(false);
  const [inputStatus, setInputStatus] = useState({
    formula_calculo: { loading: false, saved: false },
    descripcion_indicador: { loading: false, saved: false },
    medios_calculo: { loading: false, saved: false },
    verificador_asociado: { loading: false, saved: false },
  });
  const [errorMessage, setErrorMessage] = useState({
    message: '',
    indicatorId: null,
  });

  useEffect(() => {
    if (data) {
      const initialIndicators = data.map((indicador) => ({
        ...indicador,
        isComplete: false,
      }));
      setIndicadores(initialIndicators);
    }
  }, [data]);

  const handleIndicatorChange = (selected, id) => {
    const newIndicadores = [...indicadores];
    const index = newIndicadores.findIndex((indicador) => indicador.id === id);
    if (index !== -1) {
      newIndicadores[index].indicador = selected.value;
      setIndicadores(newIndicadores);
      handleUpdate(newIndicadores, id);
    }
  };

  const handleFieldChange = (field, value, id) => {
    const newIndicadores = [...indicadores];
    const index = newIndicadores.findIndex((indicador) => indicador.id === id);
    if (index !== -1 && newIndicadores[index][field] !== value) {
      newIndicadores[index][field] = value;
      setIndicadores(newIndicadores);

      const newInputStatus = { ...inputStatus };
      if (!newInputStatus[id]) {
        newInputStatus[id] = {};
      }
      newInputStatus[id][field] = { loading: false, saved: false };
      setInputStatus(newInputStatus);

      // Clear error on field change
      clearErrors(`indicadores[${index}].${field}`);

      // Check if the field is empty and set the error if it is
      if (!value) {
        setError(`indicadores[${index}].${field}`, {
          type: 'manual',
          message: 'Este campo es requerido',
        });
      }
    }
  };

  const handleUpdate = async (updatedIndicadores) => {
    try {
      const updatedData = {
        regiones: [
          {
            region: region,
            indicador_desempeno: updatedIndicadores?.map((indicador) => ({
              id: indicador.id,
              indicador: indicador.indicador,
              formula_calculo: indicador.formula_calculo,
              descripcion_indicador: indicador.descripcion_indicador,
              medios_calculo: indicador.medios_calculo,
              verificador_asociado: indicador.verificador_asociado,
            })),
          },
        ],
      };
      const response = await handleUpdatePaso(id, stepNumber, updatedData);

      const completeStatus = updatedIndicadores?.every(
        (indicador) =>
          indicador?.indicador &&
          indicador?.formula_calculo &&
          indicador?.descripcion_indicador &&
          indicador?.medios_calculo &&
          indicador?.verificador_asociado
      );

      setIsComplete(completeStatus);

      return response;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    } finally {
      const updatedInputStatus = { ...inputStatus };
      updatedIndicadores?.forEach((indicador) => {
        Object.keys(updatedInputStatus[indicador.id] ?? {}).forEach((field) => {
          updatedInputStatus[indicador.id][field] = {
            loading: false,
            saved: true,
          };
        });
      });
      setInputStatus(updatedInputStatus);
    }
  };

  const handleAddIndicador = async () => {
    const lastIndicator = indicadores[indicadores.length - 1];

    const isLastIndicatorComplete = lastIndicator &&
      lastIndicator.indicador &&
      lastIndicator.formula_calculo &&
      lastIndicator.descripcion_indicador &&
      lastIndicator.medios_calculo &&
      lastIndicator.verificador_asociado;

    if (isLastIndicatorComplete) {
      setErrorMessage('');
      
      const newIndicator = {
        id: null,
        indicador: '',
        formula_calculo: '',
        descripcion_indicador: '',
        medios_calculo: '',
        verificador_asociado: '',
        isComplete: false,
      };

      const newIndicadores = [...indicadores, newIndicator];
      setIndicadores(newIndicadores);
      setErrorMessage({ message: '', indicatorId: null });

      try {
        await handleCreateIndicator(newIndicator);
      } catch (error) {
        console.error('Error creating indicator:', error);
      }

      const updatedCompleteStatus = newIndicadores?.every(
        (indicador) =>
          indicador.indicador &&
          indicador.formula_calculo &&
          indicador.descripcion_indicador &&
          indicador.medios_calculo &&
          indicador.verificador_asociado
      );
      setIsComplete(updatedCompleteStatus);
    } else {
      setErrorMessage({
        message:
          'Por favor complete los campos obligatorios del indicador antes de agregar uno nuevo.',
        indicatorId: lastIndicator.id,
      });
    }
  };

  const handleCreateIndicator = async (newIndicator) => {
    try {
      const dataToSend = {
        regiones: [
          {
            region: region,
            indicador_desempeno: [
              {
                indicador: newIndicator.indicador,
                formula_calculo: newIndicator.formula_calculo,
                descripcion_indicador: newIndicator.descripcion_indicador,
                medios_calculo: newIndicator.medios_calculo,
                verificador_asociado: newIndicator.verificador_asociado,
              },
            ],
          },
        ],
      };

      const response = await handleUpdatePaso(id, stepNumber, dataToSend);
      return response;
    } catch (error) {
      console.error('Error creating indicator:', error);
      throw error;
    }
  };

  const eliminarIndicador = async (idIndicador) => {
    const payload = {
      regiones: [
        {
          region: region,
          indicador_desempeno: [{ id: idIndicador, DELETE: true }],
        },
      ],
    };

    try {
      await handleUpdatePaso(id, stepNumber, payload);
      setIndicadores((indicadoresActuales) =>
        indicadoresActuales.filter((indicador) => indicador.id !== idIndicador)
      );
    } catch (error) {
      console.error('Error al eliminar el indicador:', error);
    }
  };

  const onSubmit = () => {
    handleUpdate();
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {indicadores.map((indicador, index) => (
          <div key={indicador.id}>
            <div className="d-flex mb-2">
              <div className="ms-4">{index + 1}</div>
              <div className="col-3 ms-3">
                <p className="text-sans-p-bold mb-0">Tipo de indicador </p>
                <p className="text-sans-p-grayc">(Obligatorio)</p>
              </div>
              <div className="ms-4">
                <p className="text-sans-p-bold mb-0">Fórmula de cálculo </p>
                <p className="text-sans-p-grayc">(Obligatorio)</p>
              </div>
            </div>
            <div>
              <div className="d-flex neutral-line p-2 col-11">
                <div className="col-3 mt-2">
                  <Controller
                    control={control}
                    name={`indicadores[${index}].indicador`}
                    defaultValue={indicador.indicador || ''}
                    render={({ field, fieldState: { error } }) => (
                      <DropdownSelectSimple
                        {...field}
                        placeholder="Tipo de indicador"
                        options={opcionesIndicadores}
                        selected={opcionesIndicadores.find(
                          (opt) => opt.value === indicador.indicador
                        )}
                        onSelectionChange={(selected) =>
                          handleIndicatorChange(selected, indicador.id)
                        }
                        readOnly={solo_lectura}
                        error={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col me-1 ms-3 my-2">
                  <Controller
                    control={control}
                    name={`indicadores[${index}].formula_calculo`}
                    defaultValue={indicador.formula_calculo || ''}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextarea
                        {...field}
                        placeholder="Formula de cálculo"
                        maxLength={300}
                        value={indicador.formula_calculo}
                        onChange={(e) =>
                          handleFieldChange(
                            'formula_calculo',
                            e.target.value,
                            indicador.id
                          )
                        }
                        onBlur={() => {
                          handleUpdate(indicadores, indicador.id);
                          const newInputStatus = { ...inputStatus };
                          newInputStatus[indicador.id].formula_calculo = {
                            loading: true,
                            saved: false,
                          };
                          setInputStatus(newInputStatus);
                        }}
                        loading={
                          inputStatus[indicador.id]?.formula_calculo?.loading
                        }
                        saved={
                          inputStatus[indicador.id]?.formula_calculo?.saved
                        }
                        readOnly={solo_lectura}
                        error={error?.message}
                      />
                    )}
                  />
                </div>

                {!solo_lectura && indicadores.length > 1 && (
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
                <Controller
                  control={control}
                  name={`indicadores[${index}].descripcion_indicador`}
                  defaultValue={indicador.descripcion_indicador || ''}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextarea
                      {...field}
                      label="Descripción (Obligatorio)"
                      placeholder="Describe el indicador de desempeño"
                      maxLength={300}
                      value={indicador.descripcion_indicador}
                      onChange={(e) =>
                        handleFieldChange(
                          'descripcion_indicador',
                          e.target.value,
                          indicador.id
                        )
                      }
                      onBlur={() => {
                        handleUpdate(indicadores, indicador.id);
                        const newInputStatus = { ...inputStatus };
                        newInputStatus[indicador.id].descripcion_indicador = {
                          loading: true,
                          saved: false,
                        };
                        setInputStatus(newInputStatus);
                      }}
                      loading={
                        inputStatus[indicador.id]?.descripcion_indicador
                          ?.loading
                      }
                      saved={
                        inputStatus[indicador.id]?.descripcion_indicador?.saved
                      }
                      readOnly={solo_lectura}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="mt-2 mx-3 my-4">
                <Controller
                  control={control}
                  name={`indicadores[${index}].medios_calculo`}
                  defaultValue={indicador.medios_calculo || ''}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextarea
                      {...field}
                      label="Medios utilizados para su cálculo (Obligatorio)"
                      placeholder="Describe los medios utilizados para su cálculo"
                      maxLength={1000}
                      value={indicador.medios_calculo}
                      onChange={(e) =>
                        handleFieldChange(
                          'medios_calculo',
                          e.target.value,
                          indicador.id
                        )
                      }
                      onBlur={() => {
                        handleUpdate(indicadores, indicador.id);
                        const newInputStatus = { ...inputStatus };
                        newInputStatus[indicador.id].medios_calculo = {
                          loading: true,
                          saved: false,
                        };
                        setInputStatus(newInputStatus);
                      }}
                      loading={
                        inputStatus[indicador.id]?.medios_calculo?.loading
                      }
                      saved={inputStatus[indicador.id]?.medios_calculo?.saved}
                      readOnly={solo_lectura}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="mt-2 mx-3 my-4">
                <Controller
                  control={control}
                  name={`indicadores[${index}].verificador_asociado`}
                  defaultValue={indicador.verificador_asociado || ''}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextarea
                      {...field}
                      label="Verificador asociado al indicador (Obligatorio)"
                      placeholder="Describe los medios de verificación del indicador"
                      maxLength={300}
                      value={indicador.verificador_asociado}
                      onChange={(e) =>
                        handleFieldChange(
                          'verificador_asociado',
                          e.target.value,
                          indicador.id
                        )
                      }
                      onBlur={() => {
                        handleUpdate(indicadores, indicador.id);
                        const newInputStatus = { ...inputStatus };
                        newInputStatus[indicador.id].verificador_asociado = {
                          loading: true,
                          saved: false,
                        };
                        setInputStatus(newInputStatus);
                      }}
                      loading={
                        inputStatus[indicador.id]?.verificador_asociado?.loading
                      }
                      saved={
                        inputStatus[indicador.id]?.verificador_asociado?.saved
                      }
                      readOnly={solo_lectura}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>
            {!isComplete &&
              errorMessage.message &&
              errorMessage.indicatorId === indicador.id && (
                <div className="text-sans-h6-darkred mt-1 mb-0 mx-2">
                  {errorMessage.message}
                </div>
              )}
          </div>
        ))}
        {!solo_lectura && (
          <div className="d-flex">
            <button
              className="btn-secundario-s m-2"
              onClick={handleAddIndicador}
            >
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">
                Agregar indicador
              </p>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

