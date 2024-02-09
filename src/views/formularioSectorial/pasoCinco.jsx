import { useEffect, useContext, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CincoPuntoUno } from '../../components/formSectorial/paso5/p5.1';
import { Subpaso_CincoDos } from '../../components/formSectorial/paso5/p5.2';
import { Subpaso_CincoPuntoTres } from "../../components/formSectorial/paso5/p5.3";

const PasoCinco = () => {
  const { updateStepNumber, pasoData, data, loadingPaso, errorPaso } = useContext(FormularioContext);
  const stepNumber = 5;
  const [refreshSubpaso_CincoDos, setRefreshSubpaso_CincoDos] = useState(false);

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 5</div>;

  const paso5 = pasoData.paso5;
  if (!paso5) return <div>No hay información de paso5 disponible</div>;

  const {
    p_5_1_a_costos_directos,
    p_5_1_b_costos_indirectos,
    p_5_1_c_resumen_costos_por_subtitulo,
    p_5_2_evolucion_gasto_asociado, 
    p_5_2_variacion_promedio, 
    p_5_3_a_personal_directo, 
    p_5_3_b_personal_indirecto, 
    listado_subtitulos, 
    listado_item_subtitulos, 
    listado_estamentos, 
    listado_calidades_juridicas,
    listado_etapas
  } = pasoData;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso5.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso5.nombre_paso}</h3>
            <Avance avance={paso5.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_CincoPuntoUno
            id={data.id}
            paso5={paso5}
            stepNumber={stepNumber}
            data_costos_directos={p_5_1_a_costos_directos}
            data_costos_indirectos={p_5_1_b_costos_indirectos}
            data_resumen_costos={p_5_1_c_resumen_costos_por_subtitulo}
            listado_subtitulos={listado_subtitulos}
            listado_item_subtitulos={listado_item_subtitulos}
            listado_etapas={listado_etapas}
            setRefreshSubpaso_CincoDos={setRefreshSubpaso_CincoDos}
            />
          <Subpaso_CincoDos data={p_5_2_evolucion_gasto_asociado} variacion_promedio={p_5_2_variacion_promedio} />
          <Subpaso_CincoPuntoTres data_personal_directo={p_5_3_a_personal_directo} data_personal_indirecto={p_5_3_b_personal_indirecto} listado_estamentos={listado_estamentos} listado_calidades_juridicas={listado_calidades_juridicas} />
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso5.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PasoCinco;
