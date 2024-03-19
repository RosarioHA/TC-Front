import { useContext, useEffect, useCallback } from "react";
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

  const handleUpdateStepNumber = useCallback(() =>
  {
    const stepNumber = 1;
    updateStepNumber(stepNumber);
  }, [ updateStepNumber ]);

  useEffect(() =>
  {
    handleUpdateStepNumber();
  }, [ handleUpdateStepNumber ]);


  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore?.paso1_gore) return <div>Cargando...</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { paso1_gore = {}, flujograma_ejercicio_competencia } = dataPasoGore;


  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={stepNumber} />
      </div>
      <div className="col-11">
        <div className="container-fluid">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1_gore.nombre_paso}</h3>
            <Avance avance={paso1_gore.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <SubUno_Uno
            dataPaso={paso1_gore}
            id={dataFormGore.id}
            stepNumber={stepNumber}
          />
          <SubUno_dos
            flujograma={flujograma_ejercicio_competencia}
            id={dataFormGore.id}
            stepNumber={stepNumber}
          />
          <SubUno_Tres
            pasoData={paso1_gore}
            id={dataFormGore.id}
            stepNumber={stepNumber}
          />
          <NavigationGore step={paso1_gore.numero_paso} id={dataFormGore?.id} />
        </div>
      </div>
    </>
  );
};

export default PasoUnoGore;