import { useContext, useEffect, useCallback, useState } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { Sub_1 } from "../../components/formGore/paso3/Sub_1";
import { Sub_2 } from "../../components/formGore/paso3/Sub_2";
import { ResumenDiferencial } from "../../components/formGore/componentes/ResumenDiferencial";
import CustomTextarea from "../../components/forms/custom_textarea";
import { useObservacionesGORE } from "../../hooks/fomularioGore/useObSubdereGore";
import { useAuth } from '../../context/AuthContext';

const PasoTresGore = () =>
{
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 3;
  const { userData } = useAuth();
  const { observaciones, loadingObservaciones, updateObservacion, fetchObservaciones, saved } = useObservacionesGORE(dataFormGore ? dataFormGore.id : null);
  const [ observacionPaso3, setObservacionPaso3 ] = useState("");
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const formularioEnviado = dataFormGore?.formulario_enviado
  const observacionesEnviadas = observaciones?.observacion_enviada;
  const solo_lectura = dataPasoGore?.solo_lectura;

  const handleUpdateStepNumber = useCallback(() =>
  {
    const stepNumber = 3;
    updateStepNumber(stepNumber);
  }, [ updateStepNumber ]);

  useEffect(() =>
  {
    handleUpdateStepNumber();
  }, [ handleUpdateStepNumber ]);

  useEffect(() =>
  {
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso3)
    {
      setObservacionPaso3(observaciones.observacion_paso3);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones ]);

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore?.paso3_gore) return <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando paso 3</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>
  const { paso3_gore = {} } = dataPasoGore;


  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        observacion_paso3: observacionPaso3,
      };
      await updateObservacion(observacionData);
    }
  };

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={stepNumber} />
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3_gore.nombre_paso}</h3>
            <Avance avance={paso3_gore.avance} />
          </div>
          <Sub_1 data={dataPasoGore} solo_lectura={solo_lectura} />
          <Sub_2 data={dataPasoGore} paso3={paso3_gore} solo_lectura={solo_lectura} />
          <ResumenDiferencial
            informada={paso3_gore.costos_informados_gore}
            justificados={paso3_gore.costos_justificados_gore}
            justificar={paso3_gore.costos_justificar_gore}
          />

          {formularioEnviado && userSubdere && (
            <div className="mt-5 my-4 border-top pt-5">
              {!observacionPaso3.trim() && observacionesEnviadas ? (
                <p>No se han dejado observaciones en este paso.</p>
              ) : (
                <CustomTextarea
                  label="Observaciones (Opcional)"
                  placeholder="Escribe tus observaciones de este paso del formulario"
                  rows={5}
                  maxLength={500}
                  value={observacionPaso3}
                  onChange={(e) => setObservacionPaso3(e.target.value)}
                  readOnly={observacionesEnviadas}
                  onBlur={handleGuardarObservacion}
                  loading={loadingObservaciones}
                  saved={saved}
                />
              )}
            </div>
          )}

          <NavigationGore step={stepNumber} id={dataFormGore ? dataFormGore.id : null} />
        </div>
      </div>
    </>
  )
}

export default PasoTresGore; 