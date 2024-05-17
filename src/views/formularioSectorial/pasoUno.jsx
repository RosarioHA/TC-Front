import { useContext, useEffect, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno } from '../../components/formSectorial/paso1/p1.1';
import { Subpaso_dos } from '../../components/formSectorial/paso1/p1.2';
import { Subpaso_tres } from '../../components/formSectorial/paso1/p1.3';
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from '../../components/stepers/MonoStepers';
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoUno = () =>
{
  const { pasoData, errorPaso, updateStepNumber, data } = useContext(FormularioContext);
  const stepNumber = 1;
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userSectorial = userData?.perfil?.includes('Sectorial');
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [ observacionPaso1, setObservacionPaso1 ] = useState("");

  const observacionesEnviadas = observaciones?.observacion_enviada
  const formSectorialEnviado = data?.formulario_enviado

  useEffect(() =>
  {
    updateStepNumber(1);

    // Carga inicial de observaciones
    if (data?.id)
    {
      fetchObservaciones();
    }
  }, [ data?.id, fetchObservaciones, updateStepNumber ]);

  // Seguimiento de cambios en las observaciones para actualizar el estado local
  useEffect(() =>
  {
    if (observaciones?.observacion_paso1)
    {
      setObservacionPaso1(observaciones.observacion_paso1);
    }
  }, [ observaciones?.observacion_paso1 ]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <> <div className="d-flex align-items-center flex-column my-5 px-5 ">
    <div className="text-center text-sans-h5-medium-blue">Cargando paso 1</div>
    <span className="placeholder col-6 bg-primary"></span>
  </div></>;

  const {
    marcojuridico,
    organigramaregional,
    solo_lectura,
    paso1 } = pasoData;
  const paso1Data = paso1 || {};

  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        id: observaciones?.id,  // Asumiendo que 'observaciones' es un estado que contiene el 'id' sectorial
        observacion_paso1: observacionPaso1
      };

      await updateObservacion(observacionData);
    }
  };

  const avance = pasoData?.paso1?.avance;

  return (
    <>
      <div className="col-1">
        {paso1Data.numero_paso && <MonoStepers stepNumber={paso1Data.numero_paso} />}
      </div>
      <div className="col-11">
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1Data.nombre_paso}</h3>
            <Avance avance={avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_uno dataPaso={paso1Data} marcojuridico={marcojuridico} id={data ? data.id : null} stepNumber={stepNumber} solo_lectura={solo_lectura} />
          <Subpaso_dos pasoData={paso1Data} organigrama={organigramaregional} id={data ? data.id : null} stepNumber={stepNumber} solo_lectura={solo_lectura} />
          <Subpaso_tres pasoData={paso1Data} id={data ? data.id : null} stepNumber={stepNumber} solo_lectura={solo_lectura} />

          { (userSubdere || (userSectorial && formSectorialEnviado)) && (
            <div className="mt-5 my-4">
              {!observacionPaso1.trim() && observacionesEnviadas ? (
                <p>No se han dejado observaciones en este paso.</p>
              ) : (
                <CustomTextarea
                  label="Observaciones (Opcional)"
                  placeholder="Escribe tus observaciones de este paso del formulario"
                  rows={5}
                  maxLength={500}
                  value={observacionPaso1}
                  onChange={(e) => setObservacionPaso1(e.target.value)}
                  readOnly={observacionesEnviadas}
                  onBlur={handleGuardarObservacion}
                  loading={loadingObservaciones}
                  saved={saved}
                />
              )}
            </div>
          )}

          <ButtonsNavigate step={paso1Data.numero_paso} id={data ? data.id : null} />
        </div>
      </div>
    </>
  );
};

export default PasoUno;