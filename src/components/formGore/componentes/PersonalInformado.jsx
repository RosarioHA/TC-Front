import { OpcionesAB } from '../../forms/opciones_AB';
// import { AgregarPersonal } from './AgregarPersonal';
import { useContext, useState } from 'react';
import { FormGOREContext } from '../../../context/FormGore';

export const PersonalInformado = ({ personalSector, title, seccion }) =>
{

  const { updatePasoGore } = useContext(FormGOREContext);
  const [ inputStatus, setInputStatus ] = useState({ utilizara_recurso: { loading: false, saved: false } });

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
        <span>Personal {title} informado por el sector:</span>
        <p className="my-2">
          <strong>Calidad Jurídica </strong>
          <span className="mx-2">Planta</span>
        </p>
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col-2">#</th>
              <th scope="col-3">Estamento</th>
              <th scope="col-4">
                Renta bruta <br /> mensual
              </th>
              <th scope="col-1">
                Grado <br /> (Si corresponde)
              </th>
              <th scope="col-3">Sector</th>
              <th scope="col-1">
                Comisión <br />
                de servicio
              </th>
              <th scope="col-1">
                ¿GORE <br />
                utilizará este <br />
                recurso?
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(personalSector) && personalSector
              .filter(persona => persona.calidad_juridica === 1)
              .map((persona, index) => (
                <tr key={persona.id}>
                  <th scope="row">{index + 1}</th>
                  <td className="col-2">{persona.nombre_estamento}</td>
                  <td className="col-4 mx-2">
                    <div className="border-gris col-10 py-2 px-3">{persona.renta_bruta || "sin información"}</div>
                  </td>
                  <td className="col-2">
                    <div className="border-gris col-6 py-2 px-3 text-center">{persona.grado || "-"}</div>
                  </td>
                  <td className="col-2">
                    <span>
                      {persona.sector_nombre}
                    </span>
                  </td>
                  <td className="col-2 px-5">
                    <span className="text-sans-p-bold-blue">{persona.comision_servicio ? 'Sí' : 'No'}</span>
                  </td>
                  <td className="col-2 pe-3">
                    <OpcionesAB
                      id={`utilizara_recurso-${persona.id}`}
                      initialState={persona.utilizara_recurso}
                      handleEstadoChange={(value) =>
                        handleUpdate(persona.id, 'utilizara_recurso', value, true)
                      }
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
        {/* <AgregarPersonal />  */}
        <div>
        </div>
      </div>
    </>
  );
};
2