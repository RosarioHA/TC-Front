import React, { useContext, useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


export const Temporalidad = ({ 
  temporalidad,
  regiones_temporalidad,
  temporalidad_opciones
}) => {

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
            4.1 Temporalidad
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              En esta sección deberás mostrar el detalle de temporalidad para cada grupo de regiones con recomendación favorable. En caso de tener solo una región, solo podrás hacer un grupo. Todos los campos son obligatorios.            </h6>
          </div>

          <div className="mb-4 col-11">
            <div className="container-fluid">
              {Array.isArray(temporalidad) && temporalidad.map((grupo, index) => (
                <React.Fragment key={index}>
                  <div
                    className="col d-flex flex-column justify-content-between my-5 col-11"
                    key={grupo.id}
                  >
                    <div className="d-flex flex-row">
                      <div className="col-12">
                        <p className="text-sans-p-bold">Grupo {index +1}</p>
                      </div>
                    </div>


                    <div className="mx-2">
                      <CustomTextarea
                        label="Justifica la temporalidad de este grupo"
                        placeholder="Justifica la temporalidad de este grupo de regiones"
                        name="justificacion_temporalidad"
                        maxLength={500}
                        value={grupo.justificacion_temporalidad || ''}
                        onBlur={(e) => handleUpdate(grupo.id, 'justificacion_temporalidad', e.target.value, true)}
                        loading={inputStatus[grupo.id]?.justificacion_temporalidad?.loading}
                        saved={inputStatus[grupo.id]?.justificacion_temporalidad?.saved}
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