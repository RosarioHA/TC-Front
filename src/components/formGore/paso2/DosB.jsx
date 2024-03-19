import { CostosIndirectosSector } from "../componentes/CostosIndirectos"
import { ResumenIndirectos } from "../componentes/ResumenIndirectos"
import { SubAdicionales } from "../componentes/SubAdicionales"
import { Subtitulo21 } from "../componentes/Subtitulo21"
export const DosB = ({ costosIndirectos , resumen, personalIndirecto}) =>
{
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          b. Costos indirectos
        </span>
        <div className="text-sans-h6-primary my-3 col-10">
          <h6>
            Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.
          </h6>
        </div>
        <div className="my-4 ">
          <CostosIndirectosSector costosIndirectos={costosIndirectos} />
        </div>
        <div>
          <Subtitulo21 personal={personalIndirecto} />
        </div>
        <div className="my-4">
          <SubAdicionales titulo="Subtítulos adicionales costos indirectos informados por GORE"
          />
        </div>
        <div className="my-4 ">
          <ResumenIndirectos resumen={resumen} />
        </div>
      </div>
    </>
  )
}
