import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avance } from "../../components/tables/Avance";
import { useResumenFormulario } from '../../hooks/formulario/useResumenFormulario';

const ResumenSectorial = () => {
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);
  const [ todosCompletos, setTodosCompletos ] = useState(false);
  const { id } = useParams();
  const { resumen } = useResumenFormulario(id);

  useEffect(() => {
    if (resumen) {
      const pasosArray = Object
        .keys(resumen)
        .filter(key => key.startsWith('paso'))
        .map(key => resumen[key]);
      setPasos(pasosArray);
    }
  }, [resumen]);

  useEffect(() => {
    const todosPasosCompletos = pasos.every(paso => isStageComplete(paso.avance));
    setTodosCompletos(todosPasosCompletos);
  }, [ pasos ]);

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  const isStageComplete = (avance) => {
    return avance === "10/10";
  }

  return (
    <>
      <div className="container-fluid">
        <div className="text-center">
          <span className="text-sans-h1">Resumen formulario </span>
        </div>
        <div className="mb-5 me-5">

          {pasos.map(paso => (
            <div className="container" key={paso.numero_paso} >
              <div className="row align-items-center ">
                <div className="col-4 ps-5">
                  <span className=""><strong>Paso {paso.numero_paso}:</strong> {paso.nombre_paso} </span>
                </div>
                <div className="col-5 d-flex align-items-center">
                  <Avance avance={paso.avance} />
                </div>
                <div className="col d-flex justify-content-center">
                  {paso.completado ?
                    <img src="/public/check.svg" alt="Check"/> :
                    <img src="/public/warning.svg" alt="Warning"/>
                  }
                </div>
                <div className="col-2">
                  {paso.completado ? (
                    <div className="d-flex justify-content-center">
                      <span className="text-sans-p-blue text-center">Listo</span>
                    </div>
                  ) : (
                    <button 
                    className="btn-secundario-s my-2"
                    onClick={() => navigate(`/home/formulario_sectorial/${id}/paso_${paso.numero_paso}`)}
                    >
                      Completar paso
                    </button>
                  )}
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

          <button className="btn-primario-s" disabled={!todosCompletos}>
            <u>Enviar el formulario</u>
          </button>
        </div>
      </div>
    </>
  )
}
export default ResumenSectorial; 