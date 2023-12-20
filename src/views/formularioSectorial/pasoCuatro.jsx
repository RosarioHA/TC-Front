import { useEffect, useContext } from "react";
import { Avance } from "../../components/tables/Avance"; 
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { FormularioContext } from "../../context/FormSectorial";
import Subpaso_CuatroPuntoUno from "../../components/formSectorial/paso4/p4.1";

const PasoCuatro = () => {
  const { updateStepNumber } = useContext(FormularioContext);
  const stepNumber = 4;

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  return (
    <div className="container vh-100">
      <div className="d-flex">
        <h3 className="mt-3">Indicadores de Desempeño</h3>
        <Avance/>
      </div>

      <div>
        <Subpaso_CuatroPuntoUno />
      </div>

      {/*Botones navegacion*/}
      <div className="container me-5 pe-5">
        <ButtonsNavigate step="" id=""/>
      </div>
    </div> 
  )
};

export default PasoCuatro;
