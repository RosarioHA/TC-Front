import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avance } from "../../components/tables/Avance";

const ResumenSectorial = () =>
{
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);

  useEffect(() =>
  {
    const datosSimulados = [
      { numero_paso: 1, nombre_paso: 'Descripción de la Institución', avance: '0/10' },
      { numero_paso: 2, nombre_paso: 'Arquitectura del Proceso', avance: '0/10' },
      { numero_paso: 3, nombre_paso: 'Cobertura de la Competencia', avance: '0/10' },
      { numero_paso: 4, nombre_paso: 'Indicadores de Desempeño', avance: '0/10' },
      { numero_paso: 5, nombre_paso: 'Costeo de la Competencia', avance: '0/10' },


    ];
    setPasos(datosSimulados);
  }, []);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  }


  const isStageComplete = (avance) =>
  {

    return avance === "10/10";
  }


  return (
    <>
      <div className="container-fluid">
        <div className="text-center">
          <span className="text-sans-h1">Resumen formulario </span>
        </div>
        <div className="mb-5">

          {pasos.map(paso => (
            <div className="container mx-5 px-4" key={paso.numero_paso} >
              <div className="row align-items-center">
                <div className="col-3">
                  <span className=""><strong>Paso {paso.numero_paso}:</strong> {paso.nombre_paso} </span>
                </div>
                <div className="col-6">
                  <Avance avance={paso.avance} />
                  {isStageComplete(paso.avance) ?
                    <img src="/public/check.svg" alt="Check" /> :
                    <img src="/public/warning.svg" alt="Warning" />
                  }
                </div>
                <div className="col">
                  <button className="btn-secundario-s my-2">
                    Completar paso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*Botones navegacion  */}
        <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">

          <button className="btn-secundario-s" onClick={handleBackButtonClick} >
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            Atrás
          </button>

          <button className="btn-primario-s">
            Ir a resumen de formulario
          </button>
        </div>
      </div >
    </>
  )
}
export default ResumenSectorial; 