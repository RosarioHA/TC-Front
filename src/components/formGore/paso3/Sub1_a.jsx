// import { useContext } from 'react';
// import { FormGOREContext } from '../../../context/FormGore';
import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalGore } from '../componentes/PersonalGore';
import { PersonalInformadoSector } from '../componentes/PersonalInformadoSector';


export const Sub1_a = ({ data, solo_lectura }) => {

  const {
    paso3_gore,
    p3_personal_directo_sector,
    p3_personal_directo_gore,
    listado_estamentos
  } = data;

  let directos = {};

  // Separación de los datos
  for (let key in paso3_gore) {
    if (key.startsWith("sub21_")) {
      directos[key] = paso3_gore[key];
    }
  }


  return (
    <>
      <div className="pe-xxl-5 me-xxl-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          a. Personal que ejerce directamente la competencia
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            En los siguientes cuadros, y a partir de la información provista por
            el Ministerio o Servicio de origen, se deberá consignar el personal
            requerido para el ejercicio directo de la competencia.
          </h6>
        </div>
        <div>
          <PersonalInformadoSector
            personalSector={p3_personal_directo_sector}
            title="directo"
            seccion="p_3_1_a_personal_directo"
            solo_lectura={solo_lectura}
          />

          <CostoPersonal
            title="directos"
            plantaInformado={paso3_gore?.sub21_total_personal_planta}
            plantaJustificar={paso3_gore?.sub21_personal_planta_justificar}
            contrataInformado={paso3_gore?.sub21_total_personal_contrata}
            contrataJustificar={paso3_gore?.sub21_personal_contrata_justificar}
            otrasInformado={paso3_gore?.sub21_total_otras_remuneraciones}
            otrasJustificar={paso3_gore?.sub21_otras_remuneraciones_justificar}
            gastoPersonalInformado={paso3_gore?.sub21_total_gastos_en_personal}
            gastosPersonalJustificar={paso3_gore?.sub21_gastos_en_personal_justificar}
            solo_lectura={solo_lectura}
          />

          <PersonalGore
            personalGore={p3_personal_directo_gore}
            estamentos={listado_estamentos}
            title="directo"
            seccion="p_3_1_a_personal_directo"
            dataPersonal={directos}
            solo_lectura={solo_lectura}
          />
        </div>
      </div>
    </>
  );
};
