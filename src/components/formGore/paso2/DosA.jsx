import { CostosDirectosSector } from "../componentes/CostosDirectosSector"
import { ResumenDirectos } from "../componentes/ResumenDirectos"
import { SubAdicionales } from "../componentes/SubAdicionales"
import { Subtitulo21 } from "../componentes/Subtitulo21"

export const DosA = ({ costosDirecSectorGet, id, resumen }) =>
{



  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          a. Costos directos
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.
          </h6>
          <h6>
            Se debe informar si el costo informado es transitorio o no. Un costo transitorio es aquel que es efectivo solo durante el tiempo de traspaso de la competencia, mientras que un costo no transitorio es aquel que se sostiene de manera permanente.
          </h6>
        </div>
        <div className="my-4">
          <CostosDirectosSector
            costoDirectosGet={costosDirecSectorGet}
            id={id}
          />
        </div>
        <div className="my-4 ">
          <Subtitulo21 />
        </div>
        <div className="my-4 ">
          <SubAdicionales  titulo="Subtítulos adicionales costos directos informados por GORE" />
        </div>
        <div className="my-4 ">
          <ResumenDirectos resumen={resumen} />
        </div>
      </div>
    </>
  )
}
