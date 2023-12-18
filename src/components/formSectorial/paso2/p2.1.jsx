import { useState } from "react";
import TablaEncabezadoFijo from "../../tables/EncabezadoFijo";
import TablaEncabezadoSelector from "../../tables/EncabezadoSelector";

export const Subpaso_dosPuntoUno = () => {
  const [numTablasSelector, setNumTablasSelector] = useState(0);

  const agregarOrganismo = () => {
    setNumTablasSelector(numTablasSelector + 1);
  };

  const renderTablasSelector = () => {
    const tablas = [];
    for (let i = 0; i < numTablasSelector; i++) {
      tablas.push(
      <TablaEncabezadoSelector 
      key={i} 
      options={''} />
      );
    }
    return tablas;
  };

  return (
    <div>
      <h4 className="text-sans-h4">2.1 Organismos intervinientes en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se debe describir brevemente, según corresponda, la esfera de atribuciones que posee cada organismo que cumpla un rol en el ejercicio de la competencia. Si las atribuciones de los organismos no están establecidas por ley, o el organismo no tiene un rol en el ejercicio de la competencia, la casilla de descripción debe quedar vacía. </h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate de identificar correctamente los organismos intervinientes, ya que esta información será utilizada más adelante en tu formulario.</h6>

      <div className="my-4">
        <TablaEncabezadoFijo 
        encabezado="Ministerio o Servicio Público"/>
      </div>

      {renderTablasSelector()}

      <button className="btn-secundario-s" onClick={agregarOrganismo}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Organismo</p>
      </button>
    </div>
  )
};