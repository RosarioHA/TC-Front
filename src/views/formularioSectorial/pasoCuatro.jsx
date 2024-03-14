import { useEffect, useContext, useState } from "react";
import { Avance } from "../../components/tables/Avance";
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { FormularioContext } from "../../context/FormSectorial";
import { Subpaso_CuatroUno } from "../../components/formSectorial/paso4/p4.1";
import { MonoStepers } from "../../components/stepers/MonoStepers";
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial';

const PasoCuatro = () => {
  const { updateStepNumber, pasoData, data } = useContext(FormularioContext);
  const stepNumber = 4;
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const { observaciones, updateObservacion, fetchObservaciones, loadingObservaciones, saved } = useObservacionesSubdere(data ? data.id : null);
  const [observacionPaso4, setObservacionPaso4] = useState("");

  const formularioEnviado = data.formulario_enviado
  const observacionesEnviadas = observaciones.observacion_enviada

  useEffect(() => {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0) {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso4) {
      setObservacionPaso4(observaciones.observacion_paso4);
    }
  }, [updateStepNumber, stepNumber, observaciones, fetchObservaciones]);

  if (!pasoData) return <div>No hay datos disponibles para el Paso 4</div>;

  const { paso4: paso4Data, indicador_desempeno, lista_indicadores, solo_lectura } = pasoData;
  if (!paso4Data) return <div>Cargando Paso 4...</div>;

  const id = data?.id;

  const handleGuardarObservacion = async () => {
    const observacionData = {
      observacion_paso4: observacionPaso4,
    };
    await updateObservacion(observacionData);
  };

  const avance = pasoData?.paso4?.avance; 

  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso4Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container vh-100">
          <div className="d-flex">
            <h3 className="mt-3">{paso4Data.nombre_paso}</h3>
            <Avance avance={avance}  id={id}/>
          </div>
          <div className="mt-4">
            <h6 className="text-sans-h6-primary">Los indicadores de desempeño, deben incluir una descripción de los componentes del indicador, asi como los medios utilizados para su calculo y sus medios de verificación. Si la competencia esta asociada a un programa que cuente con evaluación ex ante, se debe considerar la información incluida en su versión mas actualizada.</h6>
            <h6 className="text-sans-h6-primary mt-3">De no contar la competencia con indicadores de desempeño asociados, este apartado debe ser omitido.</h6>
            <h6 className="text-sans-h6-primary mt-3">Si el ejercicio de la competencia tiene mas de un indicador de desempeño, se deben añadir las tablas correspondientes.</h6>
            <div className="my-5 pb-3 border-bottom">
              <div className="">
                {/* Componente adicional en blanco para un nuevo indicador */}
                {indicador_desempeno && (
                  <Subpaso_CuatroUno
                    data={pasoData}
                    id={id}
                    stepNumber={stepNumber}
                    listaIndicadores={lista_indicadores}
                    readOnly={false}
                    solo_lectura = {solo_lectura}
                  />
                )}
              </div>
            </div>
          </div>

          {userSubdere && formularioEnviado && (
            <div className="mt-5 my-4">
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
          </div>
          )}

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
