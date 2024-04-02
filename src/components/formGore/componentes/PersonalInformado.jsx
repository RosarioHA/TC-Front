import React, { useContext, useState, useMemo } from 'react';
import { OpcionesAB } from '../../forms/opciones_AB';
import { AgregarPersonal } from './AgregarPersonal';
import { FormGOREContext } from '../../../context/FormGore';

export const PersonalInformado = ({ personalSector, personalGore, title, seccion, estamentos, dataPersonal}) =>
{

  const { updatePasoGore } = useContext(FormGOREContext);
  const [ inputStatus, setInputStatus ] = useState({ utilizara_recurso: { loading: false, saved: false } });

  // Agrupar datos por calidad_juridica
  const datosAgrupadosPorCalidadJuridica = useMemo(() =>
  {
    // Ensure personalSector is an array before calling reduce
    if (!Array.isArray(personalSector))
    {
      return {};
    }

    return personalSector.reduce((acc, persona) =>
    {
      if (!acc[ persona.calidad_juridica ])
      {
        acc[ persona.calidad_juridica ] = [];
      }
      acc[ persona.calidad_juridica ].push(persona);
      return acc;
    }, {});
  }, [ personalSector ]);

  const handleUpdate = async (costoId, field, value, saveImmediately = false) =>
  {
    setInputStatus((prev) => ({
      ...prev,
      [ costoId ]: {
        ...prev[ costoId ],
        [ field ]: { value, loading: false, saved: false },
      },
    }));

    if (saveImmediately)
    {
      try
      {
        const payload = {
          [ seccion ]: [ {
            id: costoId,
            [ field ]: value,
          } ],
        };
        await updatePasoGore(payload);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ costoId ]: {
            ...prevStatus[ costoId ],
            [ field ]: { ...prevStatus[ costoId ][ field ], loading: false, saved: true },
          },
        }));
      } catch (error)
      {
        console.error('Error updating data', error);
        setInputStatus((prevStatus) => ({
          ...prevStatus,
          [ costoId ]: {
            ...prevStatus[ costoId ],
            [ field ]: { loading: false, saved: false },
          },
        }));
      }
    }
  };



  return (
    <>
      <div className="my-5 col-11">
        <span className="mt-3">Personal {title} informado por el sector:</span>
        {Object.entries(datosAgrupadosPorCalidadJuridica).map(([ calidadJuridica, personas ]) => (
          <React.Fragment key={calidadJuridica}>
            <div key={calidadJuridica}>
              <p className="my-4">
                <strong>Calidad Jurídica </strong>
                <span className="mx-2">{personas[ 0 ].nombre_calidad_juridica}</span>
              </p>
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Estamento</th>
                    <th>Renta bruta mensual</th>
                    <th>Grado <br />(Si corresponde)</th>
                    <th>Sector</th>
                    <th>Comisión <br /> de servicio</th>
                    <th>¿GORE <br /> utilizará este recurso?</th>
                  </tr>
                </thead>
                <tbody>
                  {personas.map((persona, index) => (
                    <tr key={persona.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{persona.nombre_estamento}</td>
                      <td>{persona.renta_bruta ? parseInt(persona.renta_bruta, 10).toLocaleString('es-CL') : "sin información"}</td>
                      <td className="text-center">{persona.grado || "-"}</td>
                      <td>{persona.sector_nombre}</td>
                      <td className="col-2 px-5">
                        <span className="text-sans-p-bold-blue">{persona.comision_servicio ? 'Sí' : 'No'}</span>
                      </td>
                      <td>
                        <OpcionesAB
                          id={`utilizara_recurso-${persona.id}`}
                          initialState={persona.utilizara_recurso}
                          handleEstadoChange={(value) => handleUpdate(persona.id, 'utilizara_recurso', value, true)}
                          loading={inputStatus[ persona.id ]?.utilizara_recurso?.loading}
                          saved={inputStatus[ persona.id ]?.utilizara_recurso?.saved}
                          altA="Si"
                          altB="No"
                          field="utilizara_recurso"
                          arrayNameId={persona.id}
                          fieldName="utilizara_recurso"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AgregarPersonal
              calidadJuridica={personas[ 0 ].nombre_calidad_juridica}
              estamentos={estamentos}
              seccion={seccion}
              idCalidad={calidadJuridica}
              personalGore={personalGore}
              dataPersonal={dataPersonal}
            />
          </React.Fragment>
        ))}
        <div>
        </div>
      </div>
    </>
  );
};
