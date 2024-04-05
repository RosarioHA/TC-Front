import React, { useContext, useState } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import InputCosto from '../../forms/input_costo';
import { OpcionesAB } from '../../forms/opciones_AB';
import { FormGOREContext } from '../../../context/FormGore';
import { Monto } from './Monto';

export const CostosDirectosSector = ({ costoDirectosGet, solo_lectura }) => {
  const { updatePasoGore } = useContext(FormGOREContext);
  const [ inputStatus, setInputStatus ] = useState({
    descripcion: { loading: false, saved: false },
    total_anual_gore: { loading: false, saved: false },
    es_transitorio: { loading: false, saved: false },
  });

  const handleUpdate = async (costoId, field, value, saveImmediately = false) => {
    let finalValue = value;
    if (field === 'total_anual_gore') {
      finalValue = value.replace(/\./g, '');
    }
    setInputStatus((prev) => ({
      ...prev,
      [ costoId ]: {
        ...prev[ costoId ],
        [ field ]: { value, loading: false, saved: false },
      },
    }));

    if (saveImmediately) {
      try {
        const payload = {
          p_2_1_a_costos_directos: [ {
            id: costoId,
            [ field ]: finalValue, // Usa el valor limpio si es necesario.
          } ],
        };
        await updatePasoGore(payload);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ costoId ]: {
            ...prevStatus[ costoId ],
            [ field ]: { ...prevStatus[ costoId ][ field ], loading: false, saved: true },
          },
        }));
      } catch (error) {
        console.error('Error updating data', error);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ costoId ]: {
            ...prevStatus[ costoId ],
            [ field ]: { loading: false, saved: false },
          },
        }));
      }
    }
  };

  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
          {Array.isArray(costoDirectosGet) && costoDirectosGet.map((costodirecto, index) => (
            <React.Fragment key={index}>
              <div className="subrayado col-12" key={index}>
                <span className="py-2 my-2 align-self-center">
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
                        placeholder="Costo (M$)"
                        value={costo.total_anual_gore || ''}
                        onBlur={(e) => handleUpdate(costo.id, 'total_anual_gore', e.target.value, true)}
                        loading={inputStatus[ costo.id ]?.total_anual_gore?.loading}
                        saved={inputStatus[ costo.id ]?.total_anual_gore?.saved}
                        disabled={solo_lectura}
                      />
                    </div>
                    <div className="col-6 ms-5 ps-3">
                      <p className="text-sans-p-bold">¿Es transitorio?</p>
                      <OpcionesAB
                        id={`es_transitorio-${costo.id}`}
                        initialState={costo.es_transitorio}
                        handleEstadoChange={(value) =>
                          handleUpdate(costo.id, 'es_transitorio', value, true)
                        }
                        loading={inputStatus[ costo.id ]?.es_transitorio?.loading}
                        saved={inputStatus[ costo.id ]?.es_transitorio?.saved}
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
                      label="Descripción"
                      placeholder="Describe el costo por subtítulo e ítem"
                      name="descripcion"
                      maxLength={500}
                      value={costo.descripcion || ''}
                      onBlur={(e) => handleUpdate(costo.id, 'descripcion', e.target.value, true)}
                      loading={inputStatus[ costo.id ]?.descripcion?.loading}
                      saved={inputStatus[ costo.id ]?.descripcion?.saved}
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