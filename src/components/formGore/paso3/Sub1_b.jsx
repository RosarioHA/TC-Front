import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalGore } from '../componentes/PersonalGore';

export const Sub1_b = ({ data, solo_lectura }) => {
  const { paso3_gore,
    p3_personal_indirecto_gore,
    listado_estamentos,
    listado_calidades_juridicas_indirectas
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
      <div className="pe-xxl-5 me-xxl-5 mt-4 col-12">
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
            plantaInformado={paso3_gore?.sub21b_personal_planta_justificado}
            plantaJustificar={paso3_gore?.sub21b_personal_planta_justificar}
            contrataInformado={paso3_gore?.sub21b_personal_contrata_justificado}
            contrataJustificar={paso3_gore?.sub21b_personal_contrata_justificar}
            otrasInformado={paso3_gore?.sub21b_otras_remuneraciones_justificado}
            otrasJustificar={paso3_gore?.sub21b_otras_remuneraciones_justificar}
            gastoPersonalInformado={paso3_gore?.sub21b_gastos_en_personal_justificado}
            gastosPersonalJustificar={paso3_gore?.sub21b_gastos_en_personal_justificar} 
          />
          <PersonalGore
            personalGore={p3_personal_indirecto_gore}
            estamentos={listado_estamentos}
            listado_calidades_disponibles={listado_calidades_juridicas_indirectas}
            title="indirecto"
            seccion="p_3_1_b_personal_indirecto"
            prefix={"sub21b"}
            dataPersonal={indirectos}
            seccionGore3={paso3_gore}
            solo_lectura={solo_lectura} 
          />
        </div>
      </div>
    </>
  );
};
