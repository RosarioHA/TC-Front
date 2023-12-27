import { useEffect, useContext } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { FormularioContext } from "../../context/FormSectorial";
import Subpaso_CuatroPuntoUno from "../../components/formSectorial/paso4/p4.1";
import { MonoStepers } from "../../components/stepers/MonoStepers";

const PasoCuatro = () => {
  const { 
    updateStepNumber,
    pasoData ,data} = useContext(FormularioContext);
  const stepNumber = 4;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  const { indicador_desempeno, lista_indicadores, paso4 } = pasoData;

  // Asegúrate de que paso1 tenga elementos y accede al primer elemento
  const paso4Data = paso4 && paso4.length > 0 ? paso4[ 0 ] : null;
  if (!paso4Data) return <div>No hay datos disponibles para el Paso 1</div>;


  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso4Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso4Data.nombre_paso}</h3>
            <Avance avance={paso4Data.avance} />
          </div>

          <div className="">
            <Subpaso_CuatroPuntoUno data={indicador_desempeno} listaData={lista_indicadores} />
          </div>
          {/*Botones navegacion*/}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso4Data.numero_paso} id={ data.id} />
          </div>
        </div>
      </div>

      
    </>
  )
};

export default PasoCuatro;
