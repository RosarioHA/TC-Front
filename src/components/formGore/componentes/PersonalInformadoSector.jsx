import React, { useContext, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomInput from '../../forms/custom_input';
import { OpcionesAB } from '../../forms/opciones_AB';
import { FormGOREContext } from '../../../context/FormGore';

const schema = yup
  .object({
    utilizar_recurso: yup.boolean().required('Debe indicar una opción'),
    numero_personas_gore: yup
      .number()
      .typeError('Debe ser un número')
      .integer('Debe ser un número entero')
      .positive('Debe ser un número positivo')
      .min(1, 'Debe ser igual o mayor a 1'),
  })
  .required();

export const PersonalInformadoSector = ({
  personalSector,
  title,
  seccion,
  solo_lectura
}) => {
  const { updatePasoGore } = useContext(FormGOREContext);
  const [inputStatus, setInputStatus] = useState({});
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const formatNumber = (number) => {
    // Verificar si el número es 0 para manejar el caso "No informado"
    if (number === 0) return "No informado";
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(number);
  };

  const datosAgrupadosPorCalidadJuridica = useMemo(() => {
    if (!Array.isArray(personalSector)) {
      return {};
    }
    return personalSector.reduce((acc, persona) => {
      if (!acc[persona.calidad_juridica]) {
        acc[persona.calidad_juridica] = [];
      }
      acc[persona.calidad_juridica].push(persona);
      return acc;
    }, {});
  }, [personalSector]);

  const handleUpdate = async (personaId, field, value) => {
    setInputStatus((prev) => ({
      ...prev,
      [personaId]: {
        ...prev[personaId],
        [field]: { loading: true, saved: false },
      },
    }));

    try {
      const payload = {
        [seccion]: [{ id: personaId, [field]: value }],
      };
      await updatePasoGore(payload);
      setInputStatus((prev) => ({
        ...prev,
        [personaId]: {
          ...prev[personaId],
          [field]: { loading: false, saved: true },
        },
      }));
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus((prev) => ({
        ...prev,
        [personaId]: {
          ...prev[personaId],
          [field]: { loading: false, saved: false },
        },
      }));
    }
  };

  const onSubmit = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      const [fieldName, personaId] = key.split('-');
      if (fieldName && personaId) {
        handleUpdate(personaId, fieldName, value);
      }
    });
  };
  return (
    <>
      <div className="my-5 col-11">
        <div className="subrayado col-12 h-auto">
          <span className="py-2 my-2 align-self-center">
            <p className="text-sans-p-bold ms-2"> Personal {title} informado por el sector:</p>
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Object.entries(datosAgrupadosPorCalidadJuridica).map(
            ([calidadJuridica, personas]) => (
              <React.Fragment key={calidadJuridica}>
                <div key={calidadJuridica}>
                  <p className="my-4">
                    <strong>Calidad Jurídica </strong>
                    <span className="mx-2">
                      {personas[0].nombre_calidad_juridica}
                    </span>
                  </p>
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estamento</th>
                        <th>Renta bruta mensual</th>
                        <th>
                          Grado <br />
                          (Si corresponde)
                        </th>
                        <th>Sector</th>
                        <th>
                          Comisión <br /> de servicio
                        </th>
                        {title === 'directo' && (
                          <th>
                            ¿GORE <br /> utilizará este recurso?
                          </th>
                        )}
                        {title === 'indirecto' && (
                          <>
                            <th>
                              N° personas <br /> informado
                            </th>
                            <th>
                              ¿Cuántas <br /> personas <br />
                              utilizará GORE?
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map((persona, index) => (
                        <tr key={persona.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{persona.nombre_estamento}</td>
                          <td className="text-center">
                            {formatNumber(persona.renta_bruta) || 'sin información'}
                          </td>
                          <td className="text-center">
                            {persona.grado || '-'}
                          </td>
                          <td>{persona.sector_nombre}</td>
                          <td className="col-2 px-5">
                            <span className="text-sans-p-bold-blue">
                              {persona.comision_servicio ? 'Sí' : 'No'}
                            </span>
                          </td>
                          {title === 'directo' && (
                            <td>
                              <Controller
                                name={`utilizar_recurso-${persona.id}`}
                                control={control}
                                defaultValue={persona.utilizara_recurso}
                                render={({ field, fieldState: { error } }) => (
                                  <OpcionesAB
                                    {...field}
                                    id={`utilizara_recurso-${persona.id}`}
                                    initialState={persona.utilizara_recurso}
                                    handleEstadoChange={(value) => {
                                      field.onChange(value);
                                      handleUpdate(
                                        persona.id,
                                        'utilizara_recurso',
                                        value,
                                        true
                                      );
                                    }}
                                    loading={
                                      inputStatus[persona.id]?.utilizara_recurso
                                        ?.loading
                                    }
                                    saved={
                                      inputStatus[persona.id]?.utilizara_recurso
                                        ?.saved
                                    }
                                    altA="Si"
                                    altB="No"
                                    error={error?.message}
                                    readOnly={solo_lectura}
                                  />
                                )}
                              />
                            </td>
                          )}
                          {title === 'indirecto' && (
                            <>
                              <td className="col-2 pe-3 text-center">
                                {persona.numero_personas_sectorial}
                              </td>
                              <td className="col-2 pe-5">
                                <Controller
                                  name={`numero_personas_gore-${persona.id}`}
                                  control={control}
                                  rules={{ required: true }}
                                  defaultValue={
                                    persona.numero_personas_gore || ''
                                  }
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <CustomInput
                                      {...field}
                                      placeholder="número"
                                      disabled={solo_lectura}
                                      loading={
                                        inputStatus[persona.id]
                                          ?.numero_personas_gore?.loading
                                      }
                                      saved={
                                        inputStatus[persona.id]
                                          ?.numero_personas_gore?.saved
                                      }
                                      error={error ? error.message : null}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        const newValue = e.target.value;
                                        if (
                                          persona.numero_personas_gore !==
                                          newValue &&
                                          !error
                                        ) {
                                          handleUpdate(
                                            persona.id,
                                            'numero_personas_gore',
                                            newValue
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </React.Fragment>
            )
          )}
        </form>
      </div>
    </>
  );
};
