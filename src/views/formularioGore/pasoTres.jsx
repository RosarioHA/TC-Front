import { useContext, useEffect } from "react";
import { FormGOREContext } from "../../context/FormGore";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { Avance } from "../../components/tables/Avance";
import { NavigationGore } from "../../components/layout/navigationGore";
import { Sub_1 } from "../../components/formGore/paso3/Sub_1";
import { Sub_2} from "../../components/formGore/paso3/Sub_2"; 


const PasoTresGore = () =>
{
  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 3;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber, dataFormGore ])

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 3</div>;

  console.log(dataPasoGore);

  const { paso3_gore = {},
    listado_calidades_juridicas_directas,
    listado_calidades_juridicas_indirectas,
    listado_estamentos,
    listado_item_subtitulos,
    listado_subtitulo,
    p_3_1_a_personal_directo,
    p_3_1_b_personal_indirecto,
    p_3_2_a_sistemas_informaticos,
    p_3_2_b_recursos_fisicos_infraestructura,
    p_3_2_recursos_comparados
  } = dataPasoGore;


  console.log(  p_3_1_b_personal_indirecto,
    p_3_2_a_sistemas_informaticos,
    p_3_2_b_recursos_fisicos_infraestructura,
    p_3_2_recursos_comparados, listado_calidades_juridicas_indirectas,
    listado_estamentos,
    listado_item_subtitulos,
    p_3_1_a_personal_directo,
    listado_subtitulo,
    listado_calidades_juridicas_directas,)

  return (
    <>
      <div className="col-1">
      <MonoStepers stepNumber={stepNumber}/>
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso3_gore?.nombre_paso || ''}</h3>
            <Avance avance={paso3_gore?.avance} />
          </div>
          <Sub_1/>
          <Sub_2/>
          
          <NavigationGore step={stepNumber} id={dataFormGore ? dataFormGore.id : null} />
        </div>
      </div>
    </>
  )
}

export default PasoTresGore; 