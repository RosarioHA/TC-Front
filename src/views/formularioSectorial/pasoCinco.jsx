import { useEffect, useContext } from 'react';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CincoPuntoUno } from '../../components/formSectorial/paso5/p5.1';
import { Subpaso_CincoDos } from '../../components/formSectorial/paso5/p5.2';
import { Subpaso_CincoPuntoTres } from "../../components/formSectorial/paso5/p5.3";
const PasoCinco = () =>
{
  const {
    updateStepNumber,
    pasoData, data } = useContext(FormularioContext);

  const stepNumber = 5;

  console.log("5", pasoData)

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);


  const { paso5 } = pasoData;

  // Asegúrate de que paso1 tenga elementos y accede al primer elemento
  const paso5Data = paso5 && paso5.length > 0 ? paso5[ 0 ] : null;
  if (!paso5Data) return <div>No hay datos disponibles para el Paso 5</div>;


  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso5Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso5Data.nombre_paso}</h3>
            <Avance avance={paso5Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          {/*Botones navegacion  */}
          <Subpaso_CincoPuntoUno />
          <Subpaso_CincoDos data={pasoData} />
          <Subpaso_CincoPuntoTres />
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso5Data.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PasoCinco