import { useContext, useEffect, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno } from '../../components/formSectorial/paso1/p1.1';
import { Subpaso_dos } from '../../components/formSectorial/paso1/p1.2';
import { Subpaso_tres } from '../../components/formSectorial/paso1/p1.3';
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from '../../components/stepers/MonoStepers';
import CustomTextarea from '../../components/forms/custom_textarea';
import { useAuth } from '../../context/AuthContext';
import { useObservacionesSubdere } from '../../hooks/formulario/useObSubdereSectorial'; 

const PasoUno = () => {
  const { pasoData, errorPaso, updateStepNumber, data } = useContext(FormularioContext);
  const stepNumber = 1;
  const { userData } = useAuth();
  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const { observaciones, updateObservacion, fetchObservaciones } = useObservacionesSubdere(data ? data.id : null);
  const [observacionPaso1, setObservacionPaso1] = useState("");

  useEffect(() => {
    updateStepNumber(stepNumber);
    if (observaciones && Object.keys(observaciones).length === 0) {
      fetchObservaciones();
    }
    if (observaciones && observaciones.observacion_paso1) {
      setObservacionPaso1(observaciones.observacion_paso1);
    }
    console.log("observacion paso 1", observaciones.observacion_paso1)
  }, [updateStepNumber, stepNumber, observaciones, data, fetchObservaciones]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;
  
  const { marcojuridico, organigramaregional, paso1 } = pasoData;
  const paso1Data = paso1 || {}; 

  const handleGuardarObservacion = async () => {
    const observacionData = {
      observacion_paso1: observacionPaso1,
    };
    await updateObservacion(observacionData);
  };

  return (
    <>
      <div className="col-1">
      {paso1Data.numero_paso && <MonoStepers stepNumber={paso1Data.numero_paso} />}
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3 me-4">{paso1Data.nombre_paso}</h3>
            <Avance avance={paso1Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_uno dataPaso={paso1Data} marcojuridico={marcojuridico} id={data ? data.id : null} stepNumber={stepNumber} />
          <Subpaso_dos pasoData={paso1Data} organigrama={organigramaregional}  id={data ? data.id : null} stepNumber={stepNumber} />
          <Subpaso_tres pasoData={paso1Data}   id={data ? data.id : null} stepNumber={stepNumber} />

          {userSubdere && (
            <div className="mt-5 my-4">
            <CustomTextarea 
            label="Observaciones (Opcional)"
            placeholder="Escribe tus observaciones de este paso del formulario"
            rows={5}
            maxLength={500}
            value={observacionPaso1}
            onChange={(e) => setObservacionPaso1(e.target.value)}
            />
            {/* aqui reemplazar boton por metodo automatico */}
            <button onClick={handleGuardarObservacion}>Guardar Observaciones</button>
          </div>
          )}

          <ButtonsNavigate step={paso1Data.numero_paso} id={data ? data.id : null} />
        </div>
      </div>
    </>
  );
};

export default PasoUno;