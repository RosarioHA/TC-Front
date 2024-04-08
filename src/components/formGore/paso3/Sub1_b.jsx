import { CostoPersonal } from '../componentes/CostoPersonal';
import { Personal } from '../componentes/Personal';

export const Sub1_b = ({ data, solo_lectura }) => {
  const { paso3_gore,
    p3_personal_indirecto_sector,
    p3_personal_indirecto_gore,
    listado_estamentos
  } = data
  
  let indirectos = {};
    
  // Separación de los datos
  for (let key in paso3_gore) {
    if (key.startsWith("sub21b_")) {
      indirectos[key] = paso3_gore[key];
    }
  }

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          b. Personal transversal o de soporte
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            En los siguientes cuadros, y a partir de la información provista por
            el Ministerio o Servicio de origen, se deberá consignar el personal
            requerido para el ejercicio directo de la competencia.
          </h6>
        </div>
        <div>
          <CostoPersonal 
            title="indirectos"
            plantaJustificado={paso3_gore?.sub21b_personal_planta_justificado}
            plantaJustificar={paso3_gore?.sub21b_personal_planta_justificar}
            contrataJustificado={paso3_gore?.sub21b_personal_contrata_justificado}
            contrataJustificar={paso3_gore?.sub21b_personal_contrata_justificar}
            otrasJustificado={paso3_gore?.sub21b_otras_remuneraciones_justificado}
            otrasJustificar={paso3_gore?.sub21b_otras_remuneraciones_justificar}
            gastoPersonalJustificado={paso3_gore?.sub21b_gastos_en_personal_justificado}
            gastosPersonalJustificar={paso3_gore?.sub21b_gastos_en_personal_justificar} 
          />
          <Personal
            personalSector={p3_personal_indirecto_sector}
            personalGore={p3_personal_indirecto_gore}
            estamentos={listado_estamentos}
            title="indirecto"
            campoDestino="descripcion_perfiles_tecnicos_indirecto"
            seccion="p_3_1_b_personal_indirecto"
            seccionGore3="paso3_gore"
            dataPersonal={indirectos}
            dataPaso={data}
            solo_lectura={solo_lectura} 
          />
        </div>
      </div>
    </>
  );
};
