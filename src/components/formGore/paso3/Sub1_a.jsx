// import { useContext } from 'react';
// import { FormGOREContext } from '../../../context/FormGore';
import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalGore } from '../componentes/PersonalGore';

export const Sub1_a = ({data, solo_lectura}) => {

  const { paso3_gore, p3_personal_directo_sector , 
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
            solo_lectura={solo_lectura}
          />

          <PersonalGore
          personalSector={p3_personal_directo_sector}
          personalGore={p3_personal_directo_gore}
          estamentos={listado_estamentos}
          title="directo"
          campoDestino="descripcion_perfiles_tecnicos_directo"
          seccion="p_3_1_a_personal_directo"
          seccionGore3="paso3_gore"
          dataPersonal={directos}
          dataPaso={data}
          solo_lectura={solo_lectura}
          />

        </div>
      </div>
    </>
  );
};
