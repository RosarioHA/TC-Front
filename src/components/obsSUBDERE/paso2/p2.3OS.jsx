import { useState } from "react";
import EtapasYprocedimientos from "../../tables/EtapasYprocedimientos";

export const Subpaso_dosPuntoTresOS = () => {
  const [cantidadEtapas] = useState(1);

  return(
    <div>
      <h4 className="text-sans-h4">2.3 Descripción de etapas y procedimientos del ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se deben describir las etapas que componen el ejercicio de la competencia, indicando los procedimientos que se realizan, los hitos que la componen, y las unidades que intervienen en su ejecución, y sus responsabilidades.</h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate que las etapas, procedimientos y unidades intervinientes están bien llenadas, ya que esta información será utilizada más adelante en tu formulario.</h6>
  
      {/* Renderizar componentes EtapasYprocedimientos según la cantidad de etapas del backend */}
      {[...Array(cantidadEtapas)].map((_, index) => (
        <div key={index}>
          <EtapasYprocedimientos 
          index={index + 1}
          readOnly={true} />
        </div>
      ))}
    </div>
  )
};
