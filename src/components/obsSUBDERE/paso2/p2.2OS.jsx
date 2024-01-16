//import TablaEncabezadoSelector from "../../tables/EncabezadoSelector";
import TablaEncabezadoFijo from "../../tables/EncabezadoFijo";

export const Subpaso_dosPuntoDosOS = () => {
  return(
    <div className="">
      <h4 className="text-sans-h4">2.2 Unidades intervinientes en el Ministerio o Servicio</h4>
      <h6 className="text-sans-h6-primary">Se entenderá por Unidad Interviniente a aquellos actores al interior de la orgánica sectorial que intervienen en el ejercicio de la competencia analizada.</h6> 
      <h6 className="text-sans-h6-primary mt-3">  Asegúrate de identificar correctamente las unidades de cada organismo que participan en el ejercicio de la competencia, ya que esta información será utilizada más adelante en tu formulario.</h6>
        
      <div className="row">
        <div className="col-2 border">
          <p className="text-sans-p-bold">Ministerios o Servicios Públicos</p>
        </div>

        <div className="col-10 border">
          {/* Se deben generar dinamicamente segun la informacion del paso 2.1 */}
          <div className="row">
            <TablaEncabezadoFijo
            readOnly={true}
            encabezado="encabezado1"
            title="$Primer Sector" />
          </div>
          <div className="row">
            <TablaEncabezadoFijo
            readOnly={true}
            encabezado="encabezado2"
            title="$Segundo Sector" />
          </div>
        </div>
      </div>

    </div>
  )
};