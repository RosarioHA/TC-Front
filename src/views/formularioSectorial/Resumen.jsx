import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avance } from "../../components/tables/Avance";
import { useResumenFormulario } from '../../hooks/formulario/useResumenFormulario';

const ResumenSectorial = () => {
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);
  const { id } = useParams();
  const { resumen, actualizarFormularioEnviado } = useResumenFormulario(id);

  useEffect(() => {
    if (resumen) {
      const pasosArray = Object
        .keys(resumen)
        .filter(key => key.startsWith('paso'))
        .map(key => resumen[ key ]);
      setPasos(pasosArray);
    }
  }, [ resumen ]);

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  const handleEnviarClick = async () => {
    try {
      await actualizarFormularioEnviado(true);
      navigate(`/home/success_formulario_sectorial/${id}`);
    } catch (error) {
      console.error("Error al enviar observaciones:", error);
    }
  };

  return (
    <>
      <div className="container container-xxl-fluid">
        <div className="text-center">
          <span className="text-sans-h1">Resumen formulario </span>
        </div>
        <div className="mb-5 me-5">

          {pasos.map(paso => (
            <div className="container" key={paso.numero_paso} >
              <div className="d-flex justify-content-between align-items-center">
                <div className="ps-5 col-4">
                  <span className=""><strong>Paso {paso.numero_paso}:</strong> {paso.nombre_paso} </span>
                </div>
                <div className="d-flex align-items-center">
                  <Avance avance={paso.avance} />
                </div>
                <div className="d-flex justify-content-center mx-3">
                  {paso.completado ?
                    <img src="/check.svg" alt="Check" /> :
                    <img src="/warning.svg" alt="Warning" />
                  }
                </div>
                <div className="col-2 d-flex justify-content-end">
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
        {!resumen?.formulario_completo && (
          <div className="mb-5 mx-5 px-2">
            <span className="text-serif-h2">
              Aún no puedes enviar el formulario
            </span>
            <p className="text-sans-h6">
              Para enviar el formulario debes completar todos los campos obligatorios de cada paso.
            </p>
          </div>
        )}

        {/*Botones navegacion  */}
        <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">

          <button className="btn-secundario-s" onClick={handleBackButtonClick} >
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            Atrás
          </button>

          <button className="btn-primario-s" disabled={!resumen?.formulario_completo} onClick={handleEnviarClick}>
            <u>Enviar el formulario</u>
          </button>
        </div>
      </div>
    </>
  )
}
export default ResumenSectorial; 