import { useContext, useEffect } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno_OS } from '../../components/obsSUBDERE/paso1/p1.1OS';
import { Subpaso_dos_OS } from '../../components/obsSUBDERE/paso1/p1.2OS'; 
import { Subpaso_tres_OS } from '../../components/obsSUBDERE/paso1/p1.3OS'; 
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from '../../components/stepers/MonoStepers';

const PasoUnoOS = () => {
  const { pasoData, loadingPaso, errorPaso, updateStepNumber,data } = useContext(FormularioContext);
  const stepNumber = 1;
  
  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { marcojuridico, organigramaregional, paso1 } = pasoData;

  // Asegúrate de que paso1 tenga elementos y accede al primer elemento
  const paso1Data = paso1 && paso1.length > 0 ? paso1[0] : null;
  if (!paso1Data) return <div>No hay datos disponibles para el Paso 1</div>;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso1Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3">{paso1Data.nombre_paso}</h3>
            <Avance avance={paso1Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_uno_OS pasoData={paso1Data} marcojuridico={marcojuridico}/>
          <Subpaso_dos_OS pasoData={paso1Data} organigrama={organigramaregional} />
          <Subpaso_tres_OS pasoData={paso1Data} />
          <ButtonsNavigate step={paso1Data.numero_paso} id={data.id} />
        </div>
      </div>
    </>
  );
};

export default PasoUnoOS;