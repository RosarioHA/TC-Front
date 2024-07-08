import { useEffect, useContext, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CincoPuntoUno } from '../../components/formSectorial/paso5/p5.1';
import { Subpaso_CincoDos } from '../../components/formSectorial/paso5/p5.2';
import { Subpaso_CincoPuntoTres } from "../../components/formSectorial/paso5/p5.3";
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoCinco = () =>
{
  const { updateStepNumber, pasoData, data, errorPaso } = useContext(FormularioContext);
  const stepNumber = 5;
  const { userData } = useAuth();
  const [ collapseStates, setCollapseStates ] = useState({});

  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userSectorial = userData?.perfil?.includes('Sectorial');
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [ observacionPaso5, setObservacionPaso5 ] = useState("");
  const formSectorialEnviado = data?.formulario_enviado;
  const observacionesEnviadas = observaciones?.observacion_enviada;
  // const activeOS = location.state?.activeOS || false;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso5)
    {
      setObservacionPaso5(observaciones.observacion_paso5);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones ]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData) return <div>No hay datos disponibles para el Paso 5</div>;

  const paso5encabezado = pasoData.paso5encabezado;

  if (!paso5encabezado) return (
    <div className="d-flex align-items-center flex-column my-5 px-5">
      <div className="text-center text-sans-h5-medium-blue">Cargando paso 5</div>
      <span className="placeholder col-6 bg-primary"></span>
    </div>
  );

  const { listado_etapas, listado_estamentos, solo_lectura, años, años_variacion } = pasoData;

  const handleGuardarObservacion = async () =>
  {
    const observacionData = {
      observacion_paso5: observacionPaso5,
    };
    await updateObservacion(observacionData);
  };

  const avance = pasoData?.paso5encabezado?.avance;

  const toggleCollapse = (index) =>
  {
    setCollapseStates((prevState) =>
    {
      const newState = { ...prevState, [ index ]: !prevState[ index ] };
      for (const key in newState)
      {
        if (key !== index.toString())
        {
          newState[ key ] = false;
        }
      }
      return newState;
    });
  };

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso5encabezado.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso5encabezado.nombre_paso}</h3>
            <Avance avance={avance} id={data.id} />
          </div>
          {/* <span className="text-sans-h6-primary">Texto de apoyo</span> */}
          {pasoData.regiones.map((region, index) => (
            <div key={index} className="my-5">
              <div className="col-12 collapse-regiones border border-bottom" type="button" data-bs-toggle="collapse"
                data-bs-target={`#collapseRegion${index}`} aria-expanded={collapseStates[ index ] ? "true" : "false"}
                aria-controls={`collapseRegion${index}`} onClick={() => toggleCollapse(index)}>
                <div className="d-flex justify-content-between">
                  <span className="text-sans-h4 text-start">{region.region}</span>
                  <button className="btn-secundario-s-round">
                    {collapseStates[ index ] ? "Ocultar sección" : "Mostrar sección"}
                    <span className="material-symbols-outlined">
                      {collapseStates[ index ] ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    </span>
                  </button>
                </div>
                <div>
                  <Avance avance={region.paso5[ 0 ]?.avance} id={data.id} />
                </div>
              </div>
              <div className={`collapse ${collapseStates[ index ] ? 'show' : ''}`} id={`collapseRegion${index}`}>
                <div className="card card-body">
                  <div className="container">
                    <Subpaso_CincoPuntoUno
                      id={data.id}
                      paso5={region.paso5}
                      solo_lectura={solo_lectura}
                      stepNumber={stepNumber}
                      data_costos_directos={region.p_5_1_a_costos_directos}
                      data_costos_indirectos={region.p_5_1_b_costos_indirectos}
                      data_resumen_costos={region.p_5_1_c_resumen_costos_por_subtitulo}
                      listado_subtitulos_directos={region.listado_subtitulos_directos}
                      listado_subtitulos_indirectos={region.listado_subtitulos_indirectos}
                      listado_item_subtitulos_directos={region.listado_item_subtitulos_directos}
                      listado_item_subtitulos_indirectos={region.listado_item_subtitulos_indirectos}
                      listado_etapas={listado_etapas}
                      region={region.region}
                    />
                    <Subpaso_CincoDos
                      id={data.id}
                      paso5={region.paso5}
                      solo_lectura={solo_lectura}
                      stepNumber={stepNumber}
                      p_5_2_evolucion_gasto_asociado={region.p_5_2_evolucion_gasto_asociado}
                      p_5_2_variacion_promedio={region.p_5_2_variacion_promedio}
                      region={region.region}
                      años={años}
                      años_variacion={años_variacion}
                    />
                    <Subpaso_CincoPuntoTres
                      id={data.id}
                      paso5={region.paso5}
                      solo_lectura={solo_lectura}
                      stepNumber={stepNumber}
                      data_personal_directo={region.p_5_3_a_personal_directo}
                      data_personal_indirecto={region.p_5_3_b_personal_indirecto}
                      listado_estamentos={listado_estamentos}
                      listado_calidades_juridicas_directas={region.listado_calidades_juridicas_directas}
                      listado_calidades_juridicas_indirectas={region.listado_calidades_juridicas_indirectas}
                      region={region.region}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* {activeOS ? (
            <> */}
              {((userSubdere && formSectorialEnviado) || (userSectorial && observacionesEnviadas)) && (
                <div className="mt-5 my-4">
                  {!observacionPaso5.trim() && observacionesEnviadas ? (
                    <p>No se han dejado observaciones en este paso.</p>
                  ) : (
                    <CustomTextarea
                      label="Observaciones (Opcional)"
                      placeholder="Escribe tus observaciones de este paso del formulario"
                      rows={5}
                      maxLength={500}
                      value={observacionPaso5}
                      onChange={(e) => setObservacionPaso5(e.target.value)}
                      readOnly={observacionesEnviadas}
                      onBlur={handleGuardarObservacion}
                      loading={loadingObservaciones}
                      saved={saved}
                    />
                  )}
                </div>
              )}  
              {/* </>
          ) : ("")} */}

          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso5encabezado.numero_paso} id={data.id} ocultarEnviarBtn={observacionesEnviadas} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PasoCinco;
