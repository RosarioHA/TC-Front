import { useContext, useEffect } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno } from '../../components/formSectorial/paso1/p1.1';
import { Subpaso_dos } from '../../components/formSectorial/paso1/p1.2';
import { Subpaso_tres } from '../../components/formSectorial/paso1/p1.3';
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from '../../components/stepers/MonoStepers';

const PasoUno = () => {
  const { pasoData, errorPaso, updateStepNumber, data } = useContext(FormularioContext);
  const stepNumber = 1;

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;
  
  const { marcojuridico, organigramaregional, paso1 } = pasoData;
  const paso1Data = paso1 || {}; 


  return (
    <>
      <div className="col-1">
      {paso1Data.numero_paso && <MonoStepers stepNumber={paso1Data.numero_paso} />}
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3">{paso1Data.nombre_paso}</h3>
            <Avance avance={paso1Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_uno dataPaso={paso1Data} marcojuridico={marcojuridico} id={data ? data.id : null} stepNumber={stepNumber} />
          <Subpaso_dos pasoData={paso1Data} organigrama={organigramaregional}  id={data ? data.id : null} stepNumber={stepNumber} />
          <Subpaso_tres pasoData={paso1Data}   id={data ? data.id : null} stepNumber={stepNumber} />
          <ButtonsNavigate step={paso1Data.numero_paso} id={data ? data.id : null} />
        </div>
      </div>
    </>
  );
};

export default PasoUno;