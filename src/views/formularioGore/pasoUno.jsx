import { useContext, useEffect, useCallback, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { SubUno_Uno } from "../../components/formGore/paso1/sub1.1";
import { SubUno_dos } from "../../components/formGore/paso1/sub1.2";
import { SubUno_Tres } from "../../components/formGore/paso1/sub1.3";
import CustomTextarea from "../../components/forms/custom_textarea";
import { useObservacionesGORE } from "../../hooks/fomularioGore/useObSubdereGore";
import { useAuth } from '../../context/AuthContext';

const PasoUnoGore = () =>
{
  const { mostrarInput } = useOutletContext();
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 1;
  const { userData } = useAuth();
  const { observaciones, loadingObservaciones, updateObservacion, fetchObservaciones, saved } = useObservacionesGORE(dataFormGore ? dataFormGore.id : null);
  const [ observacionPaso1, setObservacionPaso1 ] = useState("");
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const solo_lectura = dataPasoGore?.solo_lectura;
  const formularioEnviado = dataFormGore?.formulario_enviado
  const observacionesEnviadas = observaciones?.observacion_enviada;

  const handleUpdateStepNumber = useCallback(() =>
  {
    const stepNumber = 1;
    updateStepNumber(stepNumber);
  }, [ updateStepNumber ]);

  useEffect(() =>
  {
    handleUpdateStepNumber();
  }, [ handleUpdateStepNumber ]);

  useEffect(() =>
    {
      updateStepNumber(1);
      if (dataFormGore?.id)
      {
        fetchObservaciones();
      }
    }, [ dataFormGore?.id, fetchObservaciones, updateStepNumber ]);
  
    // Seguimiento de cambios en las observaciones para actualizar el estado local
    useEffect(() =>
    {
      if (observaciones?.observacion_paso1)
      {
        setObservacionPaso1(observaciones?.observacion_paso1);
      }
    }, [ observaciones?.observacion_paso1 ]);


  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore?.paso1_gore) return
  <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando paso 1</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { paso1_gore = {}, flujograma_ejercicio_competencia } = dataPasoGore;

  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        observacion_paso1: observacionPaso1,
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
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1_gore.nombre_paso}</h3>
            <Avance avance={paso1_gore.avance} />
          </div>
          {/* <span className="text-sans-h6-primary">Texto de apoyo</span> */}
          <SubUno_Uno
            dataPaso={paso1_gore}
            id={dataFormGore.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          <SubUno_dos
            flujograma={flujograma_ejercicio_competencia}
            id={dataFormGore.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          <SubUno_Tres
            pasoData={paso1_gore}
            id={dataFormGore.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          {mostrarInput && (
            <>
              {formularioEnviado && userSubdere && (
                <div className="mt-5 my-4 border-top pt-5 col-11">
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
            </>
          )}

          <NavigationGore step={paso1_gore.numero_paso} id={dataFormGore?.id} />
        </div>
      </div>
    </>
  );
};

export default PasoUnoGore;