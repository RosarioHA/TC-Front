import { useContext, useEffect, useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FormGOREContext } from '../../../context/FormGore';
import { MonoStepers } from '../../../components/stepers/MonoStepers';
import { Avance } from '../../../components/fase1/tables/Avance';
import { NavigationGore } from '../../../components/layout/navigationGore';
import { CostosGORE } from '../../../components/fase1/formGore/paso2/DosA';
import { ResumenTotal } from '../../../components/fase1/formGore/componentes/ResumenTotal';
import { Fluctuaciones } from '../../../components/fase1/formGore/paso2/DosC';
import CustomTextarea from '../../../components/fase1/forms/custom_textarea';
import { useObservacionesGORE } from "../../../hooks/fase1/fomularioGore/useObSubdereGore";
import { useAuth } from '../../../context/AuthContext';

const PasoDosGore = () =>
{
  const { mostrarInput } = useOutletContext();
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 2;
  const { userData } = useAuth();
  const { observaciones, loadingObservaciones, updateObservacion, fetchObservaciones, saved } = useObservacionesGORE(dataFormGore ? dataFormGore.id : null);
  const [ observacionPaso2, setObservacionPaso2 ] = useState("");
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const solo_lectura = dataPasoGore?.solo_lectura;
  const formularioEnviado = dataFormGore?.formulario_enviado
  const observacionesEnviadas = observaciones?.observacion_enviada;

  const tituloDirecto = "a. Costos directos";
  const glosaDirecto = "Por costos directos se entenderán aquellos imputables a los procedimientos específicos de la competencia analizada, y que no corresponden a unidades de soporte transversal del Ministerio o Servicio de origen. Los costos analizados responden al año n-1, es decir, al año anterior al inicio del estudio de transferencia de competencias.\nSe debe informar si el costo informado es transitorio o no. Un costo transitorio es aquel que es efectivo solo durante el tiempo de traspaso de la competencia, mientras que un costo no transitorio es aquel que se sostiene de manera permanente.";
  const nombreModeloDirecto = "directos"
  const seccionDirecto = "p_2_1_a_costos_directos"

  const tituloIndirecto = "b. Costos indirectos"
  const glosaIndirecto = "Por costos indirectos se entenderán aquellos que no son imputables a los procedimientos específicos de la competencia analizada, pero que, al financiar unidades de soporte transversal en el Ministerio o Servicio de origen, hacen posible el ejercicio de la competencia. Los costos analizados responden al año n-1, es decir, al año anterior al inicio de estudio de transferencia de competencias.\nSe debe informar si el costo informado es transitorio o no. Un costo transitorio es aquel que es efectivo solo durante el tiempo de traspaso de la competencia, mientras que un costo no transitorio es aquel que se sostiene de manera permanente.";
  const nombreModeloIndirecto = "indirectos"
  const seccionIndirecto = "p_2_1_b_costos_indirectos"

  const handleUpdateStepNumber = useCallback(() =>
  {
    const stepNumber = 2;
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
    if (observaciones && observaciones.observacion_paso2)
    {
      setObservacionPaso2(observaciones.observacion_paso2);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones ]);

  if (errorPasoGore)
    return <div>Error: {errorPasoGore.message || 'Error desconocido'}</div>;
  if (!dataPasoGore?.paso2_gore) return <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando paso 2</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>;
  if (!dataPasoGore || dataPasoGore.length === 0)
    return <div>No hay datos disponibles para el Paso 2</div>;

  // Asegurarse de que paso2_gore exista antes de continuar.
  const {
    paso2_gore = {},
    costos_directos_sector,
    personal_directo_sector,
    costos_indirectos_sector,
    costos_directos_gore,
    resumen_costos,
    personal_indirecto_sector,
    costos_indirectos_gore,
    p_2_1_c_fluctuaciones_presupuestarias,
  } = dataPasoGore;

  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        observacion_paso2: observacionPaso2,
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
            <h3 className="mt-3 me-4">{paso2_gore.nombre_paso}</h3>
            <Avance avance={paso2_gore.avance} />
          </div>
          <div className="col-11 text-sans-h6-primary">
            <h6>
              Se deben estimar los gastos necesarios para el ejercicio de la
              competencia por el Gobierno Regional, considerando los costos
              directos e indirectos informados por el Ministerio o Servicio de
              origen, y complementados por la DIPRES. En el caso de los costos
              indirectos, se debe considerar que corresponden a tareas de
              soporte nacional, por lo que no son replicables region a region.
            </h6>
          </div>
          <CostosGORE
            costosSectorGet={costos_directos_sector}
            Personal={personal_directo_sector}
            costosGore={costos_directos_gore}
            data={dataPasoGore}
            resumen={resumen_costos}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
            glosa={glosaDirecto}
            titulo={tituloDirecto}
            nombreModelo={nombreModeloDirecto}
            seccion={seccionDirecto}
          />
          <CostosGORE
            costosSectorGet={costos_indirectos_sector}
            Personal={personal_indirecto_sector}
            costosGore={costos_indirectos_gore}
            data={dataPasoGore}
            resumen={resumen_costos}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
            glosa={glosaIndirecto}
            titulo={tituloIndirecto}
            nombreModelo={nombreModeloIndirecto}
            seccion={seccionIndirecto}
          />
          <ResumenTotal resumen={resumen_costos} />
          <Fluctuaciones
            dataGastos={p_2_1_c_fluctuaciones_presupuestarias}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          {mostrarInput && (
            <>
              {formularioEnviado && userSubdere && (
                <div className="mt-5 my-4 border-top pt-5 col-11">
                  {!observacionPaso2.trim() && observacionesEnviadas ? (
                    <p>No se han dejado observaciones en este paso.</p>
                  ) : (
                    <CustomTextarea
                      label="Observaciones (Opcional)"
                      placeholder="Escribe tus observaciones de este paso del formulario"
                      rows={5}
                      maxLength={500}
                      value={observacionPaso2}
                      onChange={(e) => setObservacionPaso2(e.target.value)}
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



          <NavigationGore
            step={paso2_gore?.numero_paso}
            id={dataFormGore?.id}
          />
        </div>
      </div>
    </>
  );
};

export default PasoDosGore;
