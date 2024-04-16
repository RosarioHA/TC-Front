import { useContext, useEffect, useCallback, useState } from 'react';
import { FormGOREContext } from '../../context/FormGore';
import { MonoStepers } from '../../components/stepers/MonoStepers';
import { Avance } from '../../components/tables/Avance';
import { NavigationGore } from '../../components/layout/navigationGore';
import { DosA } from '../../components/formGore/paso2/DosA';
import { DosB } from '../../components/formGore/paso2/DosB';
import { ResumenTotal } from '../../components/formGore/componentes/ResumenTotal';
import { Fluctuaciones } from '../../components/formGore/paso2/DosC';
import CustomTextarea from '../../components/forms/custom_textarea';
import { useObservacionesGORE } from "../../hooks/fomularioGore/useObSubdereGore";
import { useAuth } from '../../context/AuthContext';

const PasoDosGore = () =>
{
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 2;
  const { userData } = useAuth();
  const { observaciones, loadingObservaciones, updateObservacion, fetchObservaciones, saved } = useObservacionesGORE(dataFormGore ? dataFormGore.id : null);
  const [ observacionPaso2, setObservacionPaso2 ] = useState("");
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const solo_lectura = dataPasoGore?.solo_lectura;
  const formularioEnviado = dataFormGore?.formulario_enviado
  const observacionesEnviadas = observaciones?.observacion_enviada;

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
        <div className="container-fluid">
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
          <DosA
            costosDirecSectorGet={costos_directos_sector}
            PersonalDirecto={personal_directo_sector}
            costosDircGore={costos_directos_gore}
            data={dataPasoGore}
            resumen={resumen_costos}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          <DosB
            costosIndirectos={costos_indirectos_sector}
            constIndiGore={costos_indirectos_gore}
            resumen={resumen_costos}
            personalIndirecto={personal_indirecto_sector}
            id={dataFormGore?.id}
            data={dataPasoGore}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />
          <ResumenTotal resumen={resumen_costos} />
          <Fluctuaciones
            dataGastos={p_2_1_c_fluctuaciones_presupuestarias}
            id={dataFormGore?.id}
            stepNumber={stepNumber}
            solo_lectura={solo_lectura}
          />

          {formularioEnviado && userSubdere && (
            <div className="mt-5 my-4 border-top pt-5">
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
