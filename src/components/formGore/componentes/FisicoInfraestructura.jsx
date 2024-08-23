import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionInfraestructura } from '../../../validaciones/esquemasFichas';
import CustomTextarea from '../../forms/custom_textarea';
import { FormGOREContext } from '../../../context/FormGore';
import InputCosto from '../../forms/input_costo';

export const FisicoInfraestructura = ({ dataRecursosFisicos, sufijo_costos, solo_lectura }) => {
  const { control, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(validacionInfraestructura),
    mode: 'onBlur',
  });

  const { updatePasoGore } = useContext(FormGOREContext);
  const [inputStatus, setInputStatus] = useState(() =>
    dataRecursosFisicos.reduce((acc, ficha) => {
      acc[ficha.id] = {
        cantidad: { loading: false, saved: false },
        costo_total: { loading: false, saved: false },
        fundamentacion: { loading: false, saved: false },
      };
      return acc;
    }, {})
  );

  const handleUpdate = async (fichaId, field, value) => {
    setInputStatus(prev => ({
      ...prev,
      [fichaId]: {
        ...prev[fichaId],
        [field]: { loading: true, saved: false },
      },
    }));

    try {
      const payload = {
        p_3_2_b_recursos_fisicos_infraestructura: [
          {
            id: fichaId,
            [field]: value,
          },
        ],
      };
      await updatePasoGore(payload);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: { loading: false, saved: true },
        },
      }));
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: { loading: false, saved: false },
        },
      }));
    }
  };

  const onSubmit = () => {
    // Aquí podrías manejar la lógica de envío final si es necesario
  };

  return (
    <>
      <div>
        <div className="pe-5 me-5 mt-5 col-12">
          <span className="my-4 text-sans-h4">
            b. Recursos físicos e infraestructura {`${sufijo_costos} `}
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(dataRecursosFisicos) &&
            dataRecursosFisicos.map((ficha, index) => (
              <React.Fragment key={index}>
                <div className="col-12 my-5 border">
                  <div className="row">
                    <div className="col-4 border-end d-flex justify-content-between flex-column">
                      <div className="my-5 mx-3 pb-5">
                        <div className="border border-1 py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc px-2 my-4 text-center">
                            {ficha.subtitulo_label_value.label}
                          </div>
                        </div>
                      </div>
                      <div className="my-5 mx-3 pt-5">
                        <div className="border border-1 py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc px-2 m-2">
                            {ficha.item_subtitulo_label_value.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-8 mt-5">
                      <div className="mb-2 d-flex">
                        <div className="mx-3 my-3">{index + 1}</div>
                        <div className="my-3 ms-3 col-5">
                          <div className="text-start my-1">Cantidad</div>
                          <Controller
                            name={`fichas[${index}].cantidad`}
                            control={control}
                            defaultValue={ficha?.cantidad || ''}
                            render={({ field }) => (
                              <InputCosto
                                {...field}
                                id={`cantidad_${ficha.id}`}
                                placeholder="Cantidad del recurso seleccionado"
                                loading={inputStatus[ficha.id]?.cantidad?.loading}
                                saved={inputStatus[ficha.id]?.cantidad?.saved}
                                error={errors?.fichas?.[index]?.cantidad?.message}
                                disabled={solo_lectura}
                                onBlur={async (e) => {
                                  const isValid = await trigger(`fichas[${index}].cantidad`);
                                  if (isValid && ficha.cantidad !== field.value) {
                                    handleUpdate(ficha.id, 'cantidad', field.value.replace(/\./g, ''));
                                  }
                                  field.onBlur(e);
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row col">
                        <div className="my-3 col-5 ms-5 ps-2">
                          <div className="text-start my-1">Costo total (M$)</div>
                          <Controller
                            name={`fichas[${index}].costo_total`}
                            control={control}
                            defaultValue={ficha?.costo_total || ''}
                            render={({ field }) => (
                              <InputCosto
                                {...field}
                                id={`costo_total_${ficha.id}`}
                                placeholder="Costo (M$)"
                                loading={inputStatus[ficha.id]?.costo_total?.loading}
                                saved={inputStatus[ficha.id]?.costo_total?.saved}
                                error={errors?.fichas?.[index]?.costo_total?.message}
                                disabled={solo_lectura}
                                onBlur={async (e) => {
                                  const isValid = await trigger(`fichas[${index}].costo_total`);
                                  if (isValid && ficha.costo_total !== field.value) {
                                    handleUpdate(ficha.id, 'costo_total', field.value.replace(/\./g, ''));
                                  }
                                  field.onBlur(e);
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="co-2 py-1 px-1 ms-3 my-3">
                          <div className="text-center">Costo Unitario (M$)</div>
                          <div className="text-sans-p-bold-blue px-2 my-2 text-center">
                            {ficha.costo_unitario
                              ? new Intl.NumberFormat('es-CL').format(ficha.costo_unitario)
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 mb-3 col-10 ms-5 ps-2">
                        <Controller
                          name={`fichas[${index}].fundamentacion`}
                          control={control}
                          defaultValue={ficha.fundamentacion || ''}
                          render={({ field }) => (
                            <CustomTextarea
                              {...field}
                              label="Fundamentación (Obligatorio)"
                              placeholder="Fundamentos del uso y cantidad de este recurso."
                              maxLength={300}
                              error={errors?.fichas?.[index]?.fundamentacion?.message}
                              loading={inputStatus[ficha.id]?.fundamentacion?.loading}
                              saved={inputStatus[ficha.id]?.fundamentacion?.saved}
                              readOnly={solo_lectura}
                              onBlur={async (e) => {
                                const isValid = await trigger(`fichas[${index}].fundamentacion`);
                                if (isValid && ficha.fundamentacion !== e.target.value) {
                                  handleUpdate(ficha.id, 'fundamentacion', e.target.value);
                                }
                                field.onBlur(e);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
              </React.Fragment>
            ))}
        </form>
      </div>
    </>
  );
};
