import { useContext, useState, useMemo } from "react";
import { OpcionesCheck } from "../../../fase1/forms/OpcionesCheck";
import CKEditorField from "../../../fase1/forms/ck_editor";
import { FormSubdereContext } from "../../../../context/RevisionFinalSubdere";
//import IndicadoresRecomendacion from "../../tables/IndicadoresRecomendacion";
import { IndicadoresDesempeno } from "./p4_5a_Subdere_indicadores_desempeno";

export const RestoCampos = ({
  solo_lectura,
  recursos_requeridos,
  modalidad_ejercicio,
  implementacion_acompanamiento,
  condiciones_ejercicio,
  nombre_competencia,
  competencias_agrupadas,
  regiones_recomendadas, 
  segunda_etapa,
}) => {
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [ inputStatus, setInputStatus ] = useState({
    justificacion: { loading: false, saved: false },
  });

  // Determinar si todos los componentes deben estar deshabilitados
  const disableAll = useMemo(() => regiones_recomendadas.length === 0, [ regiones_recomendadas ]);

  const handleBlur = (fieldName, value) => {
    if (!disableAll) {
      handleUpdate(fieldName, value, true);
    }
  };

  const handleUpdate = async (field, value, saveImmediately = false) => {
    setInputStatus((prev) => ({
      ...prev,
      [ field ]: { ...prev[ field ], loading: true, saved: false },
    }));

    let adjustedValue = value;
    if (field === 'modalidad_ejercicio') {
      adjustedValue = value ? 'Exclusiva' : 'Compartida';
    }

    if (saveImmediately) {
      try {
        let payload;

        if (Array.isArray(competencias_agrupadas) && competencias_agrupadas.length > 0) {
          const competenciaId = Number(field.split('_')[ 1 ]);
          const updatedCompetencia = competencias_agrupadas.find((comp) => comp.id === competenciaId);

          if (updatedCompetencia) {
            payload = {
              competencias_agrupadas: [
                { id: competenciaId, modalidad_ejercicio: adjustedValue }
              ]
            };
          } else {
            payload = {
              [ field ]: adjustedValue,
            };
          }
        } else {
          payload = {
            [ field ]: adjustedValue,
          };
        }

        await updatePasoSubdere(payload);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ field ]: { loading: false, saved: true },
        }));
      } catch (error) {
        console.error('Error updating data:', error);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ field ]: { loading: false, saved: false },
        }));
      }
    } else {
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ field ]: { value: adjustedValue, loading: false, saved: false },
      }));
    }
  };

  return (
    <>
      <div className="col-11">
        <div className="container-fluid">

          <h4 className="text-sans-h4">
            4.2 Recursos requeridos
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            {/* <h6>
              Texto de apoyo
            </h6> */}
          </div>
          <div className="mb-4 col-11">
            <CKEditorField
              placeholder="Describe el costo por subtítulo e ítem"
              data={recursos_requeridos || ''}
              onBlur={(value) => handleBlur('recursos_requeridos', value)}
              readOnly={solo_lectura || disableAll}
              loading={inputStatus?.recursos_requeridos?.loading}
              saved={inputStatus?.recursos_requeridos?.saved}
            />
          </div>

          <h4 className="text-sans-h4">
            4.3 Modalidad de ejercicio
          </h4>
          <div className="text-sans-h6 my-3 col-11">
          </div>
          <div className=" d-flex  justify-content-between mb-4 col-11 ">
            <div className="col-1 mx-4 my-0 text-sans-p-bold"> #</div>
            <div className="col-4 mx-4 my-0 text-sans-p-bold">

              Competencias
            </div>
            <div className="col-6 my-0 mx-5 text-sans-p-bold">
              Elige la modalidad de ejercicio
            </div>
          </div>

          {competencias_agrupadas ? (
            <div className="my-4">
              {competencias_agrupadas
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((competencia, index) => (
                  <div key={competencia.id}>
                    <div className="d-flex justify-content-between col-11 subrayado-gris h-auto">
                      <div className="col-1 ms-4 my-auto">{index + 1}</div>
                      <div className="col-5 mx-2 my-4">{competencia.nombre}</div>
                      <div className="col-6 my-auto mx-5">
                        <OpcionesCheck
                          initialState={competencia.modalidad_ejercicio}
                          handleEstadoChange={(value) =>
                            handleUpdate(`competencia_${competencia.id}_modalidad_ejercicio`, value, true)
                          }
                          loading={inputStatus[ `competencia_${competencia.id}_modalidad_ejercicio` ]?.loading}
                          saved={inputStatus[ `competencia_${competencia.id}_modalidad_ejercicio` ]?.saved}
                          altA="Exclusiva"
                          altB="Compartida"
                          field="modalidad_ejercicio"
                          fieldName="modalidad_ejercicio"
                          readOnly={solo_lectura || disableAll}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}

          {Array.isArray(competencias_agrupadas) && competencias_agrupadas.length === 0 && (
            <>
              <div className="d-flex justify-content-between col-11 subrayado-gris h-auto my-3">
                <div className="col-1 mx-4 my-auto">1</div>
                <div className="col-4 mx-4 my-3">
                  {nombre_competencia}
                </div>
                <div className="col-6 my-auto mx-5">
                  <OpcionesCheck
                    id={`modalidad_ejercicio`}
                    handleEstadoChange={(value) => handleUpdate('modalidad_ejercicio', value, true)}
                    initialState={modalidad_ejercicio}
                    loading={inputStatus?.modalidad_ejercicio?.loading}
                    saved={inputStatus?.modalidad_ejercicio?.saved}
                    altA="Exclusiva"
                    altB="Compartida"
                    field="modalidad_ejercicio"
                    fieldName="modalidad_ejercicio"
                    readOnly={solo_lectura || disableAll}
                  />
                </div>
              </div>
            </>
          )}

          <h4 className="text-sans-h4">
            4.4 Implementación y acompañamiento
          </h4>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6> En esta instancia aún no podrás construir indicadores. Tendrás una instancia nueva post-CID, que aparecerá en esta sección con esos fines.</h6>
          </div>
          <div className="mb-4 col-11">
            <h6>
              <CKEditorField
                placeholder="Describe el costo por subtítulo e ítem"
                data={implementacion_acompanamiento || ''}
                onBlur={(value) => handleBlur('implementacion_acompanamiento', value)}
                readOnly={solo_lectura || disableAll}
                loading={inputStatus?.implementacion_acompanamiento?.loading}
                saved={inputStatus?.implementacion_acompanamiento?.saved}
              />
            </h6>
          </div>

          <h4 className="text-sans-h4">
            4.5 Condiciones de ejercicio
          </h4>
          <div className="text-sans-h6 my-3 col-11">
            {/* <h6>
              Texto de apoyo
            </h6> */}
          </div>
          <div className="mb-4 col-11">
            <h6>
              <CKEditorField
                placeholder="Describe el costo por subtítulo e ítem"
                data={condiciones_ejercicio || ''}
                onBlur={(value) => handleBlur('condiciones_ejercicio', value)}
                readOnly={solo_lectura || disableAll}
                loading={inputStatus?.condiciones_ejercicio?.loading}
                saved={inputStatus?.condiciones_ejercicio?.saved}
              />
            </h6>
          </div>

          {/* APARECE SOLO DURANTE LA SEGUNDA ETAPA */}
          { segunda_etapa && 
            <div  className="">
              <IndicadoresDesempeno/>
            </div>
          }
          

          <div className="col-11">
            <h4 className="text-sans-h4">
              4.6 Condiciones cuyo incumplimiento dan lugar a la revocación de la transferencia
            </h4>
            <div className="text-sans-h6 my-3">
              <p className="text-sans-p col-11">
                Según establece el reglamento que fija las condiciones, plazos y demás materias concernientes al procedimiento
                de transferencia de competencias, el Presidente de la República podrá revocar de oficio y fundadamente la
                transferencia de las competencias efectuada en forma temporal, cuando se constate la concurrencia de alguna de
                las siguientes causales:
              </p>
            </div>
            <div className="mb-4 col-11">
              <p className="text-sans-p ms-3">
                a. Incumplimiento de las condiciones que se hayan establecido para el ejercicio de la competencia transferida
                en el decreto supremo que la dispuso, o sus modificaciones, según lo dispuesto en el artículo 29 literal e)
                del reglamento aprobado por el Decreto N° 656, de 2019, que fija las condiciones, plazos y demás materias
                concernientes al procedimiento de transferencia de competencias.
              </p>
              <p className="text-sans-p ms-3">
                b. Deficiente prestación del servicio a la comunidad.
              </p>
              <p className="text-sans-p ms-3">
                c. Ejercicio de las competencias transferidas de una forma que sea incompatible con las políticas nacionales
                cuando éstas hayan sido dictadas en forma posterior a la transferencia, sin que se realizaren los ajustes
                necesarios. Para ello, en caso de un cambio en la política nacional, el gobierno regional tendrá un plazo de
                seis meses para efectuar la adecuación respectiva.
              </p>
              <p className="text-sans-p ms-3">
                d. No cumplir con los estándares de resguardo técnico establecidos en Protocolo de Coordinación Internivel
                con organismos encargados de movilidad, y que serán supervisados por el Ministerio de Transportes y
                Telecomunicaciones.
              </p>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};