import { FichaInformatico } from "../componentes/FichaInformatico"
import { FisicoInfraestructura } from "../componentes/FisicoInfraestructura"
import { JustificarCostos } from "../componentes/JustificarCostos"
import { ResumenSubtitulos } from "../componentes/ResumenSubtitulos"
import { ResumenSubtitulosSistemasInformaticos } from "../componentes/ResumenSubtitulosSistemasInformaticos"

export const Sub_2_a = ({
  titulo_costo,
  sufijo_costos,
  recursos_comparados,
  idItem,
  dataInformatico,
  nombreSubtitulo,
  subDiferencia,
  subJustificados,
  subJustificar,
  dataRecursosFisicos,
  solo_lectura
}) => {

  return (
    <>
        <span className="my-4 text-sans-h4">
        {`${titulo_costo} `}
        </span>
        <div className="my-4 col-11">
          <JustificarCostos recursos={recursos_comparados} />
        </div>
        <div className="my-4 ">
          <FichaInformatico 
          idItem={idItem}
          sufijo_costos={sufijo_costos}
          dataInformatico={dataInformatico} 
          solo_lectura={solo_lectura} 
          />
        </div>
        <div className="my-4 ">
          <ResumenSubtitulosSistemasInformaticos
            nombreSubtitulo={nombreSubtitulo}
            subDiferencia={subDiferencia}
            subJustificados={subJustificados}
            subJustificar={subJustificar}
          />
        </div>
        <div className="my-4 ">
          <FisicoInfraestructura
            sufijo_costos={sufijo_costos}
            dataRecursosFisicos={dataRecursosFisicos}
            solo_lectura={solo_lectura}
          />
        </div>
    </>
  )
}
