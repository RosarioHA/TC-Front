import CustomInputArea from '../../forms/textarea_paso2';
import { CostoPersonal } from '../componentes/CostoPersonal';
import { PersonalInformado } from '../componentes/PersonalINformado';

export const Sub1_a = () => {
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
          <CostoPersonal title="directos" />
          <PersonalInformado />
        </div>
        <CustomInputArea
          label="Descripción de perfiles técnicos"
          placeholder="Describe los perfiles técnicos necesarios"
          name="descripcion_ejercicio_competencia"
          maxLength={1100}
        />
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
