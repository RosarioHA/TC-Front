import { useState } from "react";
import Costos from "../../tables/Costos";

const Subpaso_CincoPuntoUno = () => {
  const [costosDirectos, setCostoDirecto] = useState([{ id: 1 }]);
  const [costosIndirectos, setCostoIndirecto] = useState([{ id: 1 }]);

  const agregarCostoDirecto = () => {
    const nuevoIndicador = { id: costosDirectos.length + 1 };
    setCostoDirecto([...costosDirectos, nuevoIndicador]);
  };

  const agregarCostoIndirecto = () => {
    const nuevoIndicador = { id: costosIndirectos.length + 1 };
    setCostoIndirecto([...costosIndirectos, nuevoIndicador]);
  };

  return (
    <div className="mt-4">
      <h4 className="text-sans-h4">5.1 Costos asociados al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">Para realizar un correcto costeo de la competencia, se toman como bases las etapas descritas y diagramadas en el paso 2. A partir de estas etapas, se deben completar las siguientes tablas de costos por subtitulo.</h6>
      
      <p className="text-sans-m-semibold mt-4">a. Costos directos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      {costosDirectos.map((costo) => (
        <div key={costo.id}>
        <Costos />
        <hr/>
      </div>
      ))}

      <button 
      className="btn-secundario-s m-2"
      onClick={agregarCostoDirecto}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar indicador</p>
      </button>

      <div>COMPONENTE SUMA</div>
      <hr/>

      <p className="text-sans-m-semibold mt-4">b. Costos indirectos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      {costosIndirectos.map((costo) => (
        <div key={costo.id}>
        <Costos />
        <hr/>
      </div>
      ))}

      <button 
      className="btn-secundario-s m-2"
      onClick={agregarCostoIndirecto}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar indicador</p>
      </button>

      <div>COMPONENTE SUMA</div>
      <hr/>

      <p className="text-sans-m-semibold mt-4">c. Sumatoria de costos anuales destinados al ejercicio de la competencia</p>

      <div>COMPONENTE TABLA SUMATORIA</div>

    </div>
  )
};
  
export default Subpaso_CincoPuntoUno;