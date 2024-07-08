import { useEffect, useContext, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CuatroUno } from "../../components/formSectorial/paso4/p4.1";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoCuatro = () =>
{
  const { updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const stepNumber = 4;
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userSectorial = userData?.perfil?.includes('Sectorial');
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [ observacionPaso4, setObservacionPaso4 ] = useState("");
  const [ collapseStates, setCollapseStates ] = useState({});
  const activeOS = location.state?.activeOS || false;

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

  const observacionesEnviadas = observaciones?.observacion_enviada
  const formSectorialEnviado = data?.formulario_enviado

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso4)
    {
      setObservacionPaso4(observaciones.observacion_paso4);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones ]);

  if (!pasoData) return <div>No hay datos disponibles para el Paso 4</div>;

  const { paso4encabezado: paso4Data, lista_indicadores, solo_lectura, regiones } = pasoData;

  if (!paso4Data)
    return <> <div className="d-flex align-items-center flex-column my-5 px-5 ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando paso 4</div>
      <span className="placeholder col-6 bg-primary"></span>
    </div></>;

  const id = data?.id;

  const handleGuardarObservacion = async () =>
  {
    const observacionData = {
      observacion_paso4: observacionPaso4,
    };
    await updateObservacion(observacionData);
  };

  const avance = paso4Data?.avance;
  //const index= 1; 

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso4Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso4Data.nombre_paso}</h3>
            <Avance avance={avance} id={id} />
          </div>
          <div className="mt-4">
            <h6 className="text-sans-h6-primary">Los indicadores de desempeño, deben incluir una descripción de los componentes del indicador, asi como los medios utilizados para su calculo y sus medios de verificación. Si la competencia esta asociada a un programa que cuente con evaluación ex ante, se debe considerar la información incluida en su versión mas actualizada.</h6>
            <h6 className="text-sans-h6-primary mt-3">De no contar la competencia con indicadores de desempeño asociados, este apartado debe ser omitido.</h6>
            <h6 className="text-sans-h6-primary mt-3">Si el ejercicio de la competencia tiene mas de un indicador de desempeño, se deben añadir las tablas correspondientes.</h6>
            <div className="my-5 pb-3 border-bottom">


              {regiones.map((regionData, index) => (
                <div key={index} className="my-5">
                  <div className="col-12 collapse-regiones border border-bottom" type="button" data-bs-toggle="collapse"
                    data-bs-target={`#collapseRegion${index}`} aria-expanded={collapseStates[ index ] ? "true" : "false"}
                    aria-controls={`collapseRegion${index}`} onClick={() => toggleCollapse(index)}>
                    <div className="d-flex justify-content-between">
                      <span className="text-sans-h4 text-start">{regionData.region}</span>
                      <button className="btn-secundario-s-round">
                        {collapseStates[ index ] ? "Ocultar sección" : "Mostrar sección"}
                        <span className="material-symbols-outlined">
                          {collapseStates[ index ] ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                        </span>
                      </button>
                    </div>
                    <div>
                      <Avance avance={regionData?.paso4?.[ 0 ]?.avance} id={id} />
                    </div>
                  </div>
                  <div className={`collapse ${collapseStates[ index ] ? 'show' : ''}`} id={`collapseRegion${index}`}>
                    <div className="card card-body">
                      <>
                        {regionData.indicador_desempeno && (
                          <Subpaso_CuatroUno
                            data={regionData.indicador_desempeno}
                            id={id}
                            stepNumber={stepNumber}
                            listaIndicadores={lista_indicadores}
                            readOnly={false}
                            solo_lectura={solo_lectura}
                            region={regionData.region}
                          />
                        )}
                      </>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* {activeOS ? ( */}
            <>
              {((userSubdere && formSectorialEnviado) || (userSectorial && observacionesEnviadas)) && (
                <div className="mt-5 my-4">
                  {!observacionPaso4.trim() && observacionesEnviadas ? (
                    <p>No se han dejado observaciones en este paso.</p>
                  ) : (
                    <CustomTextarea
                      label="Observaciones (Opcional)"
                      placeholder="Escribe tus observaciones de este paso del formulario"
                      rows={5}
                      maxLength={500}
                      value={observacionPaso4}
                      onChange={(e) => setObservacionPaso4(e.target.value)}
                      readOnly={observacionesEnviadas}
                      onBlur={handleGuardarObservacion}
                      loading={loadingObservaciones}
                      saved={saved}
                    />
                  )}
                </div>
              )}
            </>
          {/* ) : ("")} */}

          {/*Botones navegacion*/}
          <div className="container me-5 pe-5">
            <ButtonsNavigate step={paso4Data.numero_paso} id={id} />
          </div>
        </div>
      </div>
    </>
  )
};

export default PasoCuatro;
