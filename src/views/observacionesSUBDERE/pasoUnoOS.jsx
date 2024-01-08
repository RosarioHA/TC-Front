import { useContext, useEffect, useState } from 'react';
import { Avance } from "../../components/tables/Avance";
import { FormularioContext } from '../../context/FormSectorial';
import { Subpaso_uno_OS } from '../../components/obsSUBDERE/paso1/p1.1OS';
import { Subpaso_dos_OS } from '../../components/obsSUBDERE/paso1/p1.2OS'; 
import { Subpaso_tres_OS } from '../../components/obsSUBDERE/paso1/p1.3OS'; 
import { ButtonsNavigate } from "../../components/layout/ButtonsNavigate";
import { MonoStepers } from '../../components/stepers/MonoStepers';
import CustomTextarea from '../../components/forms/custom_textarea';

const PasoUnoOS = () => {
  const { pasoData, loadingPaso, errorPaso, updateStepNumber,data } = useContext(FormularioContext);
  const [ observacionSubdere, setObservacionSubdere ] = useState('');
  const stepNumber = 1;
  
  useEffect(() => {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (loadingPaso) return <div>Cargando...</div>;
  if (errorPaso) return <div>Error: {errorPaso.message || "Error desconocido"}</div>;
  if (!pasoData || pasoData.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { marcojuridico, organigramaregional, paso1 } = pasoData;

  const paso1Data = paso1;

  if (!paso1Data) return <div>No hay datos disponibles para el Paso 1</div>;
  
  const handleObservacionChange = (event) => {
    const observacion = event.target.value;
    setObservacionSubdere(observacion);
  };
  
  return (
    <>
      <div className="col-1">
        <MonoStepers stepNumber={paso1Data.numero_paso} />
      </div>
      <div className="col-11">
        <div className="container-fluid ">
          <div className="d-flex">
            <h3 className="mt-3">{paso1Data.nombre_paso}</h3>
            <Avance avance={paso1Data.avance} />
          </div>
          <span className="text-sans-h6-primary">Texto de apoyo</span>
          <Subpaso_uno_OS pasoData={paso1Data} marcojuridico={marcojuridico}/>
          <Subpaso_dos_OS pasoData={paso1Data} organigrama={organigramaregional} />
          <Subpaso_tres_OS pasoData={paso1Data} />

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
          
          <ButtonsNavigate step={paso1Data.numero_paso} id={data.id} />
        </div>
        
      </div>
    </>
  );
};

export default PasoUnoOS;