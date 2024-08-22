import { FichaInformatico } from "../componentes/FichaInformatico";
import { FisicoInfraestructura } from "../componentes/FisicoInfraestructura";
import { JustificarCostos } from "../componentes/JustificarCostos";
import { ResumenSubtitulos } from "../componentes/ResumenSubtitulos";
import { ResumenSubtitulosSistemasInformaticos } from "../componentes/ResumenSubtitulosSistemasInformaticos";

export const Sub_2_a = ({
  titulo_costo,
  sufijo_costos,
  nombre_costo,
  recursos_comparados,
  idItem,
  dataInformatico,
  nombreSubtitulo,
  subDiferencia,
  subJustificados,
  subJustificar,
  dataRecursosFisicos,
  solo_lectura,
  sub22Diferencia,
  sub22Justificados,
  sub22Justificar,
  sub29Diferencia,
  sub29Justificados,
  sub29Justificar
}) => {

  return (
    <>
      <span className="my-4 text-sans-h4">
        {`${titulo_costo} `}
      </span>
      {(!recursos_comparados || recursos_comparados.length === 0) ? (         
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              No se presentaron presupuestos por parte del sector y/o GORE para subtítulo 22 y/o 29 en costos {`${nombre_costo}`}.
            </h6>
          </div>
      ) : (
        <>
          <div className="my-4 col-11">
            <JustificarCostos recursos={recursos_comparados} />
          </div>
          {(!dataInformatico || dataInformatico.length === 0) ? (
            <div className="pe-5 me-5 mt-5 col-12">
              <span className="my-4 text-sans-h4">
                a. Ficha de sistemas informáticos {`${sufijo_costos} `}
              </span>
              <div className="text-sans-h6-primary my-3 col-11">
                <h6>
                  No se presentaron presupuestos por parte del sector y/o GORE para subtítulo 29, Ítem 07 - Programas Informáticos en costos {`${nombre_costo}`}.
                </h6>
              </div>
            </div>
          ) : (
            <div className="my-4 ">
              <FichaInformatico
                idItem={idItem}
                sufijo_costos={sufijo_costos}
                dataInformatico={dataInformatico}
                solo_lectura={solo_lectura}
                nombre_costo={nombre_costo}
              />
              <ResumenSubtitulosSistemasInformaticos
                nombreSubtitulo={nombreSubtitulo}
                subDiferencia={subDiferencia}
                subJustificados={subJustificados}
                subJustificar={subJustificar}
              />
            </div>
          )}
          {(!dataRecursosFisicos || dataRecursosFisicos.length === 0) ? (
            <div className="pe-5 me-5 mt-5 col-12">
              <span className="my-4 text-sans-h4">
                b. Recursos físicos e infraestructura {`${sufijo_costos} `}
              </span>
              <div className="text-sans-h6-primary my-3 col-11">
                <h6>
                  No se presentaron presupuestos por parte del sector y/o GORE para subtítulo 22 y/o 29 en costos {`${nombre_costo}`}.
                </h6>
              </div>
            </div>
          ) : (
            <>
              <div className="my-4 ">
                <FisicoInfraestructura
                  sufijo_costos={sufijo_costos}
                  dataRecursosFisicos={dataRecursosFisicos}
                  solo_lectura={solo_lectura}
                />
              </div>
              <div className="my-4 ">
                <ResumenSubtitulos
                  nombreSubtitulo="Subtítulo 22"
                  sufijo_costos={sufijo_costos}
                  sub22Diferencia={sub22Diferencia}
                  sub22Justificados={sub22Justificados}
                  sub22Justificar={sub22Justificar}
                  sub29Diferencia={sub29Diferencia}
                  sub29Justificados={sub29Justificados}
                  sub29Justificar={sub29Justificar}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
