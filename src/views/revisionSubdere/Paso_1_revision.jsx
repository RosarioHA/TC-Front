import { useContext, useEffect, useCallback } from "react";
import { Avance } from "../../components/tables/Avance";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormSubdereContext } from "../../context/RevisionFinalSubdere";
import { AmbitoDefinitivo } from "../../components/formSubdere/paso1/p1_Subdere";
import { RecomendacionTransferencia } from "../../components/formSubdere/paso1/p2_Subdere";


const Paso_1_revision = () => {
  const {
    dataFormSubdere,
    dataPasoSubdere,
    loadingPasoSubdere,
    errorPasoSubdere,
    updateStepNumber,
  } = useContext(FormSubdereContext)

  const stepNumber = 1;

  const handleUpdateStepNumber = useCallback(() => {
    const stepNumber = 1;
    updateStepNumber(stepNumber);
  }, [updateStepNumber]);

  useEffect(() => {
    handleUpdateStepNumber();
  }, [handleUpdateStepNumber]);

  if (errorPasoSubdere) return <div>Error: {errorPasoSubdere.message || "Error desconocido"}</div>;
  if (!dataPasoSubdere?.paso1_revision_final_subdere) return <div>Cargando...</div>;
  if (!dataPasoSubdere || dataPasoSubdere.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { 
    paso1_revision_final_subdere = {},
    ambito_definitivo_competencia
   } = dataPasoSubdere;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={stepNumber} />
      </div>
      <div className="col-11">
        <div className="container-fluid">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1_revision_final_subdere.nombre_paso}</h3>
            <Avance avance={paso1_revision_final_subdere.avance} />
          </div>
          <div className="my-4 ">
            <AmbitoDefinitivo
              ambito_definitivo_competencia = {ambito_definitivo_competencia}
             />
          </div>
          <div className="my-4 ">
            <RecomendacionTransferencia />
          </div>
        </div>
      </div>
    </>
  );
}

export default Paso_1_revision;