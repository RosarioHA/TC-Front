import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validacionInfraestructura } from '../../../validaciones/esquemasFichas';
import CustomTextarea from '../../forms/custom_textarea';
import { FormGOREContext } from '../../../context/FormGore';
import InputCosto from '../../forms/input_costo';

export const FisicoInfraestructura = ({ dataRecursosFisicos }) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validacionInfraestructura),
    mode: 'onBlur',
  });
  const { updatePasoGore } = useContext(FormGOREContext);
  const [inputStatus, setInputStatus] = useState({
    cantidad: { loading: false, saved: false },
    costo_total: { loading: false, saved: false },
    fundamentacion: { loading: false, saved: false },
  });

  const handleUpdate = async (fichaId, field, rawValue) => {
    const cleanValue = rawValue.replace(/\./g, '');
    setInputStatus((prev) => ({
      ...prev,
      [fichaId]: {
        ...prev[fichaId],
        [field]: { value: cleanValue, loading: true, saved: false },
      },
    }));

    try {
      const payload = {
        p_3_2_b_recursos_fisicos_infraestructura: [
          {
            id: fichaId,
            [field]: cleanValue,
          },
        ],
      };
      await updatePasoGore(payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: {
            ...prevStatus[fichaId][field],
            loading: false,
            saved: true,
          },
        },
      }));
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [fichaId]: {
          ...prevStatus[fichaId],
          [field]: { loading: false, saved: false },
        },
      }));
    }
  };

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <div>
        <div className="pe-5 me-5 mt-5 col-12">
          <span className="my-4 text-sans-h4">
            b. Recursos físicos e infraestructura
          </span>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              Tomando como base la informacion aportada por el Ministerio o
              Servicio de origen, agregue todas aquellas fichas técnicas de
              programas o softwares requeridos y que el Gobierno Regional no
              posee:
            </h6>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(dataRecursosFisicos) &&
            dataRecursosFisicos.map((ficha, index) => (
              <React.Fragment key={index}>
                <div className="col-10 my-5 border ">
                  <div className="row">
                    <div className="col-3 border-end d-flex justify-content-between flex-column">
                      <div className="my-5 mx-3 pb-5">
                        <div className="border border-1 py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc px-2 my-4 text-center">
                            {ficha.subtitulo_label_value.label}
                          </div>
                        </div>
                      </div>
                      <div className="my-5 mx-3 pt-5">
                        <div className="border border-1 py-1 px-1 ms-3">
                          <div className="text-sans-p-grayc  px-2 m-2">
                            {ficha.item_subtitulo_label_value.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-9 mt-5">
                      <div className="mb-2 d-flex">
                        <div className="mx-3 my-3">{index + 1}</div>
                        <div className="my-3 ms-3 col-9 ">
                          <Controller
                            name={`fichas[${index}].cantidad`}
                            control={control}
                            defaultValue={ficha.cantidad || ''}
                            render={({ field, fieldState: { error } }) => (
                              <CustomTextarea
                                {...field}
                                label="Cantidad"
                                placeholder="Cantidad del recurso seleccionado"
                                descripcion="Campo numérico en miles de pesos."
                                error={error?.message}
                                loading={
                                  inputStatus[ficha.id]?.cantidad?.loading &&
                                  !error
                                }
                                saved={
                                  inputStatus[ficha.id]?.cantidad?.saved &&
                                  !error
                                }
                                onBlur={(e) => {
                                  field.onBlur();
                                  if (
                                    ficha.cantidad !== e.target.value &&
                                    !error
                                  ) {
                                    handleUpdate(
                                      ficha.id,
                                      `cantidad`,
                                      e.target.value
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row col">
                        <div className="my-3 col-6 ms-5 ps-2">
                        <div className="text-start my-1">Costo (M$)</div>
                          <Controller
                            name={`fichas[${index}].costo_total`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <InputCosto
                                {...field}
                                value={ficha.costo_total || ''}
                                label="Costo total (M$)"
                                placeholder="Costo del recurso"
                                descripcion="Campo numérico en miles de pesos."
                                error={error?.message}
                                loading={
                                  inputStatus[ficha.id]?.costo_total?.loading &&
                                  !error
                                }
                                saved={
                                  inputStatus[ficha.id]?.costo_total?.saved &&
                                  !error
                                }
                                onBlur={(e) => {
                                  field.onBlur();
                                  if (
                                    ficha.costo_total !== e.target.value &&
                                    !error
                                  ) {
                                    handleUpdate(
                                      ficha.id,
                                      'costo_total',
                                      e.target.value
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="col-3  py-1 px-1 ms-3">
                          <div className="text-center">Costo Unitario (M$)</div>
                          <div className="text-sans-p-bold-blue px-2 my-2 text-center">
                            {ficha.costo_unitario
                              ? new Intl.NumberFormat('es-CL').format(
                                  ficha.costo_unitario
                                )
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 mb-3 col-9 ms-5 ps-2">
                        <Controller
                          name={`fichas[${index}].fundamentacion`}
                          control={control}
                          defaultValue={ficha.fundamentacion || ''}
                          render={({ field, fieldState: { error } }) => (
                            <CustomTextarea
                              {...field}
                              label="Fundamentación"
                              placeholder="Fundamentos del uso y cantidad de este recurso."
                              maxLength={300}
                              error={error?.message}
                              loading={
                                inputStatus[ficha.id]?.fundamentacion
                                  ?.loading && !error
                              }
                              saved={
                                inputStatus[ficha.id]?.fundamentacion?.saved &&
                                !error
                              }
                              onBlur={(e) => {
                                field.onBlur();
                                if (
                                  ficha.fundamentacion !== e.target.value &&
                                  !error
                                ) {
                                  handleUpdate(
                                    ficha.id,
                                    'fundamentacion',
                                    e.target.value
                                  );
                                }
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
