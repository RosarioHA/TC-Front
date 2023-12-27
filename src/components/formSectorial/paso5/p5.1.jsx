
import Costos from "../../tables/Costos";
import SumatoriaCostos from "../../tables/SumatoriaCostos";

export const Subpaso_CincoPuntoUno = () =>
{

  return (
    <div className="mt-4 me-5 pe-5">
      <h4 className="text-sans-h4">5.1 Costos asociados al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">Para realizar un correcto costeo de la competencia, se toman como bases las etapas descritas y diagramadas en el paso 2. A partir de estas etapas, se deben completar las siguientes tablas de costos por subtitulo.</h6>

      <p className="text-sans-m-semibold mt-4">a. Costos directos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      <div >
        <Costos />
        <hr />
      </div>

      <div className="row mt-5">
        <p className="text-sans-p-bold mb-0 col-2">Costos Directos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">(sumResult)</p>
      </div>
      <hr />

      <p className="text-sans-m-semibold mt-4">b. Costos indirectos</p>
      <h6 className="text-sans-h6-primary mt-3">Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.</h6>
      <h6 className="text-sans-h6-primary mt-3">Llenar información para al menos un subtítulo/item es obligatorio.</h6>

      <div>
        <Costos />
        <hr />
      </div>

      <div className="row mt-5">
        <p className="text-sans-p-bold mb-0 col-2">Costos Directos <br /> Totales Anual ($M)</p>
        <p className="text-sans-p-blue col">(sumResult)</p>
      </div>
      <hr />

      <p className="text-sans-m-semibold mt-4">c. Sumatoria de costos anuales destinados al ejercicio de la competencia</p>

      <div>
        <SumatoriaCostos
          numFilas={5} />
      </div>

    </div>
  )
};
