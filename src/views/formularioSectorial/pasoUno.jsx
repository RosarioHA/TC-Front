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

  const { observaciones, updateObservacion } = useObservacionesSubdere(data ? data.id : null);
  const [observacionPaso1, setObservacionPaso1] = useState("");
  console.log("observaciones en vista p1", observaciones)

  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [updateStepNumber, stepNumber]);

  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;
  
  const { marcojuridico, organigramaregional, paso1 } = pasoData;
  const paso1Data = paso1 || {}; 

  const handleGuardarObservacion = async () => {
    // Aquí podrías obtener el valor del textarea donde el usuario Subdere ingresa comentarios
    // y luego utilizar el hook para actualizar las observaciones
    const observacionData = {
      observacion_paso1: observacionPaso1,
      // Puedes agregar observacion_paso2, observacion_paso3, etc., según sea necesario
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