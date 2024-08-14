import { ResumenSubtitulos } from "../componentes/ResumenSubtitulos"
import { Sub_2_a } from "./Sub_2_a"

export const Sub_2 = ({ data, paso3, solo_lectura }) => {

  const {
    subtitulo_22_diferencia_sector,
    subtitulo_22_justificados_gore,
    subtitulo_22_por_justificar,
    sub22_diferencia_sector_directo,
    sub22_justificados_gore_directo,
    sub22_por_justificar_directo,
    sub22_diferencia_sector_indirecto,
    sub22_justificados_gore_indirecto,
    sub22_por_justificar_indirecto,

    subtitulo_29_diferencia_sector,
    subtitulo_29_justificados_gore,
    subtitulo_29_por_justificar,
    sub29_diferencia_sector_directo,
    sub29_justificados_gore_directo,
    sub29_por_justificar_directo,
    sub29_diferencia_sector_indirecto,
    sub29_justificados_gore_indirecto,
    sub29_por_justificar_indirecto,

    sub29_item07_diferencia_sector_directo,
    sub29_item07_justificados_gore_directo,
    sub29_item07_por_justificar_directo,
    sub29_item07_diferencia_sector_indirecto,
    sub29_item07_justificados_gore_indirecto,
    sub29_item07_por_justificar_indirecto
  } = paso3;

  const {
    p_3_2_recursos_comparados,
    recursos_comparados_directos,
    recursos_comparados_indirectos,
    sistemas_informaticos_directos,
    sistemas_informaticos_indirectos,
    rec_fis_infra_directos,
    rec_fis_infra_indirectos,
    id_item_subtitulo_programas_informaticos
  } = data

  return (
    <>
      <div className="pe-5 me-5 mt-5 col-11">
        <span className="my-4 text-sans-h4">
          3.2 Estimación razonada de la capacidad administrativa de sistemas informáticos y recursos físicos del Gobierno Regional
        </span>
        {(!p_3_2_recursos_comparados || p_3_2_recursos_comparados.length === 0) ? (
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              No se presentaron presupuestos por parte del sector y/o GORE para subtítulo 22 y/o 29.
            </h6>
          </div>
        ) : (
          <>
            <div className="text-sans-h6-primary my-3 col-11">
              <h6>
                El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.
              </h6>
            </div>

            <div className="my-4 col-12">
              <Sub_2_a
                titulo_costo="3.2.a Costos directos"
                sufijo_costos="(costos directos)"
                nombre_costo="directos"
                recursos_comparados={recursos_comparados_directos}
                idItem={id_item_subtitulo_programas_informaticos}
                dataInformatico={sistemas_informaticos_directos}
                nombreSubtitulo="Subtítulo 29"
                subDiferencia={sub29_item07_diferencia_sector_directo}
                subJustificados={sub29_item07_justificados_gore_directo}
                subJustificar={sub29_item07_por_justificar_directo}
                dataRecursosFisicos={rec_fis_infra_directos}
                solo_lectura={solo_lectura}
                sub22Diferencia={sub22_diferencia_sector_directo}
                sub22Justificados={sub22_justificados_gore_directo}
                sub22Justificar={sub22_por_justificar_directo}
                sub29Diferencia={sub29_diferencia_sector_directo}
                sub29Justificados={sub29_justificados_gore_directo}
                sub29Justificar={sub29_por_justificar_directo}
              />
            </div>

            <div className="my-4 col-12">
              <Sub_2_a
                titulo_costo="3.2.b Costos indirectos"
                sufijo_costos="(costos indirectos)"
                nombre_costo="indirectos"
                recursos_comparados={recursos_comparados_indirectos}
                idItem={id_item_subtitulo_programas_informaticos}
                dataInformatico={sistemas_informaticos_indirectos}
                nombreSubtitulo="Subtítulo 29"
                subDiferencia={sub29_item07_diferencia_sector_indirecto}
                subJustificados={sub29_item07_justificados_gore_indirecto}
                subJustificar={sub29_item07_por_justificar_indirecto}
                dataRecursosFisicos={rec_fis_infra_indirectos}
                solo_lectura={solo_lectura}
                sub22Diferencia={sub22_diferencia_sector_indirecto}
                sub22Justificados={sub22_justificados_gore_indirecto}
                sub22Justificar={sub22_por_justificar_indirecto}
                sub29Diferencia={sub29_diferencia_sector_indirecto}
                sub29Justificados={sub29_justificados_gore_indirecto}
                sub29Justificar={sub29_por_justificar_indirecto}
              />
            </div>

            <span><br /><br /></span>

            <span className="my-4 text-sans-h4">
              Resumen estimación razonada de la capacidad administrativa
            </span>
            <div className="my-4">
              <ResumenSubtitulos
                nombreSubtitulo="Subtítulo 22"
                sufijo_costos=""
                sub22Diferencia={subtitulo_22_diferencia_sector}
                sub22Justificados={subtitulo_22_justificados_gore}
                sub22Justificar={subtitulo_22_por_justificar}
                sub29Diferencia={subtitulo_29_diferencia_sector}
                sub29Justificados={subtitulo_29_justificados_gore}
                sub29Justificar={subtitulo_29_por_justificar}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}