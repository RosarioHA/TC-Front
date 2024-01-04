import { useContext, useEffect, useState } from 'react';
import { FormularioContext } from '../../context/FormSectorial';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { Subpaso_dosPuntoUnoOS } from '../../components/obsSUBDERE/paso2/p2.1OS';
import { Subpaso_dosPuntoDosOS } from '../../components/obsSUBDERE/paso2/p2.2OS';
import { Subpaso_dosPuntoTresOS } from '../../components/obsSUBDERE/paso2/p2.3OS';
import { Subpaso_dosPuntoCuatroOS } from '../../components/obsSUBDERE/paso2/p2.4OS';
import { Subpaso_dosPuntoCincoOS } from '../../components/obsSUBDERE/paso2/p2.5OS';
import { MonoStepers } from "../../components/stepers/MonoStepers";
import CustomTextarea from '../../components/forms/custom_textarea';

const PasoDosOS = () => {
  const { pasoData, loadingPaso, errorPaso, updateStepNumber ,data} = useContext(FormularioContext);
  const [ observacionSubdere, setObservacionSubdere ] = useState('');
  const stepNumber = 2;

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  const handleObservacionChange = (event) => {
    const observacion = event.target.value;
    setObservacionSubdere(observacion);
  };

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 2</div>;

  const paso2 = pasoData.paso2;
  if (!paso2) return <div>No hay información de paso2 disponible</div>;

  const { p_2_1_organismos_intervinientes, p_2_2_unidades_intervinientes, p_2_3_etapas_ejercicio_competencia, p_2_4_plataformas_y_softwares, p_2_5_flujograma_competencia } = pasoData;

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso2.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso2.nombre_paso}</h3>
            <Avance avance={paso2.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>

          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoUnoOS data={p_2_1_organismos_intervinientes}/>
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoDosOS data={p_2_2_unidades_intervinientes}/>
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoTresOS data={p_2_3_etapas_ejercicio_competencia} />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoCuatroOS data={p_2_4_plataformas_y_softwares} />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoCincoOS data={p_2_5_flujograma_competencia} />
          </div>

          {/* Seccion observaciones SUBDERE */}
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

          {/*Botones navegacion  */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso2.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  )
};

export default PasoDosOS;