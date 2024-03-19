import { useContext, useEffect, useState } from 'react';
import { FormGOREContext } from '../../../context/FormGore';
import CustomTextarea from '../../forms/custom_textarea';

export const SubUno_Uno = ({ dataPaso }) => {
  const id = dataPaso ? dataPaso.id : null;
  const [descripcion, setDescripcion] = useState('');

  const { updatePasoGore,refetchTriggerGore } = useContext(FormGOREContext);
  const [inputStatus, setInputStatus] = useState({
    descripcion_ejercicio_competencia: { loading: false, saved: false },
  });

  useEffect(() => {
    refetchTriggerGore();
  }, [refetchTriggerGore]);


  useEffect(() => {
    if (dataPaso) {
      setDescripcion(dataPaso.descripcion_ejercicio_competencia || '');
    }
  }, [dataPaso]);

  const handleBlur = async () => {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      descripcion_ejercicio_competencia: { loading: true, saved: false },
    }));

    const payload = {
      id,
      paso1_gore: { descripcion_ejercicio_competencia: descripcion },
    };

    try {
      await updatePasoGore(payload);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        descripcion_ejercicio_competencia: { loading: false, saved: true },
      }));
      
    } catch (error) {
      console.error('Error updating data', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        descripcion_ejercicio_competencia: { loading: false, saved: false },
      }));
    }
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    setInputStatus(prevStatus => ({
      ...prevStatus,
      descripcion_ejercicio_competencia: { loading: false, saved: false },
    }));
  };



  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          1.1 Descripción del ejercicio de la competencia en el Gobierno Regional
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            Describir brevemente de qué manera proyecta el ejercicio de la
            competencia en el caso de ser transferida, asociándola a funciones o
            competencias que hoy realiza y que son estratégicas para su gestión
            y a la eventual interacción con otros organismos públicos que
            intervengan en su ejercicio.
          </h6>
        </div>
        <div className="my-4 ">
          <CustomTextarea
            label="Descripción (Obligatorio)"
            placeholder="Describe el ejercicio de la competencia en el Gobierno Regional."
            name="descripcion_ejercicio_competencia"
            maxLength={8800}
            value={dataPaso.descripcion_ejercicio_competencia} // Se usa el estado local `descripcion`
            onChange={handleDescripcionChange}
            onBlur={handleBlur}
            loading={inputStatus.descripcion_ejercicio_competencia.loading}
            saved={inputStatus.descripcion_ejercicio_competencia.saved}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-0">
              Se deben describir aquellos elementos que permitirían dar cuenta
              de una mejor calidad y oportunidad en la toma de decisiones, y una
              mejor adecuación de la Política Nacional en el territorio.
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};
