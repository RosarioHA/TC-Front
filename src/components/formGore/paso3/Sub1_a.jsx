// import { useContext } from 'react';
// import { FormGOREContext } from '../../../context/FormGore';
import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalInformado } from '../componentes/PersonalInformado';

export const Sub1_a = ({data}) => {


  const { paso3_gore, p3_personal_directo_sector , 
    p3_personal_directo_gore
    } = data;

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
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
          <CostoPersonal
            title="directos"
            plantaJustificado={paso3_gore?.sub21_personal_planta_justificado}
            plantaJustificar={paso3_gore?.sub21_personal_planta_justificar}
            contrataJustificado={paso3_gore?.sub21_personal_contrata_justificado}
            contrataJustificar={paso3_gore?.sub21_personal_contrata_justificar}
            otrasJustificado={paso3_gore?.sub21_otras_remuneraciones_justificado}
            otrasJustificar={paso3_gore?.sub21_otras_remuneraciones_justificar}
            gastoPersonalJustificado={paso3_gore?.sub21_gastos_en_personal_justificado}
            gastosPersonalJustificar={paso3_gore?.sub21_gastos_en_personal_justificar}
          />

          <PersonalInformado 
          personalSector={p3_personal_directo_sector}
          personalGore={p3_personal_directo_gore}
          title="directo"
          seccion="p_3_1_a_personal_directo"
          />

        </div>
        <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
          <i className="material-symbols-rounded me-2">info</i>
          <h6 className="mt-0">
            Una vez definido el nimero de personas por estamento y calidad
            juridica para el ejercicio de la competencia, señale en el siguiente
            recuadro los perfiles técnicos requeridos.
          </h6>
        </div>
      </div>
    </>
  );
};
