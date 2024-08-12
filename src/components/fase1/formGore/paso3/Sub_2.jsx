import { FichaInformatico } from "../componentes/FichaInformatico"
import { FisicoInfraestructura } from "../componentes/FisicoInfraestructura"
import { JustificarCostos } from "../componentes/JustificarCostos"
import { ResumenSubtitulos } from "../componentes/ResumenSubtitulos"
import { ResumenSubtitulosSistemasInformaticos } from "../componentes/ResumenSubtitulosSistemasInformaticos"

export const Sub_2 = ({ data, paso3, solo_lectura }) => {

  const {
    subtitulo_22_diferencia_sector,
    subtitulo_22_justificados_gore,
    subtitulo_22_por_justificar,
    subtitulo_29_diferencia_sector,
    subtitulo_29_justificados_gore,
    subtitulo_29_por_justificar,
    sub29_item07_diferencia_sector,
    sub29_item07_justificados_gore,
    sub29_item07_por_justificar
  } = paso3;

  const { p_3_2_recursos_comparados,
    p_3_2_a_sistemas_informaticos,
    p_3_2_b_recursos_fisicos_infraestructura,
    id_item_subtitulo_programas_informaticos
  } = data

  return (
    <>
      <div className="pe-5 me-5 mt-5 col-11">
        <span className="my-4 text-sans-h4">
          3.2 Estimación razonada de la capacidad administrativa de sistemas informáticos y recursos físicos del Gobierno Regional
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.
          </h6>
        </div>
        <div className="my-4 col-11">
          <JustificarCostos recursos={p_3_2_recursos_comparados} />
        </div>
        <div className="my-4 ">
          <FichaInformatico 
          idItem={id_item_subtitulo_programas_informaticos} 
          dataInformatico={p_3_2_a_sistemas_informaticos} 
          solo_lectura={solo_lectura} 
          />
        </div>
        <div className="my-4 ">
          <ResumenSubtitulosSistemasInformaticos
            nombreSubtitulo="Subtítulo 29"
            subDiferencia={sub29_item07_diferencia_sector}
            subJustificados={sub29_item07_justificados_gore}
            subJustificar={sub29_item07_por_justificar}
          />
        </div>
        <div className="my-4 ">
          <FisicoInfraestructura
            dataRecursosFisicos={p_3_2_b_recursos_fisicos_infraestructura}
            solo_lectura={solo_lectura}
          />
        </div>
        <div className="my-4 ">
          <ResumenSubtitulos
            nombreSubtitulo="Subtítulo 22"
            sub22Diferencia={subtitulo_22_diferencia_sector}
            sub22Justificados={subtitulo_22_justificados_gore}
            sub22Justificar={subtitulo_22_por_justificar}
            sub29Diferencia={subtitulo_29_diferencia_sector}
            sub29Justificados={subtitulo_29_justificados_gore}
            sub29Justificar={subtitulo_29_por_justificar}
          />
        </div>
      </div>
    </>
  )
}
