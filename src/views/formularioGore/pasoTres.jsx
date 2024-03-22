import { useContext, useEffect } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { Sub_1 } from "../../components/formGore/paso3/Sub_1";
import { Sub_2 } from "../../components/formGore/paso3/Sub_2";
import { ResumenDiferencial } from "../../components/formGore/componentes/ResumenDiferencial";


const PasoTresGore = () =>
{
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 3;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber, dataFormGore ])

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 3</div>;

  console.log(dataPasoGore);

  const { paso3_gore = {},
    costos_informados_gore,
    costos_justificados_gore,
    costos_justificar_gore
  } = dataPasoGore;

  console.log("3", paso3_gore)

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={stepNumber} />
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3_gore?.nombre_paso}</h3>
            <Avance avance={paso3_gore?.avance} />
          </div>
          <Sub_1 />
          <Sub_2 data={dataPasoGore} paso3={paso3_gore} />
          <ResumenDiferencial
            informada={costos_informados_gore}
            justificados={costos_justificados_gore}
            justificar={costos_justificar_gore}
          />
          <NavigationGore step={stepNumber} id={dataFormGore ? dataFormGore.id : null} />
        </div>
      </div>
    </>
  )
}

export default PasoTresGore; 