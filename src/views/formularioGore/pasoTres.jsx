import { useContext, useEffect, useState } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { usePasoForm } from "../../hooks/formulario/usePasoForm";
import PersonalDirectoGORE from "../../components/tables/PersonalDirectoGORE";


const PasoTresGore = () => {

  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 3;
  const { refetchDataPaso, refetchTrigger } = usePasoForm(dataPasoGore?.id, stepNumber);
  const [paso3Data, setPaso3Data] = useState('');
  const [juridicasDirectasData, setJuridicasDirectasData] = useState('');
  const [juridicasIndirectasData, setJuridicasIndirectasData] = useState('');
  const [personalDirectoData, setPersonalDirectoData] = useState('');
  const [personalIndirectoData, setPersonalIndirectoData] = useState('');
  const [subtituloDirectoData, setSubtitulosDirectoData] = useState('');
  const [subtituloIndirectoData, setSubtitulosIndirectoData] = useState('');
  const [itemSubtitulosDirectoData, setItemSubtitulosDirectoData] = useState('');
  const [itemSubtitulosIndirectoData, setItemSubtitulosIndirectoData] = useState('');


  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber, dataFormGore])

  useEffect(() => {
    if (refetchDataPaso) {
      setPaso3Data(refetchDataPaso.paso3_gore);
      setJuridicasDirectasData(refetchDataPaso.listado_calidades_juridicas_directas);
      setJuridicasIndirectasData(refetchDataPaso.listado_calidades_juridicas_indirectas);
      setSubtitulosDirectoData(refetchDataPaso.listado_subtitulos_directos);
      setSubtitulosIndirectoData(refetchDataPaso.listado_subtitulos_indirectos);
      setItemSubtitulosDirectoData(refetchDataPaso.listado_item_subtitulos_directos);
      setItemSubtitulosIndirectoData(refetchDataPaso.listado_item_subtitulos_indirectos);
      setPersonalDirectoData(refetchDataPaso.p_3_1_a_personal_directo);
      setPersonalIndirectoData(refetchDataPaso.p_3_1_b_personal_indirecto);
    } else {
      setPaso3Data(dataPasoGore?.paso3_gore);
    }
  }, [refetchDataPaso])


  console.log('dataForm', paso3Data)

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 3</div>;

  const {
    paso3_gore,
    solo_lectura,
    listado_estamentos,
  } = dataPasoGore;
  const paso3 = paso3_gore || {};



  return (
    <>
      <div className="col-1">
        {paso3.numero_paso && <MonoStepers stepNumber={paso3.numero_paso} />}
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3.nombre_paso}</h3>
            <Avance avance={paso3Data?.avance} />
          </div>
          <div className="mt-4 me-5 pe-5">
            <h4 className="text-sans-h4">3.1 Estamento, tipo de contrato y cantidad de personal para el Gobierno Regional solicitante</h4>
            <h6 className="text-sans-h6-primary mt-3">El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.</h6>

            <div>
              <PersonalDirectoGORE
                id={dataPasoGore?.id}
                paso3={paso3Data}
                solo_lectura={solo_lectura}
                stepNumber={stepNumber}
                data_personal_directo={personalDirectoData}
                listado_estamentos={listado_estamentos}
                listado_calidades_juridicas={juridicasDirectasData}
                refetchTrigger={refetchTrigger}
              />
            </div>


          </div>
          <NavigationGore step={paso3.numero_paso} id={dataFormGore ? dataFormGore.id : null} />
        </div>
      </div>
    </>
  )
}

export default PasoTresGore; 