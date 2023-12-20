import { useState } from "react";
import DropdownSelect from "../dropdown/select"
import CustomInput from "../forms/custom_input";

const IndicadoresDesempeno = (index) => {
  //const [indicadores, setIndicadores] = useState([{ id: 1 }]);

  // const agregarIndicador = () => {
  //   const nuevoProcedimiento = { id: indicadores.length + 1 };
  //   setIndicadores([...indicadores, nuevoProcedimiento]);
  // };

  // const eliminarIndicador = (id) => {
  //   const procedimientosActualizados = indicadores.filter(
  //     (proc) => proc.id !== id
  //   );
  //   setIndicadores(procedimientosActualizados);
  // };

  return(
    <div className="container">
      <div className="d-flex neutral-line">
        <p>{index}</p>
        <DropdownSelect 
        placeholder="Tipo de indicador"
        options=""/>
        <CustomInput 
        placeholder="Formula de cálculo"
        maxLength={300}/>
      </div>

      <CustomInput 
      label="Descripción (Obligatorio)"
      placeholder="Describe el indicador de desempeño"
      maxLength={300}/>
      <CustomInput 
      label="Medios utilizados para su cálculo (Obligatorio)"
      placeholder="Describe los medios utilizados para su cálculo"
      maxLength={300}/>
      <CustomInput 
      label="Verificador asociado al indicador (Obligatorio)"
      placeholder="Describe los medios de verificación del indicador"
      maxLength={300}/>

      <button className="btn-secundario-s m-2">
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar indicador</p>
      </button>
    </div>
  )
};

export default IndicadoresDesempeno