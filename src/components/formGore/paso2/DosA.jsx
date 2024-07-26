import { CostosSector } from "../componentes/CostosSector"
import { ResumenIndirectos } from "../componentes/ResumenIndirectos"
import { ResumenDirectos } from "../componentes/ResumenDirectos"
import { SubAdicionales } from "../componentes/SubAdicionales"
import { Subtitulo21 } from "../componentes/Subtitulo21"

export const CostosGORE = ({ 
  costosSectorGet, 
  id, 
  resumen, 
  Personal, 
  data, 
  costosGore, 
  solo_lectura,
  glosa,
  titulo,
  nombreModelo,
  seccion

}) => {

  const formatGlosa = (text) => {
    return text.split('\n').map((line, index) => (
      <h6 key={index}>{line}</h6>
    ));
  };

  const ResumenComponente = nombreModelo === 'directos' ? ResumenDirectos : ResumenIndirectos;

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
        {titulo}
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
        <h6>{formatGlosa(glosa)}</h6> 
        </div>
        <div className="my-4">
          <CostosSector
            costoSectorGet={costosSectorGet}
            id={id}
            solo_lectura={solo_lectura}
            seccion={seccion}
          />
        </div>
        <div className="my-4 ">
          <Subtitulo21
            personal={Personal} 
            solo_lectura={solo_lectura}
          />
        </div>
        <div className="my-4 ">
          <SubAdicionales
            titulo={`Subtítulos adicionales costos ${nombreModelo} informados por GORE`}
            etapas={data.listado_etapas}
            itemSub={data[`listado_item_subtitulos_${nombreModelo}`]}
            subtitulos={data[`listado_subtitulos_${nombreModelo}`]}
            seccion= {seccion}
            data={costosGore}
            solo_lectura={solo_lectura}
          />
        </div>
        <div className="my-4 ">
          <ResumenComponente resumen={resumen} />
        </div>
      </div>
    </>
  )
}
