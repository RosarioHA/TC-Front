import React, { useContext, useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { OpcionesAB } from "../../forms/opciones_AB";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CKEditorField from "../../forms/ck_editor";


export const RestoCampos = ({
  solo_lectura,
  recursos_requeridos,
  modalidad_ejercicio,
  implementacion_acompanamiento,
  condiciones_ejercicio
}) => {

  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [inputStatus, setInputStatus] = useState({
    justificacion: { loading: false, saved: false },
  });

  const handleBlur = (fieldName, value) => {
    handleUpdate(fieldName, value, true);
  };

  const handleUpdate = async (field, value, saveImmediately = false) => {
    // Actualiza el estado de inputStatus para indicar que un campo está siendo actualizado
    setInputStatus((prev) => ({
      ...prev,
      [field]: { ...prev[field], loading: true, saved: false },
    }));

    // Verifica si el campo a actualizar es 'modalidad_ejercicio'
    // y ajusta el valor de acuerdo a 'Exclusiva' o 'Compartida'
    let adjustedValue = value;
    if (field === 'modalidad_ejercicio') {
      adjustedValue = value ? 'Exclusiva' : 'Compartida';
    }

    if (saveImmediately) {
      try {
        // Construye el payload con el campo y el valor ajustado
        const payload = {
          [field]: adjustedValue,
        };

        // Llama a la función que actualiza los datos en el backend
        await updatePasoSubdere(payload);

        // Actualiza el estado de inputStatus para indicar que el campo ha sido guardado exitosamente
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [field]: { loading: false, saved: true },
        }));
      } catch (error) {
        console.error('Error updating data:', error);
        // En caso de error, actualiza el estado para reflejar que la actualización falló
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [field]: { loading: false, saved: false },
        }));
      }
    } else {
      // Si saveImmediately no es true, simplemente actualiza el valor en el estado local
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [field]: { value: adjustedValue, loading: false, saved: false },
      }));
    }
  };



  return (
    <>
      <div className="col-11">
        <div className="container-fluid">

          <h4 className="text-sans-h4">
            4.3 Recursos requeridos
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              Texto de apoyo
            </h6>
          </div>
          <div className="mb-4 col-11">
          <CKEditorField
              placeholder="Describe el costo por subtítulo e ítem"
              data={recursos_requeridos || ''}
              onBlur={(value) => handleBlur('recursos_requeridos', value)}
              readOnly={solo_lectura}
              loading={inputStatus?.recursos_requeridos?.loading}
              saved={inputStatus?.recursos_requeridos?.saved}
            />
          </div>

          <h4 className="text-sans-h4">
            4.4 Modalidad de ejercicio
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              Texto de apoyo
            </h6>
          </div>
          <div className="mb-4 col-11">
            <OpcionesAB
              id={`modalidad_ejercicio`}
              initialState={modalidad_ejercicio}
              handleEstadoChange={(value) =>
                handleUpdate('modalidad_ejercicio', value, true)
              }
              loading={inputStatus?.modalidad_ejercicio?.loading}
              saved={inputStatus?.modalidad_ejercicio?.saved}
              altA="Exclusiva"
              altB="Compartida"
              field="modalidad_ejercicio"
              fieldName="modalidad_ejercicio"
            />
          </div>

          <h4 className="text-sans-h4">
            4.5 Implementación y acompañamiento
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              Texto de apoyo
            </h6>
          </div>
          <div className="mb-4 col-11">
            <h6>
            <CKEditorField
              placeholder="Describe el costo por subtítulo e ítem"
              data={implementacion_acompanamiento || ''}
              onBlur={(value) => handleBlur('implementacion_acompanamiento', value)}
              readOnly={solo_lectura}
              loading={inputStatus?.implementacion_acompanamiento?.loading}
              saved={inputStatus?.implementacion_acompanamiento?.saved}
            />
            </h6>
          </div>

          <h4 className="text-sans-h4">
            4.6 Condiciones de ejercicio
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              Texto de apoyo
            </h6>
          </div>
          <div className="mb-4 col-11">
            <h6>
            <CKEditorField
              placeholder="Describe el costo por subtítulo e ítem"
              data={condiciones_ejercicio || ''}
              onBlur={(value) => handleBlur('condiciones_ejercicio', value)}
              readOnly={solo_lectura}
              loading={inputStatus?.condiciones_ejercicio?.loading}
              saved={inputStatus?.condiciones_ejercicio?.saved}
            />
            </h6>
          </div>

          <h4 className="text-sans-h4">
            4.7 Condiciones cuyo incumplimiento dan lugar a la revocación de la transferencia
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            <h6>
              Según establece el reglamento que fija las condiciones, plazos y demás materias concernientes al procedimiento
              de transferencia de competencias, el Presidente de la República podrá revocar de oficio y fundadamente la
              transferencia de las competencias efectuada en forma temporal, cuando se constate la concurrencia de alguna de
              las siguientes causales:
            </h6>
          </div>
          <div className="mb-4 col-11">
            <h6>
              a. Incumplimiento de las condiciones que se hayan establecido para el ejercicio de la competencia transferida
              en el decreto supremo que la dispuso, o sus modificaciones, según lo dispuesto en el artículo 29 literal e)
              del reglamento aprobado por el Decreto N° 656, de 2019, que fija las condiciones, plazos y demás materias
              concernientes al procedimiento de transferencia de competencias.
            </h6>
            <h6>
              b. Deficiente prestación del servicio a la comunidad.
            </h6>
            <h6>
              c. Ejercicio de las competencias transferidas de una forma que sea incompatible con las políticas nacionales
              cuando éstas hayan sido dictadas en forma posterior a la transferencia, sin que se realizaren los ajustes
              necesarios. Para ello, en caso de un cambio en la política nacional, el gobierno regional tendrá un plazo de
              seis meses para efectuar la adecuación respectiva.
            </h6>
            <h6>
              d. No cumplir con los estándares de resguardo técnico establecidos en Protocolo de Coordinación Internivel
              con organismos encargados de movilidad, y que serán supervisados por el Ministerio de Transportes y
              Telecomunicaciones.
            </h6>
          </div>



        </div>
      </div>
    </>
  );
};