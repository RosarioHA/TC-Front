import React, { useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { OpcionesAB } from '../../forms/opciones_AB';
import { FormGOREContext } from '../../../../context/FormGore';
import { Monto } from './Monto';

export const CostosSector = ({
  costoSectorGet,
  solo_lectura,
  seccion,
}) =>
{
  const { updatePasoGore } = useContext(FormGOREContext);
  const [ inputStatus, setInputStatus ] = useState({});
  const [ inputValues, setInputValues ] = useState({});
  const [ errors, setErrors ] = useState({});

  useEffect(() =>
  {
    const initialInputs = {};
    costoSectorGet.forEach(costo =>
    {
      initialInputs[ `total_anual_gore-${costo.id}` ] = costo.total_anual_gore || '';
      initialInputs[ `es_transitorio-${costo.id}` ] = costo.es_transitorio || false;
      initialInputs[ `descripcion-${costo.id}` ] = costo.descripcion || '';
    });
    setInputValues(initialInputs);
  }, [ costoSectorGet ]);

  const validateField = (name, value) =>
  {
    let error = '';
    switch (name.split('-')[ 0 ])
    {
      case 'total_anual_gore':
        if (!value) error = 'El Total Anual es obligatorio';
        else if (!/^\d+$/.test(value)) error = 'El Total Anual debe ser un número entero';
        else if (parseInt(value, 10) < 0) error = 'El Total Anual debe ser un número positivo';
        break;
      case 'descripcion':
        if (!value) error = 'La descripción es obligatoria';
        else if (value.length < 3) error = 'La descripción debe tener al menos 3 caracteres';
        else if (value.length > 500) error = 'La descripción no debe exceder los 500 caracteres';
        break;
      // Agrega más casos según sea necesario
    }
    return error;
  };

  const handleBlur = async (costoId, field) =>
  {
    const fieldName = `${field}-${costoId}`;
    const value = inputValues[ fieldName ];
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [ fieldName ]: error }));

    if (!error)
    {
      // Llama a handleUpdate con saveImmediately establecido a true para enviar los cambios al backend
      handleUpdate(costoId, field, value, true);
    }
  };

  const updateInputStatus = (fieldName, loading, saved) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ fieldName ]: { loading, saved }
    }));
  };

  const handleUpdate = async (costoId, field, value) =>
  {
    const fieldName = `${field}-${costoId}`;

    updateInputStatus(fieldName, true, false);

    let payload = {
      [ seccion ]: [ {
        id: costoId,
        [ field ]: value,
      } ],
    };

    try
    {
      await updatePasoGore(payload);
      updateInputStatus(fieldName, false, true);
    } catch (error)
    {
      updateInputStatus(fieldName, false, false)
    }
  };

  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
          {Array.isArray(costoSectorGet) && costoSectorGet.map((costodirecto, index) => (
            <React.Fragment key={index}>
              <div className="subrayado col-12 h-auto" key={index}>
                <span className="py-2 my-2 mx-1 align-self-center">
                  {costodirecto.sector}
                </span>
              </div>
              {costodirecto?.items.map((costo) => (
                <div
                  className="col d-flex flex-column justify-content-between my-5 col-11"
                  key={costo.id}
                >
                  <div className="d-flex flex-row">
                    <div className="col-4">
                      <p className="text-sans-p-bold">Subtítulo </p>
                      <div className="border border-1 col-4 py-4 px-3">
                        <span className="text-sans-p-grayc">
                          {costo.subtitulo_label_value.label}
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <p className="text-sans-p-bold">Item</p>
                      <div className="border border-1 col-6 py-3 px-2">
                        <span className="text-sans-p-grayc">
                          {costo.item_subtitulo_label_value.label}
                        </span>
                      </div>
                    </div>
                    <div className="col-5 pe-2">
                      <p className="text-sans-p-bold">
                        Total Anual ($M) <br /> informado por el sector
                      </p>
                      <div className="border-gris col-6 py-2 px-3">
                        ${costo.total_anual_sector ? parseInt(costo.total_anual_sector).toLocaleString('es-CL') : '0'}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row my-3 col-10">
                    <div className="col-4">
                      <p className="text-sans-p-bold mb-3">
                        Total Anual ($M) informado por GORE
                      </p>
                      <InputCosto
                        id={`total_anual_gore-${costo.id}`}
                        value={costo.total_anual_gore}
                        placeholder="Costo (M$)"
                        onChange={valor => setInputValues({ ...inputValues, [ `total_anual_gore-${costo.id}` ]: valor })}
                        onBlur={() => handleBlur(costo.id, 'total_anual_gore', inputValues[ `total_anual_gore-${costo.id}` ])}
                        loading={inputStatus[ `total_anual_gore-${costo.id}` ]?.loading || false}
                        saved={inputStatus[ `total_anual_gore-${costo.id}` ]?.saved || false}

                        disabled={solo_lectura}
                        error={errors[ `total_anual_gore-${costo.id}` ]}
                      />
                    </div>
                    <div className="col-6 ms-5 ps-3">
                      <p className="text-sans-p-bold">¿Es transitorio?</p>
                      <OpcionesAB
                        id={`es_transitorio-${costo.id}`}
                        initialState={costo.es_transitorio}
                        handleEstadoChange={(value) =>
                          handleUpdate(costo.id, 'es_transitorio', value)
                        }
                        loading={inputStatus[ `es_transitorio-${costo.id}` ]?.loading || false}
                        saved={inputStatus[ `es_transitorio-${costo.id}` ]?.saved || false}
                        error={errors[ `es_transitorio-${costo.id}` ]}
                        altA="Si"
                        altB="No"
                        field="es_transitorio"
                        arrayNameId={costo.id}
                        fieldName="es_transitorio"
                        readOnly={solo_lectura}
                      />


                    </div>
                    <div className="col-5 ms-2">
                      <Monto monto={costo.diferencia_monto} />
                    </div>
                  </div>
                  <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-12">
                    <i className="material-symbols-rounded me-2">info</i>
                    <h6 className="mt-0">
                      Si no se hará uso del costo informado por el sector, llena
                      con un 0.
                    </h6>
                  </div>
                  <div className="mx-2">
                    <CustomTextarea
                      id={`descripcion-${costo.id}`}
                      label="Descripción"
                      placeholder="Describe el costo por subtítulo e ítem"
                      name="descripcion"
                      maxLength={500}
                      value={costo.descripcion || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [ `descripcion-${costo.id}` ]: e.target.value })}
                      onBlur={() => handleBlur(costo.id, 'descripcion', inputValues[ `descripcion-${costo.id}` ])}
                      loading={inputStatus[ `descripcion-${costo.id}` ]?.loading || false}
                      saved={inputStatus[ `descripcion-${costo.id}` ]?.saved || false}
                      error={errors[ `descripcion-${costo.id}` ]}
                      readOnly={solo_lectura}
                    />
                  </div>
                  <hr className="col-12" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};