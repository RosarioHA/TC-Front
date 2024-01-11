import { useState, useContext } from "react";
import TablaEncabezadoFijo from "../../tables/EncabezadoFijo";
import TablaEncabezadoSelector from "../../tables/EncabezadoSelector";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_dosPuntoUno = ({ id, data, lista, stepNumber }) => {

 //convertir estructura para el select
  const transformarEnOpciones = (datos) => {
    return Object.entries(datos).map(([value, label]) => ({ label, value }));
  };
  const opcionesDeSelector = transformarEnOpciones(lista);

  return (
    <div>
      <h4 className="text-sans-h4">2.1 Organismos intervinientes en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se debe describir brevemente, según corresponda, la esfera de atribuciones que posee cada organismo que cumpla un rol en el ejercicio de la competencia. Si las atribuciones de los organismos no están establecidas por ley, o el organismo no tiene un rol en el ejercicio de la competencia, la casilla de descripción debe quedar vacía. </h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate de identificar correctamente los organismos intervinientes, ya que esta información será utilizada más adelante en tu formulario.</h6>

      <div className="my-4">
        {data && data.length > 0 && (
          <TablaEncabezadoFijo
          id = {id} 
          data={data} 
          options={ opcionesDeSelector }
          stepNumber = {stepNumber}
          />
        )}
      </div>
    </div>
  )
};