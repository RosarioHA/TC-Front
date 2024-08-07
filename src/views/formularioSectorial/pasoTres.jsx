import { useContext, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Avance } from '../../components/tables/Avance';
import { ButtonsNavigate } from '../../components/layout/ButtonsNavigate';
import CustomTextarea from '../../components/forms/custom_textarea';
import { Subpaso_Tres } from '../../components/formSectorial/paso3/p3.1';
import { FormularioContext } from '../../context/FormSectorial';
import { MonoStepers } from '../../components/stepers/MonoStepers';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';


const PasoTres = () =>
{
  const {  mostrarInput} = useOutletContext();
  const { handleUpdatePaso, updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const userSectorial = userData?.perfil?.includes('Sectorial');
  const userDIPRES = userData?.perfil?.includes('DIPRES');
  const stepNumber = 3;
  const id = data.id;
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const observacionesEnviadas = observaciones?.observacion_enviada;
  const formSectorialEnviado = data?.formulario_enviado;
  const [ collapseStates, setCollapseStates ] = useState({});
  const [ observacionPaso3, setObservacionPaso3 ] = useState('');
  const [ formData, setFormData ] = useState({});
  // const activeOS = location.state?.activeOS || false;

  // conosole.log('2', activeOS)

  // Estado para el estado de carga y guardado por región e input
  const [ inputStatus, setInputStatus ] = useState({});

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0)
    {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso3)
    {
      setObservacionPaso3(observaciones.observacion_paso3);
    }
    if (pasoData && pasoData.regiones)
    {
      const transformedData = transformData(pasoData.regiones);
      setFormData(transformedData);
    }
  }, [ updateStepNumber, stepNumber, observaciones, fetchObservaciones, pasoData ]);

  const transformData = (regiones) =>
  {
    return regiones.reduce((acc, region) =>
    {
      acc[ region.region ] = {
        paso3: region.paso3?.map((p3) => ({
          id: p3.id,
          universo_cobertura: p3.universo_cobertura || '',
          descripcion_cobertura: p3.descripcion_cobertura || '',
        })),
      };
      return acc;
    }, {});
  };

  const handleChange = (region, inputName, e) =>
  {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [ region ]: {
        ...prevFormData[ region ],
        paso3: prevFormData[ region ]?.paso3.map((p3) => ({
          ...p3,
          [ inputName ]: value,
        })),
      },
    }));
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [ region ]: {
        ...prevStatus[ region ],
        [ inputName ]: { loading: false, saved: false },
      },
    }));
  };

  const handleSave = async (region, inputName) =>
  {
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [ region ]: {
        ...prevStatus[ region ],
        [ inputName ]: { ...prevStatus[ region ][ inputName ], loading: true },
      },
    }));

    const datosParaEnviar = {
      regiones: [
        {
          region: region,
          paso3: formData[ region ]?.paso3,
        },
      ],
    };

    try
    {
      await handleUpdatePaso(id, stepNumber, datosParaEnviar);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ region ]: {
          ...prevStatus[ region ],
          [ inputName ]: { loading: false, saved: true },
        },
      }));
    } catch (error)
    {
      console.error('Error saving data for', inputName, ':', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ region ]: {
          ...prevStatus[ region ],
          [ inputName ]: { loading: false, saved: false },
        },
      }));
    }
  };

  if (!pasoData || !pasoData.regiones)
  {
    return (
      <div className="d-flex align-items-center flex-column my-5 px-5">
        <div className="text-center text-sans-h5-medium-blue">
          Cargando paso 3
        </div>
        <span className="placeholder col-6 bg-primary"></span>
      </div>
    );
  }

  const { regiones, solo_lectura, paso3encabezado } = pasoData;
  const avance = paso3encabezado?.avance;

  const handleGuardarObservacion = async () =>
  {
    if (!observacionesEnviadas)
    {
      const observacionData = {
        id: observaciones?.id, // Asumiendo que 'observaciones' es un estado que contiene el 'id' sectorial
        observacion_paso3: observacionPaso3,
      };

      await updateObservacion(observacionData);
    }
  };

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
        <MonoStepers stepNumber={paso3encabezado?.numero_paso} />
      </div>
      <div className="col-11">
        <div className="d-flex">
          <h3 className="mt-3 me-4">{paso3encabezado?.nombre_paso}</h3>
          <Avance avance={avance} id={id} />
        </div>
        <div className="container text-sans-h6-primary">
          <h6>
            Este apartado tiene por objetivo conocer y cuantificar la cobertura
            de la competencia considerando sus diferentes unidades de medición.
            Se debe comparar el universo de cobertura con la cobertura
            efectivamente abordada en el ejercicio de la competencia.
            <br />
            <br />
            Aquellas competencias que estén orientadas a una población objetivo,
            se debe identificar la población potencial, así como los mecanismos
            para cuantificarla y seleccionar a los beneficiarios/as finales. Las
            competencias que tengan otras unidades de medida deben realizar la
            misma tarea.
            <br />
            <br />
            Si la competencia está asociada a un programa que cuente con
            evaluación ex ante, se debe considerar la información más
            actualizada.
          </h6>
        </div>
        {regiones?.map((region, index) => (
          <div key={index} className="my-5">
            <div
              className="col-12 collapse-regiones border  border-bottom"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapseRegion${index}`}
              aria-expanded={collapseStates[ index ] ? 'true' : 'false'}
              aria-controls={`collapseRegion${index}`}
              onClick={() => toggleCollapse(index)}
            >
              <div className="d-flex justify-content-between">
                <span className="text-sans-h4 text-start">
                  {region?.region}
                </span>
                <button className="btn-secundario-s-round">
                  {collapseStates[ index ]
                    ? 'Ocultar sección'
                    : 'Mostrar sección'}
                  <span className="material-symbols-outlined">
                    {collapseStates[ index ]
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'}
                  </span>
                </button>
              </div>
              <div>
                <Avance avance={region?.paso3?.[ 0 ]?.avance} id={id} />
              </div>
            </div>
            <div
              className={`collapse ${collapseStates[ index ] ? 'show' : ''}`}
              id={`collapseRegion${index}`}
            >
              <div className="card card-body">
                <div className="row">
                  <div className="col-12 mt-3">
                    <CustomTextarea
                      label="Descripción de universo de cobertura (Obligatorio)"
                      placeholder="Describe el universo de cobertura"
                      name="universo_cobertura"
                      id="universo_cobertura"
                      value={
                        formData[ region.region ]?.paso3?.[ 0 ]?.universo_cobertura || ''
                      }
                      onChange={(e) => handleChange(region.region, 'universo_cobertura', e)}
                      onBlur={() => handleSave(region.region, 'universo_cobertura')}
                      loading={inputStatus[ region.region ]?.universo_cobertura?.loading}
                      saved={inputStatus[ region.region ]?.universo_cobertura?.saved}
                      readOnly={solo_lectura}
                      maxLength={800}
                    />
                    <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                      <i className="material-symbols-rounded me-2">info</i>
                      <h6 className="mt-0">
                        La descripción del universo de cobertura debe responder
                        preguntas tales como: ¿Cuál es el universo? ¿Cómo se
                        identifica?.
                      </h6>
                    </div>
                  </div>
                  <div className="mt-3 me-4">
                    <CustomTextarea
                      label="Descripción de cobertura efectivamente abordada (Obligatorio)"
                      placeholder="Describe la cobertura efectivamente abordada"
                      name="descripcion_cobertura"
                      id="descripcion_cobertura"
                      value={
                        formData[ region.region ]?.paso3?.[ 0 ]?.descripcion_cobertura || ''
                      }
                      onChange={(e) => handleChange(region.region, 'descripcion_cobertura', e)}
                      onBlur={() => handleSave(region.region, 'descripcion_cobertura')}
                      loading={inputStatus[ region.region ]?.descripcion_cobertura?.loading}
                      saved={inputStatus[ region.region ]?.descripcion_cobertura?.saved}
                      readOnly={solo_lectura}
                      maxLength={800}
                    />
                    <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
                      <i className="material-symbols-rounded me-2">info</i>
                      <h6 className="mt-0">
                        La descripción de la cobertura efectiva debe responder
                        preguntas tales como: ¿Cuál es? ¿Cómo se selecciona?.
                      </h6>
                    </div>
                  </div>
                  <>
                    <Subpaso_Tres
                      esquemaDatos={region?.cobertura_anual}
                      region={region?.region}
                      id={id}
                      stepNumber={stepNumber}
                      solo_lectura={solo_lectura}
                    />
                  </>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {mostrarInput && (
          <>
          {((userSubdere && formSectorialEnviado) || (userSectorial && observacionesEnviadas) || (userDIPRES && observacionesEnviadas) ) && (
              <div className="mt-5 my-4">
                {!observacionPaso3.trim() && observacionesEnviadas ? (
                  <p>No se han dejado observaciones en este paso.</p>
                ) : (
                  <CustomTextarea
                    label="Observaciones (Opcional)"
                    placeholder="Escribe tus observaciones de este paso del formulario"
                    rows={5}
                    maxLength={500}
                    value={observacionPaso3}
                    onChange={(e) => setObservacionPaso3(e.target.value)}
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

        {/* Botones navegación */}
        <div className="container me-5 pe-5">
          <ButtonsNavigate step={paso3encabezado?.numero_paso} id={id} />
        </div>
      </div>
    </>
  );
};

export default PasoTres;
