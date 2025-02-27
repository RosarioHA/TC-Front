import { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FormularioContext } from '../../../context/FormSectorial';
import { Avance } from "../../../components/fase1/tables/Avance";
import { ButtonsNavigate } from "../../../components/layout/ButtonsNavigate";
import { Subpaso_dosPuntoUno } from "../../../components/fase1/formSectorial/paso2/p2.1";
import { Subpaso_dosPuntoDos } from "../../../components/fase1/formSectorial/paso2/p2.2";
import { Subpaso_dosPuntoTres } from "../../../components/fase1/formSectorial/paso2/p2.3";
import { Subpaso_dosPuntoCuatro } from "../../../components/fase1/formSectorial/paso2/p2.4";
import { Subpaso_dosPuntoCinco } from "../../../components/fase1/formSectorial/paso2/p2.5";
import { MonoStepers } from "../../../components/stepers/MonoStepers";
import CustomTextarea from '../../../components/fase1/forms/custom_textarea';
import { useAuth } from '../../../context/AuthContext';
import { useObservacionesSubdere } from '../../../hooks/fase1/formulario/useObSubdereSectorial';

const PasoDos = () =>
{
  const { pasoData, errorPaso, updateStepNumber, data } = useContext(FormularioContext);
  const stepNumber = 2;
  const { mostrarInput } = useOutletContext();
  const [ refreshSubpasoDos_dos, setRefreshSubpasoDos_dos ] = useState(false);
  const [ refreshSubpasoDos_tres, setRefreshSubpasoDos_tres ] = useState(false);
  const [ refreshSubpasoDos_cuatro, setRefreshSubpasoDos_cuatro ] = useState(false);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userSectorial = userData?.perfil?.includes('Sectorial');
  const userDIPRES = userData?.perfil?.includes('DIPRES');
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [ observacionPaso2, setObservacionPaso2 ] = useState("");
  const observacionesEnviadas = observaciones?.observacion_enviada;
  const formSectorialEnviado = data?.formulario_enviado;


  useEffect(() =>
  {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso2)
    {
      setObservacionPaso2(observaciones.observacion_paso2);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones ]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 2</div>;

  const paso2 = pasoData.paso2;
  if (!paso2) return <> <div className="d-flex align-items-center flex-column my-5 px-5 ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando paso 2</div>
    <span className="placeholder col-6 bg-primary"></span>
  </div></>;

  const {
    p_2_1_organismos_intervinientes,
    listado_organismos,
    p_2_2_unidades_intervinientes,
    p_2_3_etapas_ejercicio_competencia,
    listado_unidades,
    p_2_4_plataformas_y_softwares,
    listado_etapas,
    p_2_5_flujograma_competencia,
    solo_lectura
  } = pasoData;

  const {
    avance,
    multiplicador_caracteres_competencia,
    multiplicador_caracteres_region
  } = pasoData.paso2

  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        id: observaciones?.id,  // Asumiendo que 'observaciones' es un estado que contiene el 'id' sectorial
        observacion_paso2: observacionPaso2
      };
      await updateObservacion(observacionData);
    }
  };


  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso2.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso2.nombre_paso}</h3>
            <Avance avance={avance} id={data.id} />
          </div>
          {/* <span className="text-sans-h6-primary">Texto de apoyo</span> */}

          <div className="container me-5 pe-5 my-5">
            <Subpaso_dosPuntoUno
              data={p_2_1_organismos_intervinientes}
              lista={listado_organismos}
              stepNumber={stepNumber}
              id={data.id}
              setRefreshSubpasoDos_dos={setRefreshSubpasoDos_dos}
              solo_lectura={solo_lectura}
              limite_caracteres={multiplicador_caracteres_region}
            />
          </div>
          <div className="container me-5 pe-5 my-5">
            <Subpaso_dosPuntoDos
              data={p_2_2_unidades_intervinientes}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_dos={refreshSubpasoDos_dos}
              setRefreshSubpasoDos_dos={setRefreshSubpasoDos_dos}
              refreshSubpasoDos_tres={refreshSubpasoDos_tres}
              setRefreshSubpasoDos_tres={setRefreshSubpasoDos_tres}
              solo_lectura={solo_lectura}
              limite_caracteres={multiplicador_caracteres_region}
            />
          </div>
          <div className="container me-5 pe-5 my-5">
            <Subpaso_dosPuntoTres
              data={p_2_3_etapas_ejercicio_competencia}
              listado_unidades={listado_unidades}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_tres={refreshSubpasoDos_tres}
              setRefreshSubpasoDos_tres={setRefreshSubpasoDos_tres}
              refreshSubpasoDos_cuatro={refreshSubpasoDos_cuatro}
              setRefreshSubpasoDos_cuatro={setRefreshSubpasoDos_cuatro}
              solo_lectura={solo_lectura}
              limite_caracteres={multiplicador_caracteres_region}
            />
          </div>
          <div className="container me-5 pe-5 my-5">
            <Subpaso_dosPuntoCuatro
              data={p_2_4_plataformas_y_softwares}
              listado_etapas={listado_etapas}
              stepNumber={stepNumber}
              id={data.id}
              refreshSubpasoDos_cuatro={refreshSubpasoDos_cuatro}
              setRefreshSubpasoDos_cuatro={setRefreshSubpasoDos_cuatro}
              solo_lectura={solo_lectura}
              limite_caracteres={multiplicador_caracteres_region}
            />
          </div>
          <div className="container me-5 pe-5 my-5">
            <Subpaso_dosPuntoCinco
              flujograma={p_2_5_flujograma_competencia}
              data={pasoData.paso2}
              stepNumber={stepNumber}
              id={data.id}
              solo_lectura={solo_lectura}
              limite_caracteres={multiplicador_caracteres_competencia} />
          </div>
          {mostrarInput && (
            <>
              {((userSubdere && formSectorialEnviado) || (userSectorial && observacionesEnviadas) || (userDIPRES && observacionesEnviadas)) && (
                <div className="my-4 col-11">
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

          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso2.numero_paso} id={data.id} />
          </div>
        </div>
      </div>
    </>
  )
};

export default PasoDos;