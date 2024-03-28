import React, { useContext, useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


export const Temporalidad = ({ temporalidad }) => {

  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [inputStatus, setInputStatus] = useState({
    justificacion: { loading: false, saved: false },
  });



  const handleUpdate = async (justificacionId, field, value, saveImmediately = false) => {
    setInputStatus((prev) => ({
      ...prev,
      [justificacionId]: {
        ...prev[justificacionId],
        [field]: { value, loading: false, saved: false },
      },
    }));

    if (saveImmediately) {
      try {
        const payload = {
          recomendaciones_desfavorables: [{
            id: justificacionId,
            [field]: value,
          }],
        };
        await updatePasoSubdere(payload);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [justificacionId]: {
            ...prevStatus[justificacionId],
            [field]: { ...prevStatus[justificacionId][field], loading: false, saved: true },
          },
        }));
      } catch (error) {
        console.error('Error updating data', error);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [justificacionId]: {
            ...prevStatus[justificacionId],
            [field]: { loading: false, saved: false },
          },
        }));
      }
    }
  };


  return (
    <>

      <div className="col-11">
        <div className="container-fluid">

          <h4 className="text-sans-h4">
            3. Justificación de recomendaciones desfavorables
          </h4>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              Deberás escribir una justificación por cada región que tenga una recomendación desfavorable de transferencia.
            </h6>
          </div>

          <div className="mb-4 col-11">
            <div className="container-fluid">
              {Array.isArray(temporalidad) && temporalidad.map((region, index) => (
                <React.Fragment key={index}>
                  <div
                    className="col d-flex flex-column justify-content-between my-5 col-11"
                    key={region.id}
                  >
                    <div className="d-flex flex-row">
                      <div className="col-12">
                        <p className="text-sans-p-bold">Recomendación desfavorable: {region.region_label_value[0].label}</p>
                      </div>
                    </div>


                    <div className="mx-2">
                      <CustomTextarea
                        label="Justificación"
                        placeholder="Justifica brevemente la recomendación de transferencia"
                        name="justificacion"
                        maxLength={500}
                        value={region.justificacion || ''}
                        onBlur={(e) => handleUpdate(region.id, 'justificacion', e.target.value, true)}
                        loading={inputStatus[region.id]?.justificacion?.loading}
                        saved={inputStatus[region.id]?.justificacion?.saved}
                      />
                    </div>
                    <hr className="col-12" />
                  </div>

                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};