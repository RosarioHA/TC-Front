import { useContext, useEffect, useState } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { useGorePasos } from "../../hooks/fomularioGore/useFormGorePaso";
import PersonalDirectoGORE from "../../components/tables/PersonalDirectoGORE";


const PasoTresGore = () => {
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 3;

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber, dataFormGore])

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 3</div>;

  const {
    paso3_gore,
    solo_lectura,
    listado_estamentos,
    p_3_1_a_personal_directo,
    p_3_1_b_personal_indirecto,
    listado_calidades_juridicas_directas
  } = dataPasoGore;

  return (
    <>
      <div className="col-1">
        {paso3_gore.numero_paso && <MonoStepers stepNumber={paso3_gore.numero_paso} />}
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3_gore.nombre_paso}</h3>
            <Avance avance={paso3_gore?.avance} />
          </div>
          <div className="mt-4 me-5 pe-5">
            <h4 className="text-sans-h4">3.1 Estamento, tipo de contrato y cantidad de personal para el Gobierno Regional solicitante</h4>
            <h6 className="text-sans-h6-primary mt-3">El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.</h6>

            <div>
              <PersonalDirectoGORE
                id={dataPasoGore?.id}
                paso3={paso3_gore}
                solo_lectura={solo_lectura}
                stepNumber={stepNumber}
                data_personal_directo={p_3_1_a_personal_directo}
                listado_estamentos={listado_estamentos}
                listado_calidades_juridicas={listado_calidades_juridicas_directas}
              />
            </div>


          </div>
          <NavigationGore step={paso3_gore.numero_paso} id={dataFormGore ? dataFormGore.id : null} />
        </div>
      </div>
    </>
  )
}

export default PasoTresGore; 