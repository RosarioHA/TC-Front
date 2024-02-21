import { useContext, useEffect, useState } from 'react';
import { FormularioContext } from '../../context/FormSectorial';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { Subpaso_dosPuntoUno } from "../../components/formSectorial/paso2/p2.1";
import { Subpaso_dosPuntoDos } from "../../components/formSectorial/paso2/p2.2";
import { Subpaso_dosPuntoTres } from "../../components/formSectorial/paso2/p2.3";
import { Subpaso_dosPuntoCuatro } from "../../components/formSectorial/paso2/p2.4";
import { Subpaso_dosPuntoCinco } from "../../components/formSectorial/paso2/p2.5";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoDos = () => {
  const { pasoData, loadingPaso, errorPaso, updateStepNumber, data } = useContext(FormularioContext);
  const stepNumber = 2;
  const [ refreshSubpasoDos_dos, setRefreshSubpasoDos_dos ] = useState(false);
  const [ refreshSubpasoDos_tres, setRefreshSubpasoDos_tres ] = useState(false);
  const [ refreshSubpasoDos_cuatro, setRefreshSubpasoDos_cuatro ] = useState(false);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');

  const { observaciones, updateObservacion } = useObservacionesSubdere(data ? data.id : null);
  const [observacionPaso2, setObservacionPaso2] = useState("");
  console.log("observaciones en vista p2", observaciones)

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 2</div>;

  const paso2 = pasoData.paso2;
  if (!paso2) return <div>No hay información de paso2 disponible</div>;

  const {
    p_2_1_organismos_intervinientes,
    listado_organismos,
    p_2_2_unidades_intervinientes,
    p_2_3_etapas_ejercicio_competencia,
    listado_unidades,
    p_2_4_plataformas_y_softwares,
    listado_etapas,
    p_2_5_flujograma_competencia
  } = pasoData;

  const handleGuardarObservacion = async () => {
    const observacionData = {
      observacion_paso2: observacionPaso2,
    };

    await updateObservacion(observacionData);
  };
  
  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso2.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso2.nombre_paso}</h3>
            <Avance avance={paso2.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>

          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoUno
              data={p_2_1_organismos_intervinientes}
              lista={listado_organismos}
              stepNumber={stepNumber}
              id={data.id}
              setRefreshSubpasoDos_dos={setRefreshSubpasoDos_dos}
            />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoDos
              data={p_2_2_unidades_intervinientes}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_dos={refreshSubpasoDos_dos}
              setRefreshSubpasoDos_dos={setRefreshSubpasoDos_dos}
              refreshSubpasoDos_tres={refreshSubpasoDos_tres}
              setRefreshSubpasoDos_tres={setRefreshSubpasoDos_tres}
            />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoTres
              data={p_2_3_etapas_ejercicio_competencia}
              listado_unidades={listado_unidades}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_tres={refreshSubpasoDos_tres}
              setRefreshSubpasoDos_tres={setRefreshSubpasoDos_tres}
              refreshSubpasoDos_cuatro={refreshSubpasoDos_cuatro}
              setRefreshSubpasoDos_cuatro={setRefreshSubpasoDos_cuatro}
            />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoCuatro
              data={p_2_4_plataformas_y_softwares}
              listado_etapas={listado_etapas}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_cuatro={refreshSubpasoDos_cuatro}
              setRefreshSubpasoDos_cuatro={setRefreshSubpasoDos_cuatro}
            />
          </div>
          <div className="container-fluid me-5 pe-5 my-5">
            <Subpaso_dosPuntoCinco
              flujograma={p_2_5_flujograma_competencia}
              data={pasoData.paso2}
              stepNumber={stepNumber}
              id={data.id} />
          </div>

          {userSubdere && (
            <div className="mt-5 my-4">
            <CustomTextarea 
              label="Observaciones (Opcional)"
              placeholder="Escribe tus observaciones de este paso del formulario"
              rows={5}
              maxLength={500}
              value={observacionPaso2}
              onChange={(e) => setObservacionPaso2(e.target.value)}
            />
            {/* aqui reemplazar boton por metodo automatico */}
            <button onClick={handleGuardarObservacion}>Guardar Observaciones</button>
          </div>
          )}
          
          {/*Botones navegacion  */}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso2.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  )
};

export default PasoDos;