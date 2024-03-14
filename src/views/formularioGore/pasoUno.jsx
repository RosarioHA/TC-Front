import { useContext, useEffect } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { SubUno_Uno } from "../../components/formGore/paso1/sub1.1";
import { SubUno_dos } from "../../components/formGore/paso1/sub1.2";
import { SubUno_Tres } from "../../components/formGore/paso1/sub1.3";


const PasoUnoGore = () =>
{
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 1;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { paso1_gore, flujograma_ejercicio_competencia } = dataPasoGore;
  const paso1Data = paso1_gore || {};

  console.log(paso1Data)
  console.log(paso1_gore)

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso1Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container-fluid">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1Data.nombre_paso}</h3>
            <Avance avance={paso1Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <SubUno_Uno
            dataPaso={paso1Data}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
          />
          <SubUno_dos
            pasoData={paso1Data}
            flujograma={flujograma_ejercicio_competencia}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
          />
          <SubUno_Tres
            pasoData={paso1Data}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
          />
          <NavigationGore step={paso1Data.numero_paso} id={dataFormGore?.id} />
        </div>
      </div>
    </>
  );
};

export default PasoUnoGore;