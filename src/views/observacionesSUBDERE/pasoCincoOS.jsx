import { useEffect, useContext, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CincoPuntoUnoOS } from '../../components/obsSUBDERE/paso5/p5.1OS';
import { Subpaso_CincoDosOS } from '../../components/obsSUBDERE/paso5/p5.2OS';
import { Subpaso_CincoPuntoTresOS } from '../../components/obsSUBDERE/paso5/p5.3OS';
import CustomTextarea from '../../components/forms/custom_textarea';

const PasoCincoOS = () => {
  const { updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const stepNumber = 5;
  const [ observacionSubdere, setObservacionSubdere ] = useState('');

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  const { paso5, p_5_1_a_costos_directos, p_5_2_evolucion_gasto_asociado, p_5_2_variacion_promedio, p_5_3_a_personal_directo, p_5_3_b_personal_indirecto, listado_subtitulos, listado_item_subtitulos, listado_estamentos, listado_calidades_juridicas } = pasoData;

  if (!paso5) return <div>No hay datos disponibles para el Paso 5</div>;

  const handleObservacionChange = (event) => {
    const observacion = event.target.value;
    setObservacionSubdere(observacion);
  };

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
          <Subpaso_CincoPuntoUnoOS data={p_5_1_a_costos_directos} listado_subtitulos={listado_subtitulos} listado_item_subtitulos={listado_item_subtitulos} />
          <Subpaso_CincoDosOS data={p_5_2_evolucion_gasto_asociado} variacion_promedio={p_5_2_variacion_promedio} />
          <Subpaso_CincoPuntoTresOS data_personal_directo={p_5_3_a_personal_directo} data_personal_indirecto={p_5_3_b_personal_indirecto} listado_estamentos={listado_estamentos} listado_calidades_juridicas={listado_calidades_juridicas} />
          
          <div className="col-11">
            <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            maxLength={500}
            rows={10}
            readOnly={false}
            value={observacionSubdere}
            onChange={handleObservacionChange}
            />
            <div className="d-flex mb-3 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="mt-1">Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo Texto de apoyo </h6>
            </div>
          </div>
          
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso5.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PasoCincoOS;
