import { useContext, useEffect, useCallback, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { FormGOREContext } from "../../../context/FormGore";
import { MonoStepers } from "../../../components/stepers/MonoStepers";
import { Avance } from "../../../components/fase1/tables/Avance";
import { NavigationGore } from "../../../components/layout/navigationGore";
import { SubUno_Uno } from "../../../components/fase1/formGore/paso1/sub1.1";
import { SubUno_dos } from "../../../components/fase1/formGore/paso1/sub1.2";
import { SubUno_Tres } from "../../../components/fase1/formGore/paso1/sub1.3";
import CustomTextarea from "../../../components/fase1/forms/custom_textarea";
import { useObservacionesGORE } from "../../../hooks/fase1/fomularioGore/useObSubdereGore";
import { useAuth } from '../../../context/AuthContext';

const PasoUnoGore = () => {
  const { mostrarInput } = useOutletContext();
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 1;
  const { userData } = useAuth();
  const { observaciones, loadingObservaciones, updateObservacion, fetchObservaciones, saved } = useObservacionesGORE(dataFormGore ? dataFormGore.id : null);
  const [observacionPaso1, setObservacionPaso1] = useState("");
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const solo_lectura = dataPasoGore?.solo_lectura;
  const formularioEnviado = dataFormGore?.formulario_enviado;
  const observacionesEnviadas = observaciones?.observacion_enviada;

  const handleUpdateStepNumber = useCallback(() => {
    updateStepNumber(1);
  }, [updateStepNumber]);

  // Comprobar y obtener observaciones cuando cambia el ID
  useEffect(() => {
    handleUpdateStepNumber();
    if (dataFormGore?.id) {
      // Limpiar localStorage para evitar observaciones de formularios anteriores
      localStorage.removeItem('observacionesPaso1');
      fetchObservaciones();
    }
  }, [dataFormGore?.id, fetchObservaciones, handleUpdateStepNumber]);

  // Sincronizar la observación con el estado local y localStorage
  useEffect(() => {
    if (observaciones?.observacion_paso1) {
      setObservacionPaso1(observaciones.observacion_paso1);
      localStorage.setItem('observacionesPaso1', observaciones.observacion_paso1);
    } else {
      // Si no hay observaciones para este formulario, limpiar el estado local y el localStorage
      setObservacionPaso1("");
      localStorage.removeItem('observacionesPaso1');
    }
  }, [observaciones?.observacion_paso1]);

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore?.paso1_gore) return (
    <div className="d-flex align-items-center flex-column">
      <div className="text-center text-sans-h5-medium-blue">Cargando paso 1</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  );
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { paso1_gore = {}, flujograma_ejercicio_competencia } = dataPasoGore;

  const handleGuardarObservacion = async () => {
    if (!observacionesEnviadas) {
      const observacionData = { observacion_paso1: observacionPaso1 };
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
          <SubUno_Uno dataPaso={paso1_gore} id={dataFormGore.id} stepNumber={stepNumber} solo_lectura={solo_lectura} />
          <SubUno_dos flujograma={flujograma_ejercicio_competencia} id={dataFormGore.id} stepNumber={stepNumber} solo_lectura={solo_lectura} />
          <SubUno_Tres pasoData={paso1_gore} id={dataFormGore.id} stepNumber={stepNumber} solo_lectura={solo_lectura} />
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
