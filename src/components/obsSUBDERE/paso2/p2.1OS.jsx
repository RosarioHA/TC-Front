import TablaEncabezadoFijo from "../../tables/EncabezadoFijo";

export const Subpaso_dosPuntoUnoOS = () =>{

  return (
    <div>
      <h4 className="text-sans-h4">2.1 Organismos intervinientes en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se debe describir brevemente, según corresponda, la esfera de atribuciones que posee cada organismo que cumpla un rol en el ejercicio de la competencia. Si las atribuciones de los organismos no están establecidas por ley, o el organismo no tiene un rol en el ejercicio de la competencia, la casilla de descripción debe quedar vacía. </h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate de identificar correctamente los organismos intervinientes, ya que esta información será utilizada más adelante en tu formulario.</h6>
      
      {/* debe generar dinamicamente una tabla por cada organismo intervinente del backend, encabezado tb deberia ser dinamico */}
      <div className="my-4">
        <TablaEncabezadoFijo 
        encabezado="Ministerio o Servicio Público"
        readOnly={true}/>
      </div>
    </div>
  )
};