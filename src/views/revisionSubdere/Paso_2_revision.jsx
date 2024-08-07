import { useContext, useEffect, useCallback } from "react";
import { Avance } from "../../components/tables/Avance";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormSubdereContext } from "../../context/RevisionFinalSubdere";
import { JustificacionDesfavorables } from "../../components/formSubdere/paso2/p3_Subdere";
import { Temporalidad } from "../../components/formSubdere/paso2/p4_1_Subdere";
import { RestoCampos } from "../../components/formSubdere/paso2/p4_Subdere_resto";
import { NavigationSubdere } from "../../components/layout/navigationSubdere";

const Paso_2_Revision = () => {
  const {
    dataPasoSubdere,
    errorPasoSubdere,
    updateStepNumber,
  } = useContext(FormSubdereContext);

  const stepNumber = 2;

  const handleUpdateStepNumber = useCallback(() => {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber ]);

  useEffect(() => {
    handleUpdateStepNumber();
  }, [ handleUpdateStepNumber ]);

  if (errorPasoSubdere) return <div>Error: {errorPasoSubdere.message || "Error desconocido"}</div>;
  if (!dataPasoSubdere?.paso2_revision_final_subdere) return <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando paso 2</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>;
  if (!dataPasoSubdere || dataPasoSubdere.length === 0) return <div>No hay datos disponibles para el Paso 2</div>;

  const {
    solo_lectura,
    paso2_revision_final_subdere = {},
    recomendaciones_desfavorables,
    temporalidad_gradualidad,
    regiones_temporalidad,
    temporalidad_opciones,
    recursos_requeridos,
    modalidad_ejercicio,
    modalidad_ejercicio_opciones,
    implementacion_acompanamiento,
    condiciones_ejercicio,
    regiones_recomendadas,
    competencias_agrupadas, 
    nombre
  } = dataPasoSubdere;


  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={stepNumber} />
      </div>
      <div className="col-11">
        <div className="container ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso2_revision_final_subdere.nombre_paso}</h3>
            <Avance avance={paso2_revision_final_subdere.avance} />
          </div>
          <div className="my-4 ">
            <JustificacionDesfavorables
              recomendaciones_desfavorables={recomendaciones_desfavorables}
              solo_lectura={solo_lectura}
            />
          </div>
          <div className="my-4 ">
            <h4 className="text-sans-h4">
              4. Recomendaciones y condiciones de ejercicio
            </h4>
            {regiones_recomendadas && regiones_recomendadas.length > 0 ? (
              <>
                <div className="text-sans-h6-primary my-3 col-11">
                  <h6>
                    Deberás explicar la recomendación de transferencia y las condiciones en cada criterio para las regiones con recomendación favorable.
                  </h6>
                </div>
                <div className="my-4 col-10 ">
                  <Temporalidad
                    temporalidad={temporalidad_gradualidad}
                    regiones_temporalidad={regiones_temporalidad}
                    temporalidad_opciones={temporalidad_opciones}
                    solo_lectura={solo_lectura}
                    regiones_recomendadas={regiones_recomendadas}
                  />
                </div>
                <div className="my-4 ">
                  <RestoCampos
                    solo_lectura={solo_lectura}
                    recursos_requeridos={recursos_requeridos}
                    modalidad_ejercicio={modalidad_ejercicio}
                    modalidad_ejercicio_opciones={modalidad_ejercicio_opciones}
                    implementacion_acompanamiento={implementacion_acompanamiento}
                    condiciones_ejercicio={condiciones_ejercicio}
                    nombre_competencia={nombre}
                    competencias_agrupadas={competencias_agrupadas}
                    regiones_recomendadas={regiones_recomendadas}
                  />
                </div>
              </>
            ) : (
              <div className="alert alert-info col-8">
                No hay regiones con recomendación favorable en la selección.
                Esta sección del formulario es solo para las regiones con
                recomendación favorable.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ps-5">
        <NavigationSubdere step={paso2_revision_final_subdere.numero_paso} id={dataPasoSubdere?.id}
          permisoSiguiente={paso2_revision_final_subdere?.campos_obligatorios_completados}
          solo_lectura={solo_lectura} />
      </div>
      
    </>
  );
}
export default Paso_2_Revision