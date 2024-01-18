import { useState, useEffect, useContext } from "react";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import CustomInput from "../../forms/custom_input";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { RadioButtons } from "../../forms/radio_btns";

export const Subpaso_dosPuntoCuatro = ({
  id,
  data,
  stepNumber,
  refreshSubpasoDos_cuatro,
  setRefreshSubpasoDos_cuatro
}) => {

  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ opcionesEtapas, setOpcionesEtapas ] = useState([]);  


    return(
      <div>
        <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
        <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>

        
  
        

      </div>
    )
  };