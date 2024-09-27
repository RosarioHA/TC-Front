import React, { useMemo } from 'react';
import { AgregarPersonal } from './AgregarPersonal';

export const PersonalInformado = ({
  personalGore,
  title,
  seccion,
  estamentos,
  dataPersonal,
  solo_lectura,
  prefix
}) => {

  const datosAgrupadosPorCalidadJuridica = useMemo(() => {
    if (!Array.isArray(personalGore)) {
      return {};
    }
    return personalGore.reduce((acc, persona) => {
      if (!acc[persona.calidad_juridica]) {
        acc[persona.calidad_juridica] = [];
      }
      acc[persona.calidad_juridica].push(persona);
      return acc;
    }, {});
  }, [personalGore]);


  return (
    <>
      <div className="my-4 col-11">
        <form>
          {Object.entries(datosAgrupadosPorCalidadJuridica).map(
            ([calidadJuridica, personas]) => (
              <React.Fragment key={calidadJuridica}>
                <div key={calidadJuridica}>
                  <p className="ps-4 my-4 subrayado">
                    <strong>Calidad Jurídica </strong>
                    <span className="mx-2">
                      {personas[0].nombre_calidad_juridica}
                    </span>
                  </p>
                  <p className='text-sans-h6-primary col-11'>Si requieres de personal adicional puedes agregarlos:</p>
                </div>
                <AgregarPersonal
                  calidadJuridica={personas[0].nombre_calidad_juridica}
                  estamentos={estamentos}
                  seccion={seccion}
                  idCalidad={calidadJuridica}
                  personalGore={personalGore}
                  dataPersonal={dataPersonal}
                  title={title}
                  solo_lectura={solo_lectura}
                  prefix={prefix}
                />
              </React.Fragment>
            )
          )}
        </form>
      </div>
    </>
  );
};
