import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalInformado } from '../componentes/PersonalInformado';
export const Sub1_b = ({data}) =>
{
  const {paso3_gore, 
    p3_personal_indirecto_sector,
    p3_personal_indirecto_gore
    }= data
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
          <CostoPersonal title="indirectos"
            plantaJustificado={paso3_gore?.sub21b_personal_planta_justificado}
            plantaJustificar={paso3_gore?.sub21b_personal_planta_justificar}
            contrataJustificado={paso3_gore?.sub21b_personal_contrata_justificado}
            contrataJustificar={paso3_gore?.sub21b_personal_contrata_justificar}
            otrasJustificado={paso3_gore?.sub21b_otras_remuneraciones_justificado}
            otrasJustificar={paso3_gore?.sub21b_otras_remuneraciones_justificar}
            gastoPersonalJustificado={paso3_gore?.sub21b_gastos_en_personal_justificado}
            gastosPersonalJustificar={paso3_gore?.sub21b_gastos_en_personal_justificar} />
            <PersonalInformado 
            personalSector={p3_personal_indirecto_sector}
            personalGore={p3_personal_indirecto_gore}
            title="indirecto"
            seccion="p_3_1_b_personal_indirecto"
            />
        </div>
      </div>
    </>
  );
};
