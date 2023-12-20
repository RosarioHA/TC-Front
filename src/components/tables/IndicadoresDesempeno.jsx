import { useState } from "react";
import DropdownSelect from "../dropdown/select";
import CustomTextarea from "../forms/custom_textarea";

const IndicadoresDesempeno = () => {
  const [indicadores, setIndicadores] = useState([{ id: 1 }]);

  const agregarIndicador = () => {
    const nuevoIndicador = { id: indicadores.length + 1 };
    setIndicadores([...indicadores, nuevoIndicador]);
  };

  const eliminarIndicador = (id) => {
    const indicadoresActualizados = indicadores.filter(
      (proc) => proc.id !== id
    );
    setIndicadores(indicadoresActualizados);
  };

  return(
    <div className="container">
      <div className="d-flex mb-2">
        <div className="ms-4">#</div>
        <div className="col-3 ms-3">
          <p className="text-sans-p-bold mb-0">Tipo de indicador </p>
          <p className="text-sans-p-grayc">(Obligatorio)</p>
        </div>
        <div className="ms-4">
          <p className="text-sans-p-bold mb-0">Fórmula de cálculo </p>
          <p className="text-sans-p-grayc">(Obligatorio)</p>
        </div>
      </div>
          
      {indicadores.map((indicador) => (
        <div key={indicador.id}>
        <div className="d-flex neutral-line p-2">
          <p className="text-sans-p-bold mx-3 mt-4">{indicador.id}</p>
          <div className="col-3 mt-2">
            <DropdownSelect 
            placeholder="Tipo de indicador"
            options=""/>
          </div>
          <div className="col mx-4 mt-2">
            <CustomTextarea 
            placeholder="Formula de cálculo"
            maxLength={300}/>
          </div>
      
          {indicadores.length > 1 && ( // Condición para mostrar el botón "Eliminar"
            <div className="col-1 me-4">
              <button
                className="btn-terciario-ghost mt-3"
                onClick={() => eliminarIndicador(indicador.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar</p>
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 mx-3">
          <CustomTextarea 
          label="Descripción (Obligatorio)"
          placeholder="Describe el indicador de desempeño"
          maxLength={300}/>
        </div>
        <div className="mt-2 mx-3">
          <CustomTextarea 
          label="Medios utilizados para su cálculo (Obligatorio)"
          placeholder="Describe los medios utilizados para su cálculo"
          maxLength={300}/>
        </div>
        <div className="mt-2 mx-3">
          <CustomTextarea 
          label="Verificador asociado al indicador (Obligatorio)"
          placeholder="Describe los medios de verificación del indicador"
          maxLength={300}/>
        </div>
        
        
      </div>
      ))}
    
      <button 
      className="btn-secundario-s m-2"
      onClick={agregarIndicador}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar indicador</p>
      </button>
    </div>
  )
};

export default IndicadoresDesempeno